<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Models\Theme;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

class ApiTestimonialController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $limit = min(max((int) $request->query('limit', 6), 1), 24);
        $themeKey = $request->header('X-Theme-Key') ?? $request->query('theme_key');
        $theme = $themeKey ? Theme::where('theme_key', $themeKey)->first() : null;

        $query = Testimonial::query()
            ->published()
            ->with('media')
            ->when($theme, function ($query) use ($theme) {
                $query->where(function ($inner) use ($theme) {
                    $inner->whereHas('themes', fn ($themeQuery) => $themeQuery->whereKey($theme->id))
                        ->orDoesntHave('themes');
                });
            }, function ($query) {
                $query->doesntHave('themes');
            });

        if ($theme) {
            $query->leftJoin('testimonial_theme', function ($join) use ($theme) {
                $join->on('testimonials.id', '=', 'testimonial_theme.testimonial_id')
                    ->where('testimonial_theme.theme_id', '=', $theme->id);
            })
                ->select('testimonials.*', 'testimonial_theme.priority as theme_priority', 'testimonial_theme.is_featured as theme_is_featured')
                ->orderByRaw('CASE WHEN testimonial_theme.theme_id IS NULL THEN 1 ELSE 0 END')
                ->orderBy('testimonial_theme.priority')
                ->orderBy('testimonials.sort_order');
        } else {
            $query->orderBy('sort_order');
        }

        return TestimonialResource::collection(
            $query->latest('testimonials.created_at')->limit($limit)->get()
        );
    }
}
