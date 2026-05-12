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
        $type->load([
            'properties' => fn($q) => $q->active()->with(['location', 'category']),
            'autos'      => fn($q) => $q->active()->with(['location', 'category']),
            'jobs'       => fn($q) => $q->active()->with(['location', 'category']),
            'services'   => fn($q) => $q->active()->with(['location', 'category']),
            'events'     => fn($q) => $q->active()->with(['location', 'category']),
            'classifieds'=> fn($q) => $q->active()->with(['location', 'category']),
        ]);

        return view("frontend.types.show", [
            'type' => $type,
        ]);
    }
}
