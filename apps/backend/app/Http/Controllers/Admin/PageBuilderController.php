<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
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
    /**
     * Store a newly created page stub to initialize the visual builder.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title'  => 'required|string|max:255|unique:pages,title',
            'slug'   => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'image'  => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $page = Page::create($request->all());

        return redirect()->route('admin.pages.edit', $page->id)
            ->with('success', __('Page initialized successfully. Proceeding to visual builder.'));
    }

    /**
     * Show the visual builder interface for a specific page.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\View\View
     */
    public function edit(Page $page): View
    {
        return view('admin.page-builder.form', compact('page'));
    }

    /**
     * Update the visual structure and assets of a page via AJAX.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Page $page): JsonResponse
    {
        $request->validate([
            'html' => 'required|string',
            'css'  => 'nullable|string'
        ]);
    
        try {
            // Process base64 images in HTML/CSS and migrate them to Spatie Media Library
            $html = $this->processImagesHTML($page, $request->input('html'));
            $css = $this->processImagesCSS($page, $request->input('css'));
        
            $page->update([
                'html' => $html, 
                'css'  => $css
            ]);
        
            return response()->json([
                'success' => true,
                'message' => __('Page structure and assets synchronized successfully!'),
                'page'    => $page
            ]);

        } catch (\Exception $e) {
            Log::error("PageBuilder Sync Error: {$e->getMessage()}", ['page_id' => $page->id]);
            return response()->json([
                'success' => false,
                'message' => __('Asset synchronization failed: :error', ['error' => $e->getMessage()])
            ], 500);
        }
    }
    
    /**
     * Extract base64 encoded images from HTML tags and re-host them as persistent assets.
     *
     * @param  \App\Models\Page  $page
     * @param  string  $html
     * @return string
     */
    private function processImagesHTML(Page $page, string $html): string
    {
        preg_match_all('/<img[^>]+src="data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"]+)"/i', $html, $matches, PREG_SET_ORDER);
    
        foreach ($matches as $match) {
            $extension = $match[1];
            $base64Data = $match[2];
            $imageData = base64_decode($base64Data);

            if (!$imageData) continue;

            $tempPath = $this->createTempAsset($imageData, $extension);
            
            if ($tempPath) {
                try {
                    $media = $page->addMedia($tempPath)->toMediaCollection('pagebuilder');
                    $html = str_replace($match[0], '<img src="' . $media->getUrl() . '"', $html);
                } finally {
                    File::delete($tempPath);
                }
            }
        }
    
        return $html;
    }
    
    /**
     * Extract base64 encoded images from CSS url() declarations and re-host them as persistent assets.
     *
     * @param  \App\Models\Page  $page
     * @param  string  $css
     * @return string
     */
    private function processImagesCSS(Page $page, string $css): string
    {
        $css = html_entity_decode($css);
        preg_match_all('/url\((?:\'|")?data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"\')]+)(?:\'|")?\)/i', $css, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $extension = $match[1];
            $base64Data = $match[2];
            $imageData = base64_decode($base64Data);

            if (!$imageData) continue;

            $tempPath = $this->createTempAsset($imageData, $extension);
            
            if ($tempPath) {
                try {
                    $media = $page->addMedia($tempPath)->toMediaCollection('pagebuilder');
                    $css = str_replace($match[0], 'url("' . $media->getUrl() . '")', $css);
                } finally {
                    File::delete($tempPath);
                }
            }
        }
    
        return $css;
    }

    /**
     * Internal helper to securely initialize a temporary file for asset transformation.
     *
     * @param  string  $data
     * @param  string  $extension
     * @return string|null
     */
    private function createTempAsset(string $data, string $extension): ?string
    {
        $tempDir = storage_path('app/temp/pagebuilder/');
        
        if (!File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }

        $tempPath = $tempDir . Str::random(32) . '.' . $extension;

        if (File::put($tempPath, $data) === false) {
            return null;
        }

        return $tempPath;
    }
}
