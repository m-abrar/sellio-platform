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
        return view("frontend.categories.show", [
            'category' => $category,
        ]);
    }
}
