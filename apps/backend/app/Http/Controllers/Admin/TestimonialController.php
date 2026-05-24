<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Models\Testimonial;
use App\Models\Theme;
use App\Services\Admin\TestimonialManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class TestimonialController extends Controller
{
    public function __construct(protected TestimonialManagementService $testimonialService)
    {
    }

    public function index(Request $request): View
    {
        $themes = Theme::orderBy('vertical')->orderBy('title')->get();
        $testimonials = Testimonial::query()
            ->with(['themes', 'media'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->status))
            ->when($request->filled('theme_id'), function ($query) use ($request) {
                $request->theme_id === 'global'
                    ? $query->doesntHave('themes')
                    : $query->whereHas('themes', fn ($themeQuery) => $themeQuery->whereKey((int) $request->theme_id));
            })
            ->when($request->filled('featured'), function ($query) use ($request) {
                $query->whereHas('themes', fn ($themeQuery) => $themeQuery->where('testimonial_theme.is_featured', (bool) $request->boolean('featured')));
            })
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.testimonials.index', compact('testimonials', 'themes'));
    }

    public function create(): View
    {
        return $this->form(new Testimonial());
    }

    public function edit(Testimonial $testimonial): View
    {
        return $this->form($testimonial->load(['themes', 'media']));
    }

    public function store(TestimonialRequest $request): RedirectResponse
    {
        $testimonial = $this->testimonialService->saveTestimonial($request->validated());

        return redirect()
            ->route('admin.testimonials.edit', $testimonial)
            ->with('success', __('Testimonial created successfully. You can now upload an avatar.'));
    }

    public function update(TestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $this->testimonialService->saveTestimonial($request->validated(), $testimonial);

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', __('Testimonial updated successfully.'));
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()
            ->route('admin.testimonials.index')
            ->with('success', __('Testimonial archived successfully.'));
    }

    protected function form(Testimonial $testimonial): View
    {
        $themes = Theme::orderBy('vertical')->orderBy('title')->get();
        $assignedThemes = $testimonial->themes->keyBy('id');

        return view('admin.testimonials.form', compact('testimonial', 'themes', 'assignedThemes'));
    }
}
