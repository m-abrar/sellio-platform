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
     * @var \App\Services\Admin\WithdrawalManagementService
     */
    protected $withdrawalService;

    /**
     * WithdrawalController constructor.
     *
     * @param \App\Services\Admin\WithdrawalManagementService $withdrawalService
     */
    public function __construct(\App\Services\Admin\WithdrawalManagementService $withdrawalService)
    {
        $this->withdrawalService = $withdrawalService;
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
        try {
            $this->withdrawalService->approveWithdrawal($withdrawal);
            
            return back()->with('success', __('Withdrawal approved successfully. Reservation finalized for payout.'));

        } catch (\Exception $e) {
            Log::error("Withdrawal Approval Failure: {$e->getMessage()}", ['id' => $withdrawal->id]);
            return back()->with('error', $e->getMessage() ?: __('Approval failed.'));
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
        $validated = $request->validate([
            'admin_note' => 'required|string|max:255',
        ]);
        
        try {
            $this->withdrawalService->rejectWithdrawal($withdrawal, $validated['admin_note']);

            return back()->with('success', __('Withdrawal rejected and funds refunded to the user wallet.'));

        } catch (\Exception $e) {
            Log::error("Withdrawal Rejection Failure: {$e->getMessage()}", ['id' => $withdrawal->id]);
            return back()->with('error', $e->getMessage() ?: __('Rejection failed.'));
        }
    }
}
}
