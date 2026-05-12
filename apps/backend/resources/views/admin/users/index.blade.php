{{--
    Administrative Identity Management: User Registry
    
    This view provides a central command hub for managing platform members. 
    It facilitates real-time auditing of user identities, email statuses, 
    assigned security roles, and provides direct access to profile 
    refinement and account lifecycle management.
    
    @extends adminlte::page
    @context User Administration
    @variables Paginator $users Paginated collection of User model instances.
--}}
@extends('adminlte::page')

@section('title', __('Users Management'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-users-cog mr-2 text-primary opacity-50"></i> {{ $viewTitle ?? 'User Management' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage registered users, authentication profiles, and access tiers.') }}</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="d-flex justify-content-end align-items-center gap-10">
                    <a href="{{ route('admin.roles.index') }}" class="btn btn-back shadow-sm px-3">
                        <i class="fas fa-user-shield mr-1"></i> {{ __('ROLES') }}
                    </a>
                    <a href="{{ route('admin.permissions.index') }}" class="btn btn-back shadow-sm px-3">
                        <i class="fas fa-key mr-1"></i> {{ __('PERMISSIONS') }}
                    </a>
                    <a href="{{ route('admin.users.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium ml-2">
                        <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD USER') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-users mr-2 text-primary opacity-50"></i> {{ $viewTitle ?? __('Registered Users') }} {{ __('Registry') }}
            </h5>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                    <i class="fas fa-database mr-1"></i> {{ $users->total() }} {{ __('TOTAL PARTICIPANTS') }}
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="users-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>{{ __('User Identity') }}</th>
                            <th>{{ __('Email Address') }}</th>
                            <th>{{ __('Assigned Roles') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
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
                                                 class="img-circle shadow-xs border icon-box-45 object-fit-cover border-2-fff">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $user->name }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold smallest-0-6 ls-0-5">
                                                {{ __('Joined') }} {{ $user->created_at->format('M Y') }}
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
                                    @foreach($user->getRoleNames() as $roleName)
                                        <span class="badge badge-info px-2 py-1 text-uppercase mr-1 smallest-0-65 ls-0-3">
                                            <i class="fas fa-shield-alt mr-1 text-xs"></i> {{ $roleName }}
                                        </span>
                                    @endforeach

                                    {{-- 2. Pending Approval Notification Badge --}}
                                    @if($user->is_partner && !$user->hasRole('partner'))
                                        <span class="badge badge-warning-light text-warning px-2 py-1 text-uppercase mr-1 smallest-0-65 ls-0-3">
                                            <i class="fas fa-hourglass-half mr-1 text-xs"></i> {{ __('Pending Partner') }}
                                        </span>
                                    @endif
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        {{-- Approve Button for Pending Partners --}}
                                        @if($user->is_partner && !$user->hasRole('partner'))
                                        <form action="{{ route('admin.users.approve', $user->id) }}" method="POST" class="d-inline">
                                            @csrf
                                            <button type="submit" class="btn btn-white btn-sm text-success py-2 px-3 border-right" 
                                                    data-toggle="tooltip" title="{{ __('Approve Partner') }}">
                                                <i class="fas fa-check-circle"></i>
                                            </button>
                                        </form>
                                        @endif

                                        {{-- New: Show/Preview Button --}}
                                        <a href="{{ route('admin.users.show', $user->id) }}" 
                                        class="btn btn-white btn-sm text-primary py-2 px-3 border-right" 
                                        data-toggle="tooltip" title="{{ __('View Details') }}">
                                            <i class="fas fa-eye"></i>
                                        </a>

                                        {{-- Edit Button --}}
                                        <a href="{{ route('admin.users.edit', $user->id) }}" 
                                        class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                        data-toggle="tooltip" title="{{ __('Edit Profile') }}">
                                            <i class="fas fa-user-edit"></i>
                                        </a>

                                        {{-- Delete Button --}}
                                        <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="{{ __('Delete User') }}"
                                                    onclick="return confirm('{{ __('Permanently delete this user account?') }}')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 4,
                                'icon' => 'fas fa-user-shield',
                                'title' => __('No Users Detected'),
                                'description' => __('The participant registry is currently empty. Synchronize your authentication provider or initialize new user profiles.'),
                                'button_text' => __('INITIALIZE USER'),
                                'button_link' => route('admin.users.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
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
                "dom": '<"row pt-3 px-4"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 text-right"f>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row pb-3 px-4"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search by name or email...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light w-250-p');
        }
    });
</script>
@endsection
