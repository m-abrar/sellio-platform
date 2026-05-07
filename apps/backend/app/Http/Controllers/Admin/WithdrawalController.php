<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class WithdrawalController
 * Orchestrates the administrative payout lifecycle, managing fund reservations, 
 * bank transfer approvals, and automated wallet reconciliation for rejected requests.
 */
class WithdrawalController extends Controller
{
    /**
     * Internal helper to retrieve the base withdrawal query with essential relationships.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function getWithdrawalsQuery(): Builder
    {
        return Withdrawal::with('user')->latest();
    }
    
    /**
     * Display a filtered and paginated list of all withdrawal requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->get('status');
        $query = $this->getWithdrawalsQuery();
        
        if ($status && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
            $filter_status = $status;
        } else {
            $filter_status = 'all';
        }
        
        $withdrawals = $query->paginate(20);
        
        return view('admin.withdrawals.index', compact('withdrawals', 'filter_status'));
    }

    /**
     * Display a paginated list of all pending withdrawal requests.
     *
     * @return \Illuminate\View\View
     */
    public function pending(): View
    {
        $withdrawals = $this->getWithdrawalsQuery()->where('status', 'pending')->paginate(20);
        $filter_status = 'pending';
        
        return view('admin.withdrawals.index', compact('withdrawals', 'filter_status'));
    }

    /**
     * Display a paginated list of all failed/rejected withdrawal requests.
     *
     * @return \Illuminate\View\View
     */
    public function failed(): View
    {
        $withdrawals = $this->getWithdrawalsQuery()->where('status', 'rejected')->paginate(20);
        $filter_status = 'rejected';
        
        return view('admin.withdrawals.index', compact('withdrawals', 'filter_status'));
    }

    /**
     * Approve a withdrawal request and finalize the balance reservation for payout.
     *
     * @param  \App\Models\Withdrawal  $withdrawal
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(Withdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', __('The withdrawal request is already :status.', ['status' => $withdrawal->status]));
        }

        // Verify that the initial wallet reservation exists
        $initialTransaction = $withdrawal->user->transactions()
            ->where('type', 'withdraw')
            ->whereJsonContains('meta', ['withdrawal_id' => $withdrawal->id])
            ->first();

        if (!$initialTransaction) {
            Log::warning("Potential Reconciliation Risk: Missing wallet reservation for withdrawal ID: {$withdrawal->id} during approval.");
        }

        try {
            DB::transaction(function () use ($withdrawal) {
                $withdrawal->update([
                    'status'      => 'approved',
                    'approved_at' => now(),
                    'admin_note'  => 'Approved and scheduled for bank transfer.', 
                ]);
            });
            
            return back()->with('success', __('Withdrawal approved successfully. Reservation finalized for payout.'));

        } catch (\Exception $e) {
            Log::error("Withdrawal Approval Failure: {$e->getMessage()}", ['id' => $withdrawal->id]);
            return back()->with('error', __('Approval failed due to a database error.'));
        }
    }

    /**
     * Reject a withdrawal request and atomically refund the reserved funds to the user's wallet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Withdrawal  $withdrawal
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Request $request, Withdrawal $withdrawal): RedirectResponse
    {
        $request->validate([
            'admin_note' => 'required|string|max:255',
        ]);
        
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', __('The withdrawal request is already :status.', ['status' => $withdrawal->status]));
        }

        $initialTransaction = $withdrawal->user->transactions()
            ->where('type', 'withdraw')
            ->whereJsonContains('meta', ['withdrawal_id' => $withdrawal->id])
            ->first();

        try {
            DB::transaction(function () use ($withdrawal, $request, $initialTransaction) {

                // Orchestrate Wallet Refund
                if ($initialTransaction) {
                    $withdrawal->user->deposit($withdrawal->amount, [
                        'type'           => 'withdrawal_refund',
                        'description'    => "Withdrawal Request #{$withdrawal->id} Rejected/Refunded",
                        'reversal_of_id' => $initialTransaction->id,
                    ]);
                }

                $withdrawal->update([
                    'status'      => 'rejected',
                    'admin_note'  => $request->input('admin_note'),
                    'rejected_at' => now(),
                ]);
            });

            return back()->with('success', __('Withdrawal rejected and funds refunded to the user wallet.'));

        } catch (\Exception $e) {
            Log::error("Withdrawal Rejection Failure: {$e->getMessage()}", ['id' => $withdrawal->id]);
            return back()->with('error', __('Rejection failed due to a database error.'));
        }
    }
}
