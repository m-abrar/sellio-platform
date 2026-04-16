<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function index()
    {
        $addons = Addon::orderBy('created_at', 'desc')->get();
        return view('admin.addons.index', compact('addons'));
    }

    public function create()
    {
        return view('admin.addons.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        Addon::create($data);

        return redirect()->route('admin.addons.index')
                         ->with('success', 'Addon created successfully.');
    }

    public function edit(Addon $addon)
    {
        return view('admin.addons.form', compact('addon'));
    }

    public function update(Request $request, Addon $addon)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'status' => 'nullable|in:active,inactive',
        ]);

        $addon->update($data);

        return redirect()->route('admin.addons.index')
                         ->with('success', 'Addon updated successfully.');
    }

    public function destroy(Addon $addon)
    {
        $addon->delete();

        return redirect()->route('admin.addons.index')
                         ->with('success', 'Addon deleted successfully.');
    }
}
