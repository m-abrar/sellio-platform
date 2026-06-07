<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\Admin\PageBuilderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class PageBuilderController
 * Orchestrates the visual CMS lifecycle, managing the synchronization of HTML/CSS 
 * components and the atomic transformation of base64 assets into persistent media records.
 */
class PageBuilderController extends Controller
{
    protected PageBuilderService $pageBuilderService;

    public function __construct(PageBuilderService $pageBuilderService)
    {
        $this->pageBuilderService = $pageBuilderService;
    }

    /**
     * Store a newly created page stub to initialize the visual builder.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'  => 'required|string|max:255|unique:pages,title',
            'slug'   => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'image'  => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $page = Page::create($validated);

        return redirect()->route('admin.pages.edit', $page->id)
            ->with('success', __('Page initialized successfully. Proceeding to visual builder.'));
    }

    /**
     * Show the visual builder interface for a specific page.
     */
    public function edit(Page $page): View
    {
        return view('admin.page-builder.form', compact('page'));
    }

    /**
     * Update the visual structure and assets of a page via AJAX.
     */
    public function update(Request $request, Page $page): JsonResponse
    {
        $request->validate([
            'html' => 'required|string',
            'css'  => 'nullable|string'
        ]);
    
        try {
            $processed = $this->pageBuilderService->syncPageAssets(
                $page, 
                $request->input('html'), 
                $request->input('css')
            );
        
            $page->update($processed);
        
            return response()->json([
                'success' => true,
                'message' => __('Page structure and assets synchronized successfully!'),
                'page'    => $page
            ]);

        } catch (Exception $e) {
            Log::error("PageBuilder Sync Error: {$e->getMessage()}", ['page_id' => $page->id]);
            return response()->json([
                'success' => false,
                'message' => __('Asset synchronization failed: :error', ['error' => $e->getMessage()])
            ], 500);
        }
    }
}
