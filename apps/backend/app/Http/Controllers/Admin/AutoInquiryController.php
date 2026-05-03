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
     * Display the specified auto inquiry.
     */
    public function show(int $id): View
    {
        $inquiry = AutoInquiry::with(['auto', 'user'])->findOrFail($id);
        return view('admin.auto-inquiries.show', compact('inquiry'));
    }

    /**
     * Show the form for creating a new auto inquiry.
     */
    public function create(): View
    {
        $inquiry = new AutoInquiry();
        $autos = Auto::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();
        
        return view('admin.auto-inquiries.form', compact('inquiry', 'autos', 'users'));
    }

    /**
     * Store a newly created auto inquiry.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'auto_id' => 'required|exists:autos,id',
            'user_id' => 'required|exists:users,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string',
            'message' => 'nullable|string',
            'status' => 'required|string',
        ]);

        AutoInquiry::create($validated);

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry created successfully.'));
    }

    /**
     * Show the form for editing the specified auto inquiry.
     */
    public function edit(int $id): View
    {
        $inquiry = AutoInquiry::findOrFail($id);
        $autos = Auto::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return view('admin.auto-inquiries.form', compact('inquiry', 'autos', 'users'));
    }

    /**
     * Update the specified auto inquiry.
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $inquiry = AutoInquiry::findOrFail($id);

        $validated = $request->validate([
            'auto_id' => 'required|exists:autos,id',
            'user_id' => 'required|exists:users,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string',
            'message' => 'nullable|string',
            'status' => 'required|string',
        ]);

        $inquiry->update($validated);

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry updated successfully.'));
    }

    /**
     * Remove the specified auto inquiry.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $inquiry = AutoInquiry::findOrFail($id);
        $inquiry->delete();

        return redirect()
            ->route('admin.auto-inquiries.index')
            ->with('success', __('Inquiry deleted successfully.'));
    }
}
