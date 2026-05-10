<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Http\Requests\Admin\FeatureRequest;
use App\Services\Admin\FeatureManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class FeatureController
 * Orchestrates the administrative management of features, 
 * coordinating listing-feature relationships and vertical-specific module assignments.
 */
class FeatureController extends Controller
{
    /**
     * The feature management service.
     *
     * @var \App\Services\Admin\FeatureManagementService
     */
    protected FeatureManagementService $featureService;

    /**
     * FeatureController constructor.
     *
     * @param  \App\Services\Admin\FeatureManagementService  $featureService
     */
    public function __construct(FeatureManagementService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Display a filtered listing of all registered marketplace features.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $features = Feature::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->get();

        return view('admin.features.index', compact('features'));
    }

    /**
     * Show the form for creating a new marketplace feature.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $feature = new Feature();
        $titleSuggestions = Feature::select('title')->distinct()->limit(20)->pluck('title');
        return view('admin.features.form', compact('feature', 'titleSuggestions'));
    }

    /**
     * Store a newly created feature and its associated configuration.
     *
     * @param  \App\Http\Requests\Admin\FeatureRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(FeatureRequest $request): RedirectResponse
    {
        $feature = $this->featureService->saveFeature($request->validated());

        return redirect()->route('admin.features.edit', $feature->id)
            ->with('success', __('Feature added successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace feature.
     *
     * @param  \App\Models\Feature  $feature
     * @return \Illuminate\View\View
     */
    public function edit(Feature $feature): View
    {
        $titleSuggestions = Feature::select('title')->distinct()->limit(20)->pluck('title');
        return view('admin.features.form', compact('feature', 'titleSuggestions'));
    }

    /**
     * Update an existing marketplace feature configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\FeatureRequest  $request
     * @param  \App\Models\Feature  $feature
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(FeatureRequest $request, Feature $feature): RedirectResponse
    {
        $this->featureService->saveFeature($request->validated(), $feature);

        return redirect()->route('admin.features.index')
            ->with('success', __('Feature updated successfully.'));
    }

    /**
     * Remove a feature configuration from the database.
     *
     * @param  \App\Models\Feature  $feature
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Feature $feature): RedirectResponse
    {
        $feature->delete();

        return redirect()->route('admin.features.index')
            ->with('success', __('Feature deleted successfully.'));
    }
}
