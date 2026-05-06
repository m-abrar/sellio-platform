<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index()
    {
        $advertisements = Advertisement::paginate(10);
        return view('admin.advertisements.index', compact('advertisements'));
    }

    public function show(Advertisement $advertisement)
    {
        return view('admin.advertisements.show', compact('advertisement'));
    }

    public function create()
    {
        $advertisement = new Advertisement();
        return view('admin.advertisements.form', compact('advertisement'));
    }

    public function edit(Advertisement $advertisement)
    {
        return view('admin.advertisements.form', compact('advertisement'));
    }

    public function store(\App\Http\Requests\Admin\AdvertisementRequest $request)
    {
        $validated = $request->validated();
        $validated['status'] = $request->has('status');
        $validated['orientations'] = $request->orientations ?? [];
        $validated['cities'] = $request->cities ?? [];
        $validated['zipcodes'] = $request->zipcodes ?? [];
        $validated['regions'] = $request->regions ?? [];

        Advertisement::create($validated);

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement created successfully.');
    }

    public function update(\App\Http\Requests\Admin\AdvertisementRequest $request, Advertisement $advertisement)
    {
        $validated = $request->validated();
        $validated['status'] = $request->has('status');
        $validated['orientations'] = $request->orientations ?? [];
        $validated['cities'] = $request->cities ?? [];
        $validated['zipcodes'] = $request->zipcodes ?? [];
        $validated['regions'] = $request->regions ?? [];

        $advertisement->update($validated);

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement updated successfully.');
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();
        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement deleted successfully.');
    }
}
