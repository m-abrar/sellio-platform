<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Class TypeController
 *
 * Handles the display of vehicle types using flat view resolution.
 */
class TypeController extends Controller
{
    /**
     * Display the specified vehicle type page.
     */
    public function show(Request $request, Type $type): View
    {
        return view("frontend.types.show", [
            'type' => $type,
        ]);
    }
}
