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
        return view("frontend.tags.show", [
            'tag' => $tag,
        ]);
    }
}
