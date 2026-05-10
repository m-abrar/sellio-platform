<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\User;
use App\Http\Requests\Admin\UpdateClassifiedInquiryRequest;
use App\Services\Admin\ClassifiedInquiryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ClassifiedInquiryController
 * Orchestrates administrative lead management for the general classifieds vertical, 
 * including inquiry tracking, status updates, and view-state persistence.
 */
class ClassifiedInquiryController extends Controller
{
    /**
     * @var ClassifiedInquiryManagementService
     */
    protected ClassifiedInquiryManagementService $inquiryService;

    /**
     * ClassifiedInquiryController constructor.
     *
     * @param ClassifiedInquiryManagementService $inquiryService
     */
    public function __construct(ClassifiedInquiryManagementService $inquiryService)
    {
        $this->inquiryService = $inquiryService;
    }

    /**
     * Display a filtered and paginated list of all classified inquiries.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');
        $filters = array_merge($request->only(['classifiedad', 'ad_name', 'category']), ['status' => $status]);

        $inquiries = $this->inquiryService->getInquiries($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $classifieds = Classified::select('id', 'title', 'category_id')->with('category:id,title')->limit(100)->get();
        $categories = Category::where('is_classified', true)->select('id', 'title')->get();

        return view('admin.classified-inquiries.index', compact('inquiries', 'classifieds', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new manual classified inquiry.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $inquiry = new ClassifiedInquiry();
        // Performance: Cap selection to prevent memory exhaustion.
        $classifieds = Classified::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();
        
        return view('admin.classified-inquiries.form', compact('inquiry', 'classifieds', 'users'));
    }

    /**
     * Store a newly created classified inquiry record in the database.
     *
     * @param  \App\Http\Requests\Admin\UpdateClassifiedInquiryRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UpdateClassifiedInquiryRequest $request): RedirectResponse
    {
        $this->inquiryService->createInquiry($request->validated());

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry logged successfully.'));
    }

    /**
     * Display the specified classified inquiry and update its viewed status.
     *
     * @param  \App\Models\ClassifiedInquiry  $classifiedInquiry
     * @return \Illuminate\View\View
     */
    public function show(ClassifiedInquiry $classifiedInquiry): View
    {
        $classifiedInquiry->load(['classifiedAd', 'user']);

        $this->inquiryService->markAsViewed($classifiedInquiry);

        return view('admin.classified-inquiries.show', ['inquiry' => $classifiedInquiry]);
    }

    /**
     * Show the form for editing an existing classified inquiry.
     *
     * @param  \App\Models\ClassifiedInquiry  $classifiedInquiry
     * @return \Illuminate\View\View
     */
    public function edit(ClassifiedInquiry $classifiedInquiry): View
    {
        // Performance: Cap selection to prevent memory exhaustion.
        $classifieds = Classified::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();

        return view('admin.classified-inquiries.form', [
            'inquiry'     => $classifiedInquiry, 
            'classifieds' => $classifieds, 
            'users'       => $users
        ]);
    }

    /**
     * Update the specified classified inquiry in the database.
     *
     * @param  \App\Http\Requests\Admin\UpdateClassifiedInquiryRequest  $request
     * @param  \App\Models\ClassifiedInquiry  $classifiedInquiry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateClassifiedInquiryRequest $request, ClassifiedInquiry $classifiedInquiry): RedirectResponse
    {
        $this->inquiryService->updateInquiry($classifiedInquiry, $request->validated());

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry updated successfully.'));
    }

    /**
     * Remove the specified classified inquiry from the database.
     *
     * @param  \App\Models\ClassifiedInquiry  $classifiedInquiry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ClassifiedInquiry $classifiedInquiry): RedirectResponse
    {
        $this->inquiryService->deleteInquiry($classifiedInquiry);

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry deleted successfully.'));
    }
}
