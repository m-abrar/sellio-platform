<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\MaintenanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class SystemController
 * Orchestrates administrative maintenance and diagnostic protocols, coordinating 
 * server-level optimization, cache synchronization, and system health monitoring.
 */
class SystemController extends Controller
{
    /**
     * @var MaintenanceService
     */
    protected MaintenanceService $maintenanceService;

    /**
     * SystemController constructor.
     *
     * @param MaintenanceService $maintenanceService
     */
    public function __construct(MaintenanceService $maintenanceService)
    {
        $this->maintenanceService = $maintenanceService;
    }

    /**
     * Display the centralized System Maintenance dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function maintenance(): View
    {
        return view('admin.system.maintenance');
    }

    /**
     * Clear the application data cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearCache(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'clearCache', __('Application cache cleared successfully!'));
    }

    /**
     * Clear the configuration cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearConfig(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'clearConfig', __('Configuration cache cleared successfully!'));
    }

    /**
     * Clear the route registration cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearRoute(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'clearRoute', __('Route cache cleared successfully!'));
    }

    /**
     * Clear the compiled Blade template cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function clearView(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'clearView', __('View cache cleared successfully!'));
    }

    /**
     * Execute a full application optimization protocol.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function optimize(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'optimize', __('Application optimized and cached successfully!'));
    }

    /**
     * Re-initialize the public storage symbolic link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function storageLink(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'createStorageLink', __('Storage symbolic link created successfully!'));
    }

    /**
     * Queue a background task to regenerate all media asset variations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function regenerateMedia(Request $request): JsonResponse|RedirectResponse
    {
        return $this->handleAction($request, 'queueMediaRegeneration', __('Media regeneration task has been queued successfully!'));
    }

    /**
     * Display the comprehensive System Health & Environment status report.
     *
     * @return \Illuminate\View\View
     */
    public function status(): View
    {
        $data = $this->maintenanceService->getStatusReport();
        return view('admin.system.status', [
            'requirements' => $data['requirements'],
            'permissions' => $data['permissions']
        ]);
    }

    /**
     * Generic action handler to encapsulate response protocols and error logging.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $method
     * @param  string  $successMessage
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function handleAction(Request $request, string $method, string $successMessage): JsonResponse|RedirectResponse
    {
        try {
            $this->maintenanceService->{$method}();
            
            return $request->ajax() 
                ? response()->json(['success' => true, 'message' => $successMessage]) 
                : back()->with('success', $successMessage);
        } catch (\Exception $e) {
            Log::error("System Maintenance - {$method} Error: " . $e->getMessage());
            
            $errorMessage = __('System action failed: :error', ['error' => $e->getMessage()]);
            
            return $request->ajax() 
                ? response()->json(['success' => false, 'message' => $errorMessage], 500) 
                : back()->with('error', $errorMessage);
        }
    }
}
