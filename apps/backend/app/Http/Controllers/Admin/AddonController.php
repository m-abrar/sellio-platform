<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveAddonRequest;
use App\Models\Addon;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class AddonController
 * Manages administrative supplements and extra service offerings (addons) 
 * available across property and product verticals.
 */
class AddonController extends Controller
{
    /**
     * Display a paginated list of all configured addons.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $addons = Addon::orderBy('created_at', 'desc')->paginate(15);
        return view('admin.addons.index', compact('addons'));
    }

    /**
     * Show the form for creating a new marketplace addon.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        return view('admin.addons.form', ['addon' => new Addon()]);
    }

    /**
     * Store a newly created addon in the database.
     *
     * @param  SaveAddonRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(SaveAddonRequest $request): RedirectResponse
    {
        Addon::create($request->validated());

        return redirect()->route('admin.addons.index')
                         ->with('success', __('Addon created successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace addon.
     *
     * @param  \App\Models\Addon  $addon
     * @return \Illuminate\View\View
     */
    public function edit(Addon $addon): View
    {
        return view('admin.addons.form', compact('addon'));
    }

    /**
     * Update an existing marketplace addon in the database.
     *
     * @param  SaveAddonRequest  $request
     * @param  \App\Models\Addon  $addon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(SaveAddonRequest $request, Addon $addon): RedirectResponse
    {
        $addon->update($request->validated());

        return redirect()->route('admin.addons.index')
                         ->with('success', __('Addon updated successfully.'));
    }

    /**
     * Remove a marketplace addon from the database.
     *
     * @param  \App\Models\Addon  $addon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Addon $addon): RedirectResponse
    {
        $addon->delete();

        return redirect()->route('admin.addons.index')
                         ->with('success', __('Addon deleted successfully.'));
    }
}
