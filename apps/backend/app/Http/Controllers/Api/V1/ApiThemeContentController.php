<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\Theme;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiThemeContentController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme_key' => ['required', 'string', 'max:50'],
            'page' => ['required', 'string', 'max:50'],
        ]);

        $theme = Theme::where('theme_key', $validated['theme_key'])->first();

        if (! $theme) {
            return response()->json([
                'success' => false,
                'message' => 'Theme content could not be resolved for the requested theme.',
                'data' => null,
            ], 404);
        }

        $records = PageContent::where('theme_key', $theme->theme_key)
            ->where('page', $validated['page'])
            ->get();

        $content = [];
        $media = [];

        foreach ($records as $record) {
            $key = "{$record->section}.{$record->content_key}";

            if (in_array($record->input_type, ['image', 'logo', 'file'], true)) {
                $media[$key] = $record->getFirstMediaUrl(PageContent::PRIMARY_MEDIA) ?: $record->value;
                continue;
            }

            $content[$key] = $record->value;
        }

        return response()->json([
            'success' => true,
            'message' => 'Theme content retrieved',
            'data' => [
                'theme_key' => $theme->theme_key,
                'page' => $validated['page'],
                'content' => $content,
                'media' => $media,
                'config' => $theme->config ?? [],
            ],
        ]);
    }
}
