<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class WithdrawalController extends Controller
{
    private function getWithdrawalsQuery()
    {
        return Withdrawal::with('user')->latest();
    }
    
    public function index(Request $request)
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

    public function pending()
    {
        $withdrawals = $this->getWithdrawalsQuery()->where('status', 'pending')->paginate(20);
        $filter_status = 'pending';
        return view('admin.withdrawals.index', compact('withdrawals', 'filter_status'));
    }

    public function failed()
    {
        $withdrawals = $this->getWithdrawalsQuery()->where('status', 'rejected')->paginate(20);
        $filter_status = 'rejected';
        return view('admin.withdrawals.index', compact('withdrawals', 'filter_status'));
    }

    public function approve(Withdrawal $withdrawal)
    {
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'The withdrawal request is already ' . $withdrawal->status . '.');
        }

        $initialTransaction = $withdrawal->user->transactions()
            ->where('type', 'withdraw')
            ->whereJsonContains('meta', ['withdrawal_id' => $withdrawal->id])
            ->first();

        if (!$initialTransaction) {
            \Log::error('Critical Warning: Could not find initial wallet transaction for withdrawal ID: ' . $withdrawal->id . ' upon approval attempt.');
        }

        try {
            DB::transaction(function () use ($withdrawal) {
                $withdrawal->update([
                    'status' => 'approved',
                    'approved_at' => now(),
                    'admin_note' => 'Approved and scheduled for bank transfer.', 
                ]);
            });
        } catch (\Exception $e) {
            \Log::error('Admin Withdrawal Approval Error: ' . $e->getMessage(), ['withdrawal_id' => $withdrawal->id]);
            return back()->with('error', 'Approval failed. Database error occurred: ' . $e->getMessage());
        }

        return back()->with('success', 'Withdrawal approved successfully. The initial balance deduction is now finalized for payout.');
    }

    public function reject(Request $request, Withdrawal $withdrawal)
    {
        $request->validate([
            'admin_note' => 'required|string|max:255',
        ]);
        
        if ($withdrawal->status !== 'pending') {
            return back()->with('error', 'The withdrawal request is already ' . $withdrawal->status . '.');
        }

        $initialTransaction = $withdrawal->user->transactions()
            ->where('type', 'withdraw')
            ->whereJsonContains('meta', ['withdrawal_id' => $withdrawal->id])
            ->first();

        try {
            DB::transaction(function () use ($withdrawal, $request, $initialTransaction) {

                if ($initialTransaction) {
                    $withdrawal->user->deposit($withdrawal->amount, [
                        'type' => 'withdrawal_refund',
                        'description' => 'Withdrawal Request #' . $withdrawal->id . ' Rejected/Refunded',
                        'reversal_of_id' => $initialTransaction->id,
                    ]);
                }

                $withdrawal->update([
                    'status' => 'rejected',
                    'admin_note' => $request->input('admin_note'),
                    'rejected_at' => now(),
                ]);
            });

        } catch (\Exception $e) {
            \Log::error('Admin Withdrawal Rejection Error: ' . $e->getMessage(), ['withdrawal_id' => $withdrawal->id]);
            return back()->with('error', 'Rejection failed. Database error occurred: ' . $e->getMessage());
        }

        return back()->with('success', 'Withdrawal rejected. Funds have been returned to the user\'s wallet (if they were previously reserved).');
    }
}
