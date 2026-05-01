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

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'radius' => 'required|numeric|min:1|max:1000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'link' => 'nullable|url',
            'orientations' => 'nullable|array',
            'orientations.*' => 'string|in:homepage-a,homepage-b,homepage-c,homepage-d,homepage-e,homepage-f,sidebar,searchpage,blogs,videos,header,footer',
            'cities' => 'nullable|array',
            'cities.*' => 'string',
            'zipcodes' => 'nullable|array',
            'zipcodes.*' => 'string',
            'regions' => 'nullable|array',
            'regions.*' => 'string',
        ]);

        Advertisement::create([
            'title' => $request->title,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'radius' => $request->radius,
            'link' => $request->link,
            'status' => $request->has('status'),
            'orientations' => $request->orientations ?? [],
            'cities' => $request->cities ?? [],
            'zipcodes' => $request->zipcodes ?? [],
            'regions' => $request->regions ?? [],
        ]);

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement created successfully.');
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $request->merge([
            'cities' => array_map('trim', explode(',', $request->input('cities')))
        ]);

        
        $request->validate([
            'title' => 'required|string|max:255',
            'radius' => 'required|numeric|min:1|max:1000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'link' => 'nullable|url',
            'orientations' => 'nullable|array',
            'orientations.*' => 'string|in:homepage-a,homepage-b,homepage-c,homepage-d,homepage-e,homepage-f,sidebar,searchpage,blogs,videos,header,footer',
            'cities' => 'nullable|array',
            'cities.*' => 'string',
            'zipcodes' => 'nullable|array',
            'zipcodes.*' => 'string',
            'regions' => 'nullable|array',
            'regions.*' => 'string',
        ]);

        $advertisement->update([
            'title' => $request->title,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'radius' => $request->radius,
            'link' => $request->link,
            'status' => $request->has('status'),
            'orientations' => $request->orientations ?? [],
            'cities' => $request->cities ?? [],
            'zipcodes' => $request->zipcodes ?? [],
            'regions' => $request->regions ?? [],
        ]);

        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement updated successfully.');
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();
        return redirect()->route('admin.advertisements.index')->with('success', 'Advertisement deleted successfully.');
    }
}
