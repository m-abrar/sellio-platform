<?php

namespace App\Services\Admin;

use App\Models\Page;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PageBuilderService
{
    /**
     * Process HTML and CSS to migrate base64 images to Spatie Media Library.
     */
    public function syncPageAssets(Page $page, string $html, ?string $css = null): array
    {
        $processedHtml = $this->processImagesHTML($page, $html);
        $processedCss = $css ? $this->processImagesCSS($page, $css) : null;

        return [
            'html' => $processedHtml,
            'css'  => $processedCss,
        ];
    }

    private function processImagesHTML(Page $page, string $html): string
    {
        preg_match_all('/<img[^>]+src="data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"]+)"/i', $html, $matches, PREG_SET_ORDER);
    
        foreach ($matches as $match) {
            $extension = $match[1];
            $imageData = base64_decode($match[2]);

            if (!$imageData) continue;

            $tempPath = $this->createTempAsset($imageData, $extension);
            if ($tempPath) {
                try {
                    $media = $page->addMedia($tempPath)->toMediaCollection('pagebuilder');
                    $newSrc = $media->getUrl();
                    // Extract the full data URI string from the match
                    $dataUri = 'data:image/' . $match[1] . ';base64,' . $match[2];
                    $html = str_replace($dataUri, $newSrc, $html);
                } finally {
                    File::delete($tempPath);
                }
            }
        }
        return $html;
    }

    private function processImagesCSS(Page $page, string $css): string
    {
        $css = html_entity_decode($css);
        preg_match_all('/url\((?:\'|")?data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,([^"\')]+)(?:\'|")?\)/i', $css, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $extension = $match[1];
            $imageData = base64_decode($match[2]);

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

    private function createTempAsset(string $data, string $extension): ?string
    {
        $tempDir = storage_path('app/temp/pagebuilder/');
        if (!File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }
        $tempPath = $tempDir . Str::random(32) . '.' . $extension;
        return (File::put($tempPath, $data) !== false) ? $tempPath : null;
    }
}
