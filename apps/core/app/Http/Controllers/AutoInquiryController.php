<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAutoInquiryRequest;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Services\AutoInquiryService;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

/**
 * Class AutoInquiryController
 *
 * Handles customer inquiries and test drive requests for vehicles.
 * * @package App\Http\Controllers
 */
class AutoInquiryController extends Controller
{
    /**
     * @var AutoInquiryService
     */
    protected AutoInquiryService $autoInquiryService;

    /**
     * AutoInquiryController constructor.
     *
     * @param AutoInquiryService $autoInquiryService
     */
    public function __construct(AutoInquiryService $autoInquiryService)
    {
        $this->autoInquiryService = $autoInquiryService;
    }

    /**
     * Store a new inquiry in the database.
     *
     * @param StoreAutoInquiryRequest $request
     * @param Auto $auto
     * @return RedirectResponse
     */
    public function store(StoreAutoInquiryRequest $request, Auto $auto): RedirectResponse
    {
        // Security check: ensure the request ID matches the route model
        if ((int) $request->input('auto_id') !== $auto->id) {
            return back()->with('error', __('Security check failed: Auto ID mismatch. Please try again.'));
        }

        try {
            $inquiry = $this->autoInquiryService->createInquiry($auto, $request->validated());

            $message = __('Your Test Drive request for the :make :model has been sent to the dealer.', [
                'make'  => $auto->make,
                'model' => $auto->model,
            ]);

            return redirect()
                ->route('autos.inquiry.confirmation', ['auto' => $auto->slug, 'inquiry' => $inquiry->id])
                ->with('success', $message);
        } catch (Exception $e) {
            Log::error("Auto inquiry submission failed: " . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', __('A system error occurred while submitting your inquiry. Please try again.'));
        }
    }

    /**
     * Display the confirmation page for a specific inquiry.
     *
     * @param Auto $auto
     * @param AutoInquiry $inquiry
     * @return View
     */
    public function show(Auto $auto, AutoInquiry $inquiry): View
    {
        $this->authorizeInquiryAccess($auto, $inquiry);

        return view('frontend.autos.inquiry.confirmation', [
            'auto'    => $auto,
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Private helper to validate access permissions.
     *
     * @param Auto $auto
     * @param AutoInquiry $inquiry
     * @return void
     */
    private function authorizeInquiryAccess(Auto $auto, AutoInquiry $inquiry): void
    {
        if ($inquiry->auto_id !== $auto->id) {
            abort(404);
        }

        if (auth()->check() && $inquiry->user_id !== null && auth()->id() !== $inquiry->user_id) {
            abort(403, __('Unauthorized access to this inquiry record.'));
        }
    }
}
