@extends('adminlte::page')

@section('title', ($type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All')) . ' Listings')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i>
                    {{ $type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All') }} Marketplace
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Audit marketplace submissions, moderation statuses, and lifecycle states.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Listings') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row mb-4">
            <div class="col-12">
                <ul class="nav nav-pills p-1 bg-white shadow-xs rounded-pill" id="statusTabs" role="tablist" style="width: fit-content; border: 1px solid #e2e8f0;">
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'all' ? 'active' : '' }} px-4 py-2 rounded-pill font-weight-600" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                            <i class="fas fa-list mr-1"></i> All
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'active' ? 'active' : '' }} px-4 py-2 rounded-pill font-weight-600" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'active']) }}">
                            <i class="fas fa-check-circle mr-1"></i> Active
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'pending' ? 'active' : '' }} px-4 py-2 rounded-pill font-weight-600" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                            <i class="fas fa-hourglass-start mr-1"></i> Pending
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'expired' ? 'active' : '' }} px-4 py-2 rounded-pill font-weight-600" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'expired']) }}">
                            <i class="fas fa-calendar-times mr-1"></i> Expired
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card card-primary card-outline shadow-sm border-0">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">
                    {{ $type !== 'all' ? 'Filtering results for ' . \Illuminate\Support\Str::title($type) : 'Listing results from all Categories' }}
                </h3>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="listings-table" class="table table-hover table-premium mb-0">
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>Listing Info</th>
                                <th>Submitted By</th>
                                @if($type === 'all')
                                    <th>Category</th>
                                @endif
                                <th>Status</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($listings as $listing)
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $listing->title ?? 'Untitled' }}</span>
                                        <div class="d-flex align-items-center mt-1">
                                            <small class="badge badge-light border text-muted mr-2">ID: #{{ $listing->id }}</small>
                                            <small class="text-muted">
                                                <i class="fas fa-map-marker-alt mr-1 text-danger"></i>{{ $listing->location->title ?? 'Global' }}
                                            </small>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if ($listing->user)
                                            <div class="d-flex align-items-center">
                                                <div class="user-avatar mr-2 bg-light rounded-circle text-center d-flex align-items-center justify-content-center shadow-xs" style="width: 34px; height: 34px; border: 1px solid #eee;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block text-sm font-weight-bold text-dark">{{ $listing->user->name }}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">UID: {{ $listing->user->id }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light px-2 py-1">
                                                <i class="fas fa-user-slash mr-1"></i> Deleted User
                                            </span>
                                        @endif
                                    </td>
                                    @if($type === 'all')
                                        <td class="align-middle">
                                            @php
                                                $badgeClasses = [
                                                    'Property'   => 'badge-primary',
                                                    'Auto'       => 'badge-info',
                                                    'Event'      => 'badge-success',
                                                    'JobListing' => 'badge-dark',
                                                    'Service'    => 'badge-danger',
                                                    'Classified' => 'badge-warning',
                                                ];
                                                $class = $badgeClasses[$listing->listing_type] ?? 'badge-secondary';
                                            @endphp
                                            <span class="badge {{ $class }} px-2 py-1 text-uppercase" style="font-size: 0.65rem;">
                                                {{ $listing->listing_type }}
                                            </span>
                                        </td>
                                    @endif
                                    <td class="align-middle">
                                        <div class="mb-1">
                                            @if ($listing->expires_at && $listing->expires_at->isPast())
                                                <span class="badge badge-danger-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Expired</span>
                                            @elseif ($listing->is_published && $listing->approved_at)
                                                <span class="badge badge-success-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Active</span>
                                            @elseif ($listing->is_published && !$listing->approved_at)
                                                <span class="badge badge-warning-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Pending Approval</span>
                                            @else
                                                <span class="badge badge-secondary-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Draft</span>
                                            @endif
                                        </div>
                                        <div class="small text-muted" style="font-size: 0.7rem;">
                                            {{ $listing->created_at->format('M d, Y') }}
                                        </div>
                                    </td>
                                    <td class="text-right align-middle px-4">
                                        <div class="btn-group btn-group-premium shadow-sm">
                                            @php
                                                $typeKey = strtolower($listing->listing_type);
                                                $pluralMap = ['joblisting' => 'jobs'];
                                                $vertical = $pluralMap[$typeKey] ?? \Illuminate\Support\Str::plural($typeKey);
                                                $routePrefix = "admin." . $vertical;
                                            @endphp

                                            @if (!$listing->approved_at)
                                                <form action="{{ route($routePrefix . '.approve', $listing->id) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-default btn-sm text-success" data-toggle="tooltip" title="Approve">
                                                        <i class="fas fa-check-circle"></i>
                                                    </button>
                                                </form>
                                            @else
                                                <form action="{{ route($routePrefix . '.disapprove', $listing->id) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-default btn-sm text-info" data-toggle="tooltip" title="Disapprove">
                                                        <i class="fas fa-undo"></i>
                                                    </button>
                                                </form>
                                            @endif

                                            <a href="{{ route($routePrefix . '.edit', $listing->id) }}" class="btn btn-default btn-sm text-primary" data-toggle="tooltip" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            
                                            <form action="{{ route($routePrefix . '.destroy', $listing->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn btn-default btn-sm text-danger" data-toggle="tooltip" title="Delete" onclick="return confirm('Permanently delete listing?')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="py-5 text-center text-muted">
                                        <i class="fas fa-layer-group fa-3x mb-3 opacity-2"></i>
                                        <h5 class="font-weight-bold">No Listings Found</h5>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($listings, 'hasPages') && $listings->hasPages())
                <div class="card-footer bg-white border-0 py-3">
                    <div class="float-right">
                        {{ $listings->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('css')
<style>
    #statusTabs.nav-pills .nav-link { color: #64748b; font-weight: 600; transition: all 0.3s ease; border: none !important; }
    #statusTabs.nav-pills .nav-link.active { background-color: var(--primary) !important; color: #fff !important; box-shadow: 0 4px 12px var(--primary-glow); }
    #statusTabs.nav-pills .nav-link:hover:not(.active) { background-color: #f1f5f9; color: var(--primary); }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
