<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Class BrandController
 */
class BrandController extends Controller
{
    /**
     * Display the specified brand page.
     */
    public function show(Request $request, Brand $brand): View
    {
        $brand->load([
            'properties' => fn($q) => $q->active()->with(['location', 'category']),
            'autos'      => fn($q) => $q->active()->with(['location', 'category']),
            'jobs'       => fn($q) => $q->active()->with(['location', 'category']),
            'services'   => fn($q) => $q->active()->with(['location', 'category']),
            'events'     => fn($q) => $q->active()->with(['location', 'category']),
            'classifieds'=> fn($q) => $q->active()->with(['location', 'category']),
        ]);

        return view("frontend.brands.show", [
            'brand' => $brand,
        ]);
    }
}
