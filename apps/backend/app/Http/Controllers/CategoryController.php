<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Class CategoryController
 */
class CategoryController extends Controller
{
    /**
     * Display the specified category page.
     */
    public function show(Request $request, Category $category): View
    {
        $category->load([
            'properties' => fn($q) => $q->active()->with(['location', 'category']),
            'events'     => fn($q) => $q->active()->with(['location', 'category']),
            'jobs'       => fn($q) => $q->active()->with(['location', 'category']),
            'services'   => fn($q) => $q->active()->with(['location', 'category']),
            'autos'      => fn($q) => $q->active()->with(['location', 'category']),
            'classifieds'=> fn($q) => $q->active()->with(['location', 'category']),
        ]);

        return view("frontend.categories.show", [
            'category' => $category,
        ]);
    }
}
