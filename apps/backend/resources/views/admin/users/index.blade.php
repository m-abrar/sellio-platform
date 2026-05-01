@extends('adminlte::page')

@section('title', 'Users Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-users-cog mr-2 text-primary"></i> {{ $viewTitle ?? 'User Management' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage registered users, authentication profiles, and access tiers.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 10px;">
                    <a href="{{ route('admin.roles.index') }}" class="btn btn-outline-primary btn-sm rounded-pill px-3 font-weight-bold shadow-sm">
                        <i class="fas fa-user-shield mr-1"></i> ROLES
                    </a>
                    <a href="{{ route('admin.permissions.index') }}" class="btn btn-outline-info btn-sm rounded-pill px-3 font-weight-bold shadow-sm">
                        <i class="fas fa-key mr-1"></i> PERMISSIONS
                    </a>
                    <a href="{{ route('admin.users.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg ml-2">
                        <i class="fas fa-plus-circle mr-1"></i> ADD USER
                    </a>
                </div>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Users</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3 d-flex align-items-center">
            <h3 class="card-title font-weight-600 text-dark mb-0">
                Registered Users Explorer
            </h3>
            <span class="badge badge-pill badge-secondary-soft text-secondary ml-3 px-3 py-1 border" style="font-weight: 700; font-size: 0.7rem;">{{ count($users) }} TOTAL</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="users-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>User Identity</th>
                            <th>Email Address</th>
                            <th>Assigned Roles</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($users as $user)
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-wrapper mr-3">
                                            <img src="{{ $user->avatar_url }}" 
                                                 alt="{{ $user->name }}" 
                                                 class="img-circle shadow-xs border" 
                                                 style="width: 45px; height: 45px; object-fit: cover; border: 2px solid #fff !important;">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $user->name }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold" style="font-size: 0.6rem; letter-spacing: 0.5px;">
                                                Joined {{ $user->created_at->format('M Y') }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <a href="mailto:{{ $user->email }}" class="text-info small font-weight-bold">
                                        <i class="far fa-envelope mr-1 text-xs text-muted"></i> {{ $user->email }}
                                    </a>
                                </td>
                                <td class="align-middle">
                                    {{-- 1. Render Assigned Roles --}}
                                    @foreach($user->roles as $role)
                                        <span class="badge badge-info-light text-info px-2 py-1 text-uppercase mr-1" style="font-size: 0.65rem; letter-spacing: 0.3px;">
                                            <i class="fas fa-shield-alt mr-1 text-xs"></i> {{ $role->name }}
                                        </span>
                                    @endforeach

                                    {{-- 2. Pending Approval Notification Badge --}}
                                    @if($user->is_partner && !$user->hasRole('partner'))
                                        <span class="badge badge-warning-light text-warning px-2 py-1 text-uppercase mr-1" style="font-size: 0.65rem; letter-spacing: 0.3px;">
                                            <i class="fas fa-hourglass-half mr-1 text-xs"></i> Pending Partner
                                        </span>
                                    @endif
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        {{-- Approve Button for Pending Partners --}}
                                        @if($user->is_partner && !$user->hasRole('partner'))
                                        <form action="{{ route('admin.users.approve', $user->id) }}" method="POST" class="d-inline">
                                            @csrf
                                            <button type="submit" class="btn btn-default btn-sm text-success" 
                                                    data-toggle="tooltip" title="Approve Partner">
                                                <i class="fas fa-check-circle"></i>
                                            </button>
                                        </form>
                                        @endif

                                        {{-- New: Show/Preview Button --}}
                                        <a href="{{ route('admin.users.show', $user->id) }}" 
                                        class="btn btn-default btn-sm text-primary" 
                                        data-toggle="tooltip" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </a>

                                        {{-- Edit Button --}}
                                        <a href="{{ route('admin.users.edit', $user->id) }}" 
                                        class="btn btn-default btn-sm text-info" 
                                        data-toggle="tooltip" title="Edit Profile">
                                            <i class="fas fa-user-edit"></i>
                                        </a>

                                        {{-- Delete Button --}}
                                        <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete User"
                                                    onclick="return confirm('Permanently delete this user account?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <i class="fas fa-user-shield fa-4x text-light mb-3"></i>
                                    <h5 class="text-muted font-weight-bold">No Users Found</h5>
                                    <p class="small text-secondary">Try adjusting your filters or create a new user.</p>
                                    <a href="{{ route('admin.users.create') }}" class="btn btn-primary btn-sm btn-flat mt-2">
                                        Create First User
                                    </a>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* User Identity Specifics */
    .avatar-wrapper img { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    .avatar-wrapper img:hover { transform: scale(1.15); z-index: 10; position: relative; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#users-table tbody tr:not(.empty-state)').length > 0) {
            $('#users-table').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search by name or email...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
    });
</script>
@endsection
