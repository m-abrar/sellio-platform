<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PageBuilderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:pages,title',
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'image' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $page = Page::create($request->all());

        return redirect()->route('admin.pages.edit', $page->id)->with('success', 'Page added successfully.');
    }

    public function edit($id)
    {
        $page = Page::findOrFail($id);
        return view('admin.page-builder.form', compact('page'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string'
        ]);
    
        $page = Page::find($id);
        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }
    
        $html = $this->processImagesHTML($page, $request->html);
    
        $css = $this->processImagesCSS($page, $request->css);
    
        $page->update(['html' => $html, 'css' => $css]);
    
        return response()->json([
            'message' => 'Page saved successfully!',
            'page' => $page
        ]);
    }
    
    private function processImagesHTML(Page $page, $html)
    {
        preg_match_all('/<img[^>]+src="data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"]+)"/i', $html, $matches, PREG_SET_ORDER);
    
        foreach ($matches as $match) {
            $extension = $match[1];
            $base64Data = $match[2];
    
            $imageData = base64_decode($base64Data);
            if (!$imageData) {
                continue;
            }
    
            $fileName = Str::random(20) . '.' . $extension;
            $tempDir = storage_path('app/temp/');
            $tempFilePath = $tempDir . $fileName;
    
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }
    
            if (file_put_contents($tempFilePath, $imageData) === false) {
                continue;
            }
    
            try {
                $media = $page->addMedia($tempFilePath)
                    ->toMediaCollection('pagebuilder');
            } catch (\Exception $e) {
                continue;
            }
    
            $imageUrl = $media->getUrl();
            $html = str_replace($match[0], '<img src="' . $imageUrl . '"', $html);
    
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }
        }
    
        return $html;
    }
    
    private function processImagesCSS(Page $page, $css)
    {
        $css = html_entity_decode($css);
    
        preg_match_all('/url\((?:\'|")?data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"\')]+)(?:\'|")?\)/i', $css, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $extension = $match[1];
            $base64Data = $match[2];
    
            $imageData = base64_decode($base64Data);
            if (!$imageData) {
                continue;
            }
    
            $fileName = Str::random(20) . '.' . $extension;
            $tempDir = storage_path('app/temp/');
            $tempFilePath = $tempDir . $fileName;
    
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }
    
            if (file_put_contents($tempFilePath, $imageData) === false) {
                continue;
            }
    
            try {
                $media = $page->addMedia($tempFilePath)
                    ->toMediaCollection('pagebuilder');
            } catch (\Exception $e) {
                continue;
            }
    
            $imageUrl = $media->getUrl();
            $css = str_replace($match[0], 'url("' . $imageUrl . '")', $css);
    
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }
        }
    
        return $css;
    }
}
