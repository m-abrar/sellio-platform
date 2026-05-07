<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class PermissionController
 * Orchestrates administrative security granularities, coordinating 
 * system-wide access control and module-level permission assignments.
 */
class PermissionController extends Controller
{
    /**
     * Display a comprehensive listing of all registered security permissions.
     *
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): View
    {
        $this->authorize('viewAny', Permission::class);

        $permissions = Permission::all();
        return view('admin.permissions.index', compact('permissions'));
    }

    /**
     * Show the interface for initializing a new security permission.
     *
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function create(): View
    {
        $this->authorize('create', Permission::class);
        
        return view('admin.permissions.create');
    }

    /**
     * Store a newly created security permission in the administrative database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Permission::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        Permission::create($validated);

        return redirect()->route('admin.permissions.index')
            ->with('success', __('Security permission initialized successfully.'));
    }

    /**
     * Show the interface for editing an existing security permission.
     *
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function edit(Permission $permission): View
    {
        $this->authorize('update', $permission);
        
        return view('admin.permissions.edit', compact('permission'));
    }

    /**
     * Update an existing security permission configuration in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $this->authorize('update', $permission);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update($validated);

        return redirect()->route('admin.permissions.index')
            ->with('success', __('Security permission updated successfully.'));
    }

    /**
     * Remove a security permission from the administrative database.
     *
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        $this->authorize('delete', $permission);

        $permission->delete();
        
        return redirect()->route('admin.permissions.index')
            ->with('success', __('Security permission removed successfully.'));
    }
}
