<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Bavix\Wallet\Models\Transaction; 
use App\Http\Resources\TransactionResource;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Partner\ProcessWithdrawalRequest;
use Illuminate\Support\Facades\Log;
use App\Services\WalletService;

class WalletController extends Controller
{
    public function overview(Request $request)
    {
        $partner = $request->user();
        
        $balance = $partner->wallet_balance;
        
        // 1. Lifetime Earnings (deposits)
        $lifetimeEarnings = ($partner->transactions()
            ->where('type', 'deposit')
            ->sum('amount') ?? 0) / 100;
            
        // 2. Approved Payouts (Completed)
        $approvedPayouts = ($partner->withdrawals()
            ->where('status', 'approved')
            ->sum('amount') ?? 0) / 100;
            
        // 3. Pending Payouts (Awaiting Review)
        $pendingPayouts = ($partner->withdrawals()
            ->where('status', 'pending')
            ->sum('amount') ?? 0) / 100;
            
        // 4. Rejected Payouts (Failed / Returned)
        $rejectedPayouts = ($partner->withdrawals()
            ->where('status', 'rejected')
            ->sum('amount') ?? 0) / 100;

        $transactions = $partner->transactions()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return $this->successResponse([
            'balance' => $balance,
            'lifetimeEarnings' => $lifetimeEarnings,
            'approvedPayouts' => $approvedPayouts,
            'pendingPayouts' => $pendingPayouts,
            'rejectedPayouts' => $rejectedPayouts,
            'transactions' => TransactionResource::collection($transactions)->resolve(),
        ]);
    }

    public function history(Request $request)
    {
        $partner = $request->user();

        $transactions = $partner->transactions()
            ->orderBy('created_at', 'desc')
            ->paginate(25); 

        return $this->successResponse(TransactionResource::collection($transactions));
    }

    public function withdrawals(Request $request)
    {
        $partner = $request->user();
        $balance = $partner->wallet_balance;
        
        $withdrawalRecords = $partner->withdrawals()
            ->latest()
            ->paginate(15);

        return $this->successResponse([
            'balance' => $balance, 
            'withdrawalRecords' => $withdrawalRecords, 
        ]);
    }
    
    public function processWithdrawal(ProcessWithdrawalRequest $request, WalletService $service)
    {
        try {
            $service->processWithdrawal($request->user(), $request->validated());
            
            return $this->successResponse(null, 'Withdrawal request for $' . number_format($request->validated()['amount'], 2) . ' submitted successfully. It is now pending approval.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
