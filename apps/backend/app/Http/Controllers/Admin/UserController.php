<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Services\Admin\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class UserController
 * Orchestrates the administrative lifecycle for platform identities, 
 * managing roles, permissions, and specialized profiles for Buyers and Partners.
 */
class UserController extends Controller
{
    /**
     * The user management service.
     *
     * @var \App\Services\Admin\UserManagementService
     */
    protected UserManagementService $userService;

    /**
     * UserController constructor.
     *
     * @param  \App\Services\Admin\UserManagementService  $userService
     */
    public function __construct(UserManagementService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a paginated listing of all registered users.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $users = User::with('roles')->latest()->paginate(15);
        return view('admin.users.index', compact('users'));
    }

    /**
     * Display the comprehensive profile and interaction metrics for a specific user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\View\View
     */
    public function show(User $user): View
    {
        $user->load(['roles'])
            ->loadCount([
                'properties', 
                'jobApplications', 
                'reviews',
            ]);

        return view('admin.users.show', compact('user'));
    }

    /**
     * Display a paginated list of users with the 'Buyer' profile.
     *
     * @return \Illuminate\View\View
     */
    public function buyers(): View
    {
        $users = User::where('is_buyer', true)->with('roles')->latest()->paginate(15);
        $viewTitle = __('Buyers');
        return view('admin.users.index', compact('users', 'viewTitle'));
    }

    /**
     * Display a paginated list of users with the 'Partner' profile.
     *
     * @return \Illuminate\View\View
     */
    public function partners(): View
    {
        $users = User::where('is_partner', true)->with('roles')->latest()->paginate(15);
        $viewTitle = __('Partners');
        return view('admin.users.index', compact('users', 'viewTitle'));
    }

    /**
     * Show the form for creating a new platform identity.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $roles = Role::all();
        return view('admin.users.create', compact('roles'));
    }

    /**
     * Store a newly created user identity and assign initial roles.
     *
     * @param  \App\Http\Requests\Admin\UserStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UserStoreRequest $request): RedirectResponse
    {
        $this->userService->saveUser($request->validated());
        
        return redirect()->route('admin.users.index')
            ->with('success', __('User created successfully.'));
    }

    /**
     * Show the form for editing an existing user identity.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\View\View
     */
    public function edit(User $user): View
    {
        $user->load('roles');
        $roles = Role::all();
        return view('admin.users.edit', compact('user', 'roles'));
    }

    /**
     * Update an existing user identity and manage sensitive role transitions.
     *
     * @param  \App\Http\Requests\Admin\UserStoreRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UserStoreRequest $request, User $user): RedirectResponse
    {
        // Security Protocol: Only Super Admins can modify other Super Admins
        if ($user->hasRole('super-admin') && !auth()->user()->hasRole('super-admin')) {
            return redirect()->back()->with('error', __('You cannot modify a Super Admin profile.'));
        }

        $this->userService->saveUser($request->validated(), $user);
        
        return redirect()->route('admin.users.index')
            ->with('success', __('User updated successfully.'));
    }

    /**
     * Remove a user identity from the platform, enforcing core admin protection.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->hasRole('super-admin')) {
            return redirect()->back()->with('error', __('Super Admins cannot be deleted.'));
        }

        $user->delete();
        
        return redirect()->route('admin.users.index')
            ->with('success', __('User deleted successfully.'));
    }

    /**
     * Approve a user as a Partner and assign the relevant role.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(User $user): RedirectResponse
    {
        $user->assignRole('partner');
        
        return redirect()->back()->with('success', __('User approved as Partner successfully.'));
    }
}
