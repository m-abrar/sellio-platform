<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AuditManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ActivityLogController
 * Orchestrates the administrative audit trail, providing sophisticated filtering 
 * across heterogeneous marketplace verticals and authentication events.
 */
class ActivityLogController extends Controller
{
    /**
     * @var AuditManagementService
     */
    protected AuditManagementService $auditService;

    /**
     * ActivityLogController constructor.
     *
     * @param AuditManagementService $auditService
     */
    public function __construct(AuditManagementService $auditService)
    {
        $this->auditService = $auditService;
    }

    /**
     * Display a filtered and paginated listing of system-wide activity logs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $filterKey = $request->get('filter', 'all');
        $activityLogs = $this->auditService->getLogs($filterKey);
        
        return view('admin.activity_log.index', [
            'activityLogs'  => $activityLogs,
            'filters'       => $this->auditService->getFilters(),
            'currentFilter' => $filterKey,
        ]);
    }

    /**
     * Securely purge activity logs. 
     * Reserved for Super Admin oversight to maintain audit integrity.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearLog(): RedirectResponse
    {
        if (!auth()->user()->hasRole('super-admin')) {
            return back()->with('error', __('Unauthorized: Only Super Admins can purge audit trails.'));
        }

        $count = $this->auditService->purgeLogs();
        
        return back()->with('success', __(':count activity logs have been successfully purged.', ['count' => $count]));
    }
}
