<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\User;
use App\Services\Admin\AutoInquiryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class AutoInquiryController
 * Orchestrates administrative lead management for the automotive vertical, 
 * including inquiry tracking, status updates, and relationship mapping.
 */
class AutoInquiryController extends Controller
{
    /**
     * @var AutoInquiryManagementService
     */
    protected AutoInquiryManagementService $inquiryService;

    /**
     * AutoInquiryController constructor.
     *
     * @param AutoInquiryManagementService $inquiryService
     */
    public function __construct(AutoInquiryManagementService $inquiryService)
    {
        $this->inquiryService = $inquiryService;
    }

    /**
     * Display a filtered and paginated list of automotive inquiries.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');
        $filters = array_merge($request->only(['auto', 'search']), ['status' => $status]);

        $inquiries = $this->inquiryService->getInquiries($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $autos = Auto::select('id', 'title')->limit(100)->get();

        return view('admin.auto-inquiries.index', compact('inquiries', 'autos', 'status'));
    }

    /**
     * Display the specific details of an automotive inquiry.
     *
     * @param  \App\Models\AutoInquiry  $autoInquiry
     * @return \Illuminate\View\View
     */
    public function show(AutoInquiry $autoInquiry): View
    {
        $autoInquiry->load(['auto', 'user']);
        return view('admin.auto-inquiries.show', ['inquiry' => $autoInquiry]);
    }

    /**
     * Show the form for creating a new manual automotive inquiry record.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $inquiry = new AutoInquiry();
        // Performance: Cap selection to prevent memory exhaustion.
        $autos = Auto::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();
        
        return view('admin.auto-inquiries.form', compact('inquiry', 'autos', 'users'));
    }

    /**
     * Store a newly created automotive inquiry record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'auto_id'        => 'required|exists:autos,id',
            'user_id'        => 'required|exists:users,id',
            'full_name'      => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:20',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string|max:255',
            'message'        => 'nullable|string',
            'status'         => 'required|string|max:255',
        ]);

        $this->inquiryService->createInquiry($validated);

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry created successfully.'));
    }

    /**
     * Show the form for editing an existing automotive inquiry.
     *
     * @param  \App\Models\AutoInquiry  $autoInquiry
     * @return \Illuminate\View\View
     */
    public function edit(AutoInquiry $autoInquiry): View
    {
        // Performance: Cap selection to prevent memory exhaustion.
        $autos = Auto::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();

        return view('admin.auto-inquiries.form', ['inquiry' => $autoInquiry, 'autos' => $autos, 'users' => $users]);
    }

    /**
     * Update an existing automotive inquiry record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AutoInquiry  $autoInquiry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, AutoInquiry $autoInquiry): RedirectResponse
    {
        $validated = $request->validate([
            'auto_id'        => 'required|exists:autos,id',
            'user_id'        => 'required|exists:users,id',
            'full_name'      => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:20',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string|max:255',
            'message'        => 'nullable|string',
            'status'         => 'required|string|max:255',
        ]);

        $this->inquiryService->updateInquiry($autoInquiry, $validated);

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry updated successfully.'));
    }

    /**
     * Remove an automotive inquiry record from the database.
     *
     * @param  \App\Models\AutoInquiry  $autoInquiry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(AutoInquiry $autoInquiry): RedirectResponse
    {
        $this->inquiryService->deleteInquiry($autoInquiry);

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry deleted successfully.'));
    }
}
