<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\User;
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
     * Display a filtered and paginated list of all classified inquiries.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->status ?: 'all');

        $inquiries = ClassifiedInquiry::with(['classifiedAd.category', 'classifiedAd.location', 'user'])
            ->when($request->classifiedad, fn($q) => $q->where('classified_id', $request->classifiedad))
            ->when($request->ad_name, fn($q) => $q->whereHas('classifiedAd', fn($c) => $c->where('title', 'LIKE', "%{$request->ad_name}%")))
            ->when($request->category, function($q) use ($request) {
                $q->whereHas('classifiedAd', fn($c) => $c->where('category_id', $request->category));
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

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
    public function store(\App\Http\Requests\Admin\UpdateClassifiedInquiryRequest $request): RedirectResponse
    {
        ClassifiedInquiry::create($request->validated());

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

        if (!$classifiedInquiry->viewed_at) {
            $classifiedInquiry->update(['viewed_at' => now()]);
        }

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
    public function update(\App\Http\Requests\Admin\UpdateClassifiedInquiryRequest $request, ClassifiedInquiry $classifiedInquiry): RedirectResponse
    {
        $classifiedInquiry->update($request->validated());

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
        $classifiedInquiry->delete();

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry deleted successfully.'));
    }
}
