<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Type;
use App\Http\Requests\Admin\TypeRequest;
use App\Services\Admin\TypeManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class TypeController
 *
 * Manages administrative listing types and module visibility.
 */
class TypeController extends Controller
{
    /**
     * @var TypeManagementService
     */
    protected $typeService;

    /**
     * TypeController constructor.
     *
     * @param TypeManagementService $typeService
     */
    public function __construct(TypeManagementService $typeService)
    {
        $this->typeService = $typeService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $types = Type::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->paginate(15)
            ->withQueryString();

        return view('admin.types.index', compact('types'));
    }

    /**
     * Show the form for creating a new type.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.types.form');
    }

    /**
     * Store a newly created type in storage.
     *
     * @param TypeRequest $request
     * @return RedirectResponse
     */
    public function store(TypeRequest $request): RedirectResponse
    {
        $type = $this->typeService->saveType($request->validated());

        return redirect()->route('admin.types.edit', $type->id)
            ->with('success', __('Type added successfully.'));
    }

    /**
     * Show the form for editing the specified type.
     *
     * @param Type $type
     * @return View
     */
    public function edit(Type $type): View
    {
        return view('admin.types.form', compact('type'));
    }

    /**
     * Update the specified type in storage.
     *
     * @param TypeRequest $request
     * @param Type $type
     * @return RedirectResponse
     */
    public function update(TypeRequest $request, Type $type): RedirectResponse
    {
        $this->typeService->saveType($request->validated(), $type);

        return redirect()->route('admin.types.index')
            ->with('success', __('Type updated successfully.'));
    }

    /**
     * Remove the specified type from storage.
     *
     * @param Type $type
     * @return RedirectResponse
     */
    public function destroy(Type $type): RedirectResponse
    {
        $type->delete();

        return redirect()->route('admin.types.index')
            ->with('success', __('Type deleted successfully.'));
    }
}
