<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Class WithdrawalController
 * Orchestrates the partner-facing payout requests, managing balance verification 
 * and transactional fund reservation via the WalletService.
 */
class WithdrawalController extends Controller
{
    /**
     * Internal service coordinator for wallet and payout logic.
     * @var WalletService
     */
    protected WalletService $walletService;

    /**
     * WithdrawalController constructor.
     * @param WalletService $walletService
     */
    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Process a new withdrawal request for the authenticated partner.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount'  => 'required|numeric|min:1',
            'method'  => 'required|string|max:255',
            'details' => 'nullable|array',
        ]);

        try {
            $this->walletService->processWithdrawal(Auth::user(), $validated);

            return $this->successResponse(
                null, 
                __('Withdrawal request submitted successfully for approval.')
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
