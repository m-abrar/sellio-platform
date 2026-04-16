<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Location;
use App\Services\Partner\ClassifiedService;
use App\Http\Requests\Partner\ClassifiedRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Http\Resources\ClassifiedResource;

/**
 * Class ClassifiedController
 * Manages partner-owned classified advertisements.
 */
class ClassifiedController extends Controller
{
    /**
     * @var ClassifiedService
     */
    protected $classifiedService;

    /**
     * ClassifiedController constructor.
     *
     * @param ClassifiedService $classifiedService
     */
    public function __construct(ClassifiedService $classifiedService)
    {
        $this->classifiedService = $classifiedService;
    }

    /**
     * Display a listing of the partner's classifieds.
     *
     * @return View
     */
    public function index(Request $request)
    {
        $classifieds = Classified::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return $this->successResponse(ClassifiedResource::collection($classifieds));
    }

    /**
     * Show the form for creating a new classified.
     *
     * @return View
     */
    public function create() {
        return $this->successResponse($this->getFormData());
    }

    /**
     * Store a newly created classified in storage.
     *
     * @param ClassifiedRequest $request
     * @return RedirectResponse
     */
    public function store(ClassifiedRequest $request)
    {
        $classified = $this->classifiedService->saveClassified(
            Auth::user(), 
            $request->validated()
        );

        if ($request->wantsJson()) {
            return $this->successResponse(
                new ClassifiedResource($classified),
                __('Classified created successfully!'),
                201
            );
        }

        return $this->successResponse(null, __('Classified created successfully! Now complete the remaining details.'));
    }

    /**
     * Show the form for editing the specified classified.
     *
     * @param Classified $classified
     * @return View
     */
    public function edit(Classified $classified) {
        $this->authorizeOwner($classified);

        return $this->successResponse(array_merge(
            $this->getFormData(),
            ['classified' => new \App\Http\Resources\ClassifiedResource($classified)]
        ));
    }

    /**
     * Update the specified classified in storage.
     *
     * @param ClassifiedRequest $request
     * @param Classified $classified
     * @return RedirectResponse
     */
    public function update(ClassifiedRequest $request, Classified $classified)
    {
        $this->authorizeOwner($classified);

        $this->classifiedService->saveClassified(
            Auth::user(), 
            $request->validated(), 
            $classified
        );

        if ($request->wantsJson()) {
            return $this->successResponse(
                new ClassifiedResource($classified->fresh()),
                __('Classified updated successfully.')
            );
        }

        return $this->successResponse(null, __('Classified updated successfully.'));
    }

    /**
     * Remove the specified classified from storage.
     *
     * @param Classified $classified
     * @return RedirectResponse
     */
    public function destroy(Classified $classified)
    {
        $this->authorizeOwner($classified);

        $classified->delete();

        if (request()->wantsJson()) {
            return $this->successResponse(null, __('Classified deleted successfully.')
            );
        }

        return $this->successResponse(null, __('Classified deleted successfully.'));
    }

    /**
     * Fetch categories and locations filtered for classifieds.
     *
     * @return array
     */
    protected function getFormData(): array
    {
        return [
            'categories' => Category::where('is_classified', true)->get(),
            'locations'  => Location::where('is_classified', true)->get(),
        ];
    }

    /**
     * Ensure the authenticated user owns the classified resource.
     *
     * @param Classified $classified
     * @return void
     */
    protected function authorizeOwner(Classified $classified): void
    {
        if (Auth::id() !== $classified->user_id) {
            abort(403, __('Unauthorized action. You do not own this classified.'));
        }
    }
}
