<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Class TagController
 */
class TagController extends Controller
{
    /**
     * Display the specified tag page.
     */
    public function show(Request $request, Tag $tag): View
    {
        $tag->load([
            'properties' => fn($q) => $q->active()->with(['location', 'category']),
            'autos'      => fn($q) => $q->active()->with(['location', 'category']),
            'jobs'       => fn($q) => $q->active()->with(['location', 'category']),
            'services'   => fn($q) => $q->active()->with(['location', 'category']),
            'events'     => fn($q) => $q->active()->with(['location', 'category']),
            'classifieds'=> fn($q) => $q->active()->with(['location', 'category']),
        ]);

        return view("frontend.tags.show", [
            'tag' => $tag,
        ]);
    }
}
