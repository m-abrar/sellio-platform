<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Http\Requests\Admin\FeatureRequest;
use App\Services\Admin\FeatureManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class FeatureController
 *
 * Orchestrates administrative features for the multi-module directory system.
 */
class FeatureController extends Controller
{
    /**
     * @var FeatureManagementService
     */
    protected $featureService;

    /**
     * FeatureController constructor.
     *
     * @param FeatureManagementService $featureService
     */
    public function __construct(FeatureManagementService $featureService)
    {
        $this->featureService = $featureService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $features = Feature::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->paginate(15)
            ->withQueryString();

        return view('admin.features.index', compact('features'));
    }

    /**
     * Show the form for creating a new feature.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.features.form');
    }

    /**
     * Store a newly created feature in storage.
     *
     * @param FeatureRequest $request
     * @return RedirectResponse
     */
    public function store(FeatureRequest $request): RedirectResponse
    {
        $feature = $this->featureService->saveFeature($request->validated());

        return redirect()->route('admin.features.edit', $feature->id)
            ->with('success', __('Feature added successfully.'));
    }

    /**
     * Show the form for editing the specified feature.
     *
     * @param Feature $feature
     * @return View
     */
    public function edit(Feature $feature): View
    {
        return view('admin.features.form', compact('feature'));
    }

    /**
     * Update the specified feature in storage.
     *
     * @param FeatureRequest $request
     * @param Feature $feature
     * @return RedirectResponse
     */
    public function update(FeatureRequest $request, Feature $feature): RedirectResponse
    {
        $this->featureService->saveFeature($request->validated(), $feature);

        return redirect()->route('admin.features.index')
            ->with('success', __('Feature updated successfully.'));
    }

    /**
     * Remove the specified feature from storage.
     *
     * @param Feature $feature
     * @return RedirectResponse
     */
    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return redirect()->route('admin.features.index')
            ->with('success', __('Feature deleted successfully.'));
    }
}
