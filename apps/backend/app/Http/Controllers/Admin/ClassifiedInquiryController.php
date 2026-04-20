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
     * Display the specified classified inquiry.
     */
    public function show(int $id): View
    {
        // Eager load the listing being inquired about and the sender
        $inquiry = ClassifiedInquiry::with(['classifiedAd', 'user'])
            ->findOrFail($id);

        // Update viewed status if the column exists
        if (isset($inquiry->viewed_at) && !$inquiry->viewed_at) {
            $inquiry->update(['viewed_at' => now()]);
        }

        return view('admin.classified-inquiries.show', compact('inquiry'));
    }
}
