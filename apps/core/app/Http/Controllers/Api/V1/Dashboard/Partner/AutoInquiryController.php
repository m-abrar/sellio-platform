<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\AutoInquiry;
use App\Http\Resources\AutoInquiryResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class AutoInquiryController
 * * Manages customer inquiries for vehicles listed by the authenticated partner.
 */
class AutoInquiryController extends Controller
{
    /**
     * @var AutoInquiry
     */
    protected $autoInquiry;

    /**
     * AutoInquiryController constructor.
     * * @param AutoInquiry $autoInquiry
     */
    public function __construct(AutoInquiry $autoInquiry)
    {
        $this->autoInquiry = $autoInquiry;
    }

    /**
     * Display a listing of inquiries for the partner's auto listings.
     *
     * @return View
     */
    public function index() {
        $user = Auth::user();

        /** * Retrieve IDs of vehicles owned by the partner 
         * to filter the global inquiries table.
         */
        $autoListingIds = $user->autos()->pluck('id');

        $autoInquiries = $this->autoInquiry::whereIn('auto_id', $autoListingIds)
            ->with(['auto' => function ($query) {
                $query->select('id', 'title', 'slug', 'brand_id');
            }])
            ->latest()
            ->paginate(10);

        return $this->successResponse(AutoInquiryResource::collection($autoInquiries));
    }

    /**
     * Display the specified inquiry details.
     *
     * @param AutoInquiry $autoInquiry
     * @return View
     */
    public function show(AutoInquiry $autoInquiry) {
        $this->authorizeOwner($autoInquiry);

        return $this->successResponse([
            'inquiry' => $autoInquiry->load('auto')
        ]);
    }

    /**
     * Mark an inquiry as read or updated.
     *
     * @param AutoInquiry $autoInquiry
     * @return RedirectResponse
     */
    public function markAsRead(AutoInquiry $autoInquiry) {
        $this->authorizeOwner($autoInquiry);

        $autoInquiry->update(['is_read' => true]);

        return $this->successResponse(null, __('Inquiry marked as read.'));
    }

    /**
     * Remove the specified inquiry from storage.
     *
     * @param AutoInquiry $autoInquiry
     * @return RedirectResponse
     */
    public function destroy(AutoInquiry $autoInquiry) {
        $this->authorizeOwner($autoInquiry);
        
        $autoInquiry->delete();

        return $this->successResponse(null, __('Inquiry deleted successfully.'));
    }

    /**
     * Authorize that the partner owns the vehicle associated with the inquiry.
     *
     * @param AutoInquiry $autoInquiry
     * @return void
     */
    protected function authorizeOwner(AutoInquiry $autoInquiry): void
    {
        if (Auth::id() !== $autoInquiry->auto->user_id) {
            abort(403, __('Unauthorized access to this inquiry record.'));
        }
    }
}
