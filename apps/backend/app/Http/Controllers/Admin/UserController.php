<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Services\Admin\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserManagementService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): View
    {
        $users = User::with('roles')->latest()->paginate(15);
        return view('admin.users.index', compact('users'));
    }
    /**
     * Display the specified user profile.
     * * @param User $user
     * @return View
     */
    public function show(User $user): View
    {
        // Eager load roles, and count relevant interactions for the dashboard
        $user->load(['roles'])
            ->loadCount([
                'properties', 
                'jobApplications', 
                'reviews',
            ]);

        return view('admin.users.show', compact('user'));
    }
    public function buyers(): View
    {
        $users = User::where('is_buyer', true)->with('roles')->latest()->paginate(15);
        $viewTitle = __('Buyers');
        return view('admin.users.index', compact('users', 'viewTitle'));
    }

    public function partners(): View
    {
        $users = User::where('is_partner', true)->with('roles')->latest()->paginate(15);
        $viewTitle = __('Partners');
        return view('admin.users.index', compact('users', 'viewTitle'));
    }

    public function create(): View
    {
        $roles = Role::all();
        return view('admin.users.create', compact('roles'));
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $this->userService->saveUser($request->validated());
        return redirect()->route('admin.users.index')
            ->with('success', __('User created successfully.'));
    }

    public function edit(User $user): View
    {
        $roles = Role::all();
        return view('admin.users.edit', compact('user', 'roles'));
    }

    public function update(UserStoreRequest $request, User $user): RedirectResponse
    {
        // Permission check for modifying an existing Super Admin
        if ($user->hasRole('super-admin') && !auth()->user()->hasRole('super-admin')) {
            return redirect()->back()->with('error', __('You cannot modify a Super Admin profile.'));
        }

        $this->userService->saveUser($request->validated(), $user);
        return redirect()->route('admin.users.index')
            ->with('success', __('User updated successfully.'));
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->hasRole('super-admin')) {
            return redirect()->back()->with('error', __('Super Admins cannot be deleted.'));
        }

        $user->delete();
        return redirect()->route('admin.users.index')
            ->with('success', __('User deleted successfully.'));
    }

    public function approve(User $user): RedirectResponse
    {
        $user->assignRole('partner');
        return redirect()->back()->with('success', __('User approved as Partner successfully.'));
    }
}
