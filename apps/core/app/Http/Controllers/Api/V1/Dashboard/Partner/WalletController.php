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
        
        $balance = $partner->balance; 
        
        $lifetimeEarnings = $partner->transactions()
            ->where('type', 'deposit')
            ->sum('amount');
            
        $pendingWithdrawals = $partner->transactions()
            ->where('type', 'withdraw')
            ->where('confirmed', true)
            ->whereJsonContains('meta', ['type' => 'withdrawal_request'])
            ->sum('amount'); 

        $transactions = $partner->transactions()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return $this->successResponse([
            'balance' => $balance,
            'lifetimeEarnings' => $lifetimeEarnings,
            'pendingWithdrawals' => $pendingWithdrawals,
            'transactions' => TransactionResource::collection($transactions),
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
        $balance = $partner->balance; 
        
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
