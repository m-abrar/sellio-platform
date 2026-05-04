<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassifiedInquiry;
use App\Models\Classified;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ClassifiedInquiryController extends Controller
{
    /**
     * Display a listing of classified inquiries with advanced filters.
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

        $classifieds = Classified::select('id', 'title', 'category_id')->with('category:id,title')->get();
        $categories = \App\Models\Category::where('is_classified', true)->select('id', 'title')->get();

        return view('admin.classified-inquiries.index', compact('inquiries', 'classifieds', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new inquiry.
     */
    public function create(): View
    {
        $inquiry = new ClassifiedInquiry();
        $classifieds = Classified::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();
        
        return view('admin.classified-inquiries.form', compact('inquiry', 'classifieds', 'users'));
    }

    /**
     * Store a newly created inquiry.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'classified_id' => 'required|exists:classifieds,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
            'message' => 'nullable|string',
        ]);

        ClassifiedInquiry::create($validated);

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry logged successfully.'));
    }

    /**
     * Display the specified classified inquiry.
     */
    public function show(int $id): View
    {
        $inquiry = ClassifiedInquiry::with(['classifiedAd', 'user'])
            ->findOrFail($id);

        if (isset($inquiry->viewed_at) && !$inquiry->viewed_at) {
            $inquiry->update(['viewed_at' => now()]);
        }

        return view('admin.classified-inquiries.show', compact('inquiry'));
    }

    /**
     * Show the form for editing the inquiry.
     */
    public function edit(int $id): View
    {
        $inquiry = ClassifiedInquiry::findOrFail($id);
        $classifieds = Classified::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return view('admin.classified-inquiries.form', compact('inquiry', 'classifieds', 'users'));
    }

    /**
     * Update the specified inquiry.
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $inquiry = ClassifiedInquiry::findOrFail($id);

        $validated = $request->validate([
            'classified_id' => 'required|exists:classifieds,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry updated successfully.'));
    }

    /**
     * Remove the specified inquiry.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $inquiry = ClassifiedInquiry::findOrFail($id);
        $inquiry->delete();

        return redirect()
            ->route('admin.classified-inquiries.index')
            ->with('success', __('Inquiry deleted successfully.'));
    }
}
