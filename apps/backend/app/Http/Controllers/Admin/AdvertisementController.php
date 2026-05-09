<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdvertisementRequest;
use App\Models\Advertisement;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class AdvertisementController
 * Manages the high-fidelity advertisement lifecycle, including inventory control, 
 * geographical targeting, and orientation-specific placement.
 */
class AdvertisementController extends Controller
{
    /**
     * Display a paginated list of all advertisement inventory.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $advertisements = Advertisement::paginate(10);
        return view('admin.advertisements.index', compact('advertisements'));
    }

    /**
     * Display the details of a specific advertisement.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\View\View
     */
    public function show(Advertisement $advertisement): View
    {
        return view('admin.advertisements.show', compact('advertisement'));
    }

    /**
     * Show the form for creating a new advertisement campaign.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $advertisement = new Advertisement();
        return view('admin.advertisements.form', compact('advertisement'));
    }

    /**
     * Show the form for editing an existing advertisement campaign.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\View\View
     */
    public function edit(Advertisement $advertisement): View
    {
        return view('admin.advertisements.form', compact('advertisement'));
    }

    /**
     * Store a newly created advertisement in the database with targeting logic.
     *
     * @param  \App\Http\Requests\Admin\AdvertisementRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(AdvertisementRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Normalize targeting arrays
        $validated['orientations'] = $request->input('orientations', []);
        $validated['cities']       = $request->input('cities', []);
        $validated['zipcodes']     = $request->input('zipcodes', []);
        $validated['regions']      = $request->input('regions', []);

        $advertisement = new Advertisement();
        $advertisement->fill($validated);
        $advertisement->status = $request->has('status') ? Advertisement::STATUS_ACTIVE : Advertisement::STATUS_INACTIVE;
        $advertisement->save();

        return redirect()->route('admin.advertisements.index')
                         ->with('success', __('Advertisement created successfully.'));
    }

    /**
     * Update an existing advertisement campaign and its targeting parameters.
     *
     * @param  \App\Http\Requests\Admin\AdvertisementRequest  $request
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(AdvertisementRequest $request, Advertisement $advertisement): RedirectResponse
    {
        $validated = $request->validated();
        
        // Normalize targeting arrays
        $validated['orientations'] = $request->input('orientations', []);
        $validated['cities']       = $request->input('cities', []);
        $validated['zipcodes']     = $request->input('zipcodes', []);
        $validated['regions']      = $request->input('regions', []);

        $advertisement->fill($validated);
        $advertisement->status = $request->has('status') ? Advertisement::STATUS_ACTIVE : Advertisement::STATUS_INACTIVE;
        $advertisement->save();

        return redirect()->route('admin.advertisements.index')
                         ->with('success', __('Advertisement updated successfully.'));
    }

    /**
     * Remove an advertisement from the database.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Advertisement $advertisement): RedirectResponse
    {
        $advertisement->delete();
        return redirect()->route('admin.advertisements.index')
                         ->with('success', __('Advertisement deleted successfully.'));
    }
}
