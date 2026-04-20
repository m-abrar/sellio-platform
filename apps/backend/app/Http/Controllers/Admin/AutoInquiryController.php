<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AutoInquiry;
use App\Models\Auto;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AutoInquiryController extends Controller
{
    /**
     * Display a listing of auto inquiries with advanced filters.
     *
     * @param Request $request
     * @param string $status
     * @return View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->status ?: 'all');

        $inquiries = AutoInquiry::with(['auto', 'user'])
            ->when($request->auto, fn($q) => $q->where('auto_id', $request->auto))
            ->when($request->search, fn($q) => $q->where(function($query) use ($request) {
                $query->where('full_name', 'LIKE', "%{$request->search}%")
                    ->orWhereHas('user', fn($uq) => $uq->where('name', 'LIKE', "%{$request->search}%"))
                    ->orWhereHas('auto', fn($aq) => $aq->where('title', 'LIKE', "%{$request->search}%"));
            }))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $autos = Auto::select('id', 'title')->get();

        return view('admin.auto-inquiries.index', compact('inquiries', 'autos', 'status'));
    }

    /**
     * Display the specified auto inquiry details.
     *
     * @param int $id
     * @return View
     */
    public function show(int $id): View
    {
        // Eager load the vehicle/listing and the potential buyer
        $inquiry = AutoInquiry::with(['auto', 'user'])
            ->findOrFail($id);

        // Mark as viewed if it's the first time an admin is opening it
        if (isset($inquiry->viewed_at) && !$inquiry->viewed_at) {
            $inquiry->update(['viewed_at' => now()]);
        }

        return view('admin.auto-inquiries.show', compact('inquiry'));
    }
}
