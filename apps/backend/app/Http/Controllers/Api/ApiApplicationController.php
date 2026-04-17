<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiApplicationController extends Controller
{
    /**
     * Get the currently active application configuration based on x-app-key header
     * or fallback to the active application in the database.
     */
    public function active(Request $request): JsonResponse
    {
        $appKey = $request->header('X-App-Key');

        $application = null;

        if ($appKey) {
            $application = Application::where('app_key', $appKey)->where('is_active', true)->first();
        }

        if (!$application) {
            $application = Application::active()->first();
        }

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'No active application found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Active application retrieved',
            'data' => $application
        ]);
    }

    /**
     * Get all applications (optionally filtered by vertical)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Application::orderBy('order');

        if ($request->has('vertical')) {
            $query->where('vertical', $request->query('vertical'));
        }

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        $applications = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Applications retrieved',
            'data' => $applications
        ]);
    }
}
