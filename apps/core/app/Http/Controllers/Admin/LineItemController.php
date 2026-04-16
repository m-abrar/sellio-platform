<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LineItem;
use Illuminate\Http\Request;

class LineItemController extends Controller
{
    public function index()
    {
        $lineItems = LineItem::orderBy('order')->get();
        return view('admin.line-items.index', compact('lineItems'));
    }

    public function create()
    {
        return view('admin.line-items.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric',
            'is_required' => 'boolean',
            'applies_on' => 'required|string',
            'type' => 'nullable|string|max:100',
            'order' => 'nullable|integer',
            'status' => 'nullable|in:active,inactive',
        ]);

        LineItem::create($data);

        return redirect()->route('admin.line-items.index')
                         ->with('success', 'Template created successfully.');
    }

    public function edit(LineItem $LineItem)
    {
        return view('admin.line-items.form', compact('LineItem'));
    }

    public function update(Request $request, LineItem $LineItem)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric',
            'is_required' => 'boolean',
            'applies_on' => 'required|string',
            'type' => 'nullable|string|max:100',
            'order' => 'nullable|integer',
            'status' => 'nullable|in:active,inactive',
        ]);

        $LineItem->update($data);

        return redirect()->route('admin.line-items.index')
                         ->with('success', 'Template updated successfully.');
    }

    public function destroy(LineItem $LineItem)
    {
        $LineItem->delete();

        return redirect()->route('admin.line-items.index')
                         ->with('success', 'Template deleted successfully.');
    }
}
