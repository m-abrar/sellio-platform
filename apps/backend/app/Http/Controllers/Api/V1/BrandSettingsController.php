<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class BrandSettingsController extends Controller
{
    /**
     * Retrieve the global dynamic brand settings (site name, logo, favicon).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(): JsonResponse
    {
        $siteName = setting('site_name', 'Sellio');
        $faviconPath = setting('site_favicon');
        $logoPath = setting('site_logo');

        // Dynamically build fully qualified URLs for the brand assets
        $faviconUrl = $faviconPath ? url(Storage::url($faviconPath)) : asset('favicons/favicon.ico');
        $logoUrl = $logoPath ? url(Storage::url($logoPath)) : asset('admin-assets/app-logo.webp');

        return response()->json([
            'success' => true,
            'data' => [
                'site_name'    => $siteName,
                'site_favicon' => $faviconUrl,
                'site_logo'    => $logoUrl,
            ],
        ]);
    }
}
