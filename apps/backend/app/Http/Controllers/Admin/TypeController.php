<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Type;
use App\Http\Requests\Admin\TypeRequest;
use App\Services\Admin\TypeManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class TypeController
 * Orchestrates administrative listing types, coordinating cross-module 
 * taxonomies and functional visibility settings across platform verticals.
 */
class TypeController extends Controller
{
    /**
     * The type management service.
     *
     * @var \App\Services\Admin\TypeManagementService
     */
    protected TypeManagementService $typeService;

    /**
     * TypeController constructor.
     *
     * @param  \App\Services\Admin\TypeManagementService  $typeService
     */
    public function __construct(TypeManagementService $typeService)
    {
        $this->typeService = $typeService;
    }

    /**
     * Display a filtered listing of all registered marketplace types.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $types = Type::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->get();

        return view('admin.types.index', compact('types'));
    }

    /**
     * Show the interface for initializing a new listing type.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $type = new Type();
        $titleSuggestions = Type::select('title')->distinct()->limit(20)->pluck('title');

        return view('admin.types.form', compact('type', 'titleSuggestions'));
    }

    /**
     * Store a newly created listing type and synchronize its functional visibility.
     *
     * @param  \App\Http\Requests\Admin\TypeRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(TypeRequest $request): RedirectResponse
    {
        $type = $this->typeService->saveType($request->validated());

        return redirect()->route('admin.types.edit', $type->id)
            ->with('success', __('Listing type initialized successfully.'));
    }

    /**
     * Show the interface for editing an existing listing type.
     *
     * @param  \App\Models\Type  $type
     * @return \Illuminate\View\View
     */
    public function edit(Type $type): View
    {
        $titleSuggestions = Type::select('title')->distinct()->limit(20)->pluck('title');

        return view('admin.types.form', compact('type', 'titleSuggestions'));
    }

    /**
     * Update an existing listing type configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\TypeRequest  $request
     * @param  \App\Models\Type  $type
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(TypeRequest $request, Type $type): RedirectResponse
    {
        $this->typeService->saveType($request->validated(), $type);

        return redirect()->route('admin.types.index')
            ->with('success', __('Listing type updated successfully.'));
    }

    /**
     * Remove a listing type from the administrative database.
     *
     * @param  \App\Models\Type  $type
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Type $type): RedirectResponse
    {
        $type->delete();

        return redirect()->route('admin.types.index')
            ->with('success', __('Listing type removed successfully.'));
    }
}
