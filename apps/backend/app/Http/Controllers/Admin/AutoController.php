<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Location;
use App\Http\Requests\Admin\AutoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Traits\ManagesApproval;
use App\Services\Admin\AutoManagementService;

/**
 * Class AutoController
 * Manages the automotive vertical of the marketplace, coordinating inventory, 
 * brand/category taxonomies, and the listing approval lifecycle.
 */
class AutoController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = Auto::class;

    /**
     * @var AutoManagementService
     */
    protected $autoService;

    /**
     * AutoController constructor.
     *
     * @param AutoManagementService $autoService
     */
    public function __construct(AutoManagementService $autoService)
    {
        $this->autoService = $autoService;
    }

    /**
     * Display a filtered and paginated list of all automotive listings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::where('is_auto', 1)->get();
        $brands = Brand::where('is_auto', 1)->get();
        $locations = Location::where('is_auto', 1)->get();

        $autos = Auto::query()
            ->with(['user', 'category', 'brand', 'location'])
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->brand_id, fn($q) => $q->where('brand_id', $request->brand_id))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.autos.index', compact('autos', 'categories', 'brands', 'locations'));
    }

    /**
     * Show the form for creating a new automotive listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $auto = new Auto();
        $categories = Category::where('is_auto', 1)->get();
        $brands = Brand::where('is_auto', 1)->get();
        $locations = Location::where('is_auto', 1)->get();
        
        return view('admin.autos.form', compact('auto', 'categories', 'brands', 'locations'));
    }

    /**
     * Store a newly created automotive listing in the database.
     *
     * @param  \App\Http\Requests\Admin\AutoRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(AutoRequest $request): RedirectResponse
    {
        try {
            $auto = $this->autoService->saveAuto($request->validated());

            return redirect()
                ->route('admin.autos.edit', $auto->id)
                ->with('success', __('Auto created successfully.'));
        } catch (\Exception $e) {
            Log::error("Auto Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
        }
    }

    /**
     * Show the form for editing an existing automotive listing and its inquiries.
     *
     * @param  \App\Models\Auto  $auto
     * @return \Illuminate\View\View
     */
    public function edit(Auto $auto): View
    {
        $categories = Category::where('is_auto', 1)->get();
        $brands = Brand::where('is_auto', 1)->get();
        $locations = Location::where('is_auto', 1)->get();
        
        $recentInquiries = AutoInquiry::where('auto_id', $auto->id)->latest()->take(5)->get();

        return view('admin.autos.form', compact('auto', 'categories', 'brands', 'locations', 'recentInquiries'));
    }

    /**
     * Update an existing automotive listing in the database.
     *
     * @param  \App\Http\Requests\Admin\AutoRequest  $request
     * @param  \App\Models\Auto  $auto
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(AutoRequest $request, Auto $auto): RedirectResponse
    {
        try {
            $this->autoService->saveAuto($request->validated(), $auto);

            return redirect()
                ->route('admin.autos.edit', $auto->id)
                ->with('success', __('Auto updated successfully.'));
        } catch (\Exception $e) {
            Log::error("Auto Update Failure: {$e->getMessage()}", ['id' => $auto->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
    }

    /**
     * Remove an automotive listing from the database.
     *
     * @param  \App\Models\Auto  $auto
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Auto $auto): RedirectResponse
    {
        $auto->delete();
        return redirect()->route('admin.autos.index')->with('success', __('Auto deleted successfully.'));
    }

    /**
     * Replicate an existing listing as a draft copy for quick inventory entry.
     *
     * @param  \App\Models\Auto  $auto
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Auto $auto): RedirectResponse
    {
        try {
            $clone = $this->autoService->duplicateAuto($auto);

            return redirect()
                ->route('admin.autos.edit', $clone->id)
                ->with('success', __('Auto duplicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Auto Duplication Failure: {$e->getMessage()}", ['id' => $auto->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }
}
