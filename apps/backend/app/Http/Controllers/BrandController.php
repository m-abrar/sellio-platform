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
        return view("frontend.brands.show", [
            'brand' => $brand,
        ]);
    }
}
