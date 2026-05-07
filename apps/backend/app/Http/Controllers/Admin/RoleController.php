<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class RoleController
 * Orchestrates administrative security archetypes, coordinating hierarchical 
 * permission synchronization and system-wide Role-Based Access Control (RBAC).
 */
class RoleController extends Controller
{
    /**
     * Display a comprehensive listing of all registered security roles and their associated permissions.
     *
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): View
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::with('permissions')->get();
        return view('admin.roles.index', compact('roles'));
    }

    /**
     * Show the interface for initializing a new security role with granular permission assignments.
     *
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function create(): View
    {
        $this->authorize('create', Role::class);
        
        $permissions = Permission::all();
        return view('admin.roles.create', compact('permissions'));
    }

    /**
     * Store a newly created security role and atomically synchronize its permission mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Role::class);

        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->permissions()->sync($validated['permissions']);

        return redirect()->route('admin.roles.index')
            ->with('success', __('Security role initialized and permissions synchronized successfully.'));
    }

    /**
     * Show the interface for editing an existing security role and its permission mapping.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function edit(Role $role): View
    {
        $this->authorize('update', $role);
        
        $permissions = Permission::all();
        return view('admin.roles.edit', compact('role', 'permissions'));
    }

    /**
     * Update an existing security role and re-synchronize its granular permission mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $validated['name']]);
        $role->permissions()->sync($validated['permissions']);

        return redirect()->route('admin.roles.index')
            ->with('success', __('Security role updated and permissions re-synchronized successfully.'));
    }

    /**
     * Remove a security role from the administrative database.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        $role->delete();
        
        return redirect()->route('admin.roles.index')
            ->with('success', __('Security role removed from database successfully.'));
    }
}
