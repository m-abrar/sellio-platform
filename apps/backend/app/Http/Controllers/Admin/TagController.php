<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\Admin\TagRequest;
use App\Services\Admin\TagManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class TagController
 *
 * Manages the taxonomy of tags across multiple application modules.
 */
class TagController extends Controller
{
    /**
     * @var TagManagementService
     */
    protected $tagService;

    /**
     * TagController constructor.
     *
     * @param TagManagementService $tagService
     */
    public function __construct(TagManagementService $tagService)
    {
        $this->tagService = $tagService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $tags = Tag::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->get();

        return view('admin.tags.index', compact('tags'));
    }

    /**
     * Show the form for creating a new tag.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.tags.form');
    }

    /**
     * Store a newly created tag in storage.
     *
     * @param TagRequest $request
     * @return RedirectResponse
     */
    public function store(TagRequest $request): RedirectResponse
    {
        $tag = $this->tagService->saveTag($request->validated());

        return redirect()->route('admin.tags.edit', $tag->id)
            ->with('success', __('Tag added successfully.'));
    }

    /**
     * Show the form for editing the specified tag.
     *
     * @param Tag $tag
     * @return View
     */
    public function edit(Tag $tag): View
    {
        return view('admin.tags.form', compact('tag'));
    }

    /**
     * Update the specified tag in storage.
     *
     * @param TagRequest $request
     * @param Tag $tag
     * @return RedirectResponse
     */
    public function update(TagRequest $request, Tag $tag): RedirectResponse
    {
        $this->tagService->saveTag($request->validated(), $tag);

        return redirect()->route('admin.tags.index')
            ->with('success', __('Tag updated successfully.'));
    }

    /**
     * Remove the specified tag from storage.
     *
     * @param Tag $tag
     * @return RedirectResponse
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', __('Tag deleted successfully.'));
    }
}
