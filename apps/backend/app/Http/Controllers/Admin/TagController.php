<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\Admin\TagRequest;
use App\Services\Admin\TagManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class TagController
 * Orchestrates the administrative taxonomy of tags, coordinating 
 * cross-module polymorphic relationships and semantic metadata assignments.
 */
class TagController extends Controller
{
    /**
     * The tag management service.
     *
     * @var \App\Services\Admin\TagManagementService
     */
    protected TagManagementService $tagService;

    /**
     * TagController constructor.
     *
     * @param  \App\Services\Admin\TagManagementService  $tagService
     */
    public function __construct(TagManagementService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * Display a filtered listing of all registered marketplace tags.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $tags = Tag::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->get();

        return view('admin.tags.index', compact('tags'));
    }

    /**
     * Show the interface for initializing a new marketplace tag.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $tag = new Tag();
        return view('admin.tags.form', compact('tag'));
    }

    /**
     * Store a newly created tag and its associated configuration.
     *
     * @param  \App\Http\Requests\Admin\TagRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(TagRequest $request): RedirectResponse
    {
        $tag = $this->tagService->saveTag($request->validated());

        return redirect()->route('admin.tags.edit', $tag->id)
            ->with('success', __('Tag initialized successfully.'));
    }

    /**
     * Show the interface for editing an existing marketplace tag.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\View\View
     */
    public function edit(Tag $tag): View
    {
        return view('admin.tags.form', compact('tag'));
    }

    /**
     * Update an existing marketplace tag configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\TagRequest  $request
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(TagRequest $request, Tag $tag): RedirectResponse
    {
        $this->tagService->saveTag($request->validated(), $tag);

        return redirect()->route('admin.tags.index')
            ->with('success', __('Tag configuration updated successfully.'));
    }

    /**
     * Remove a tag from the active database.
     *
     * @param  \App\Models\Tag  $tag
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', __('Tag removed successfully.'));
    }
}
