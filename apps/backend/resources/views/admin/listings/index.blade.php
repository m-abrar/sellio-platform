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
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row mb-4">
            <div class="col-12">
                <ul class="nav nav-pills p-1 bg-white shadow-xs rounded-pill border" id="statusTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'all' ? 'active shadow-lg' : '' }} px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                            <i class="fas fa-list mr-1"></i> All
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'active' ? 'active shadow-lg' : '' }} px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'active']) }}">
                            <i class="fas fa-check-circle mr-1"></i> Active
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'pending' ? 'active shadow-lg' : '' }} px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                            <i class="fas fa-hourglass-start mr-1"></i> Pending
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'expired' ? 'active shadow-lg' : '' }} px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" 
                           href="{{ route(Route::currentRouteName(), ['status' => 'expired']) }}">
                            <i class="fas fa-calendar-times mr-1"></i> Expired
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0">
                    {{ $type !== 'all' ? 'Filtering results for ' . \Illuminate\Support\Str::title($type) : 'Marketplace Catalog' }}
                </h3>
                <div class="card-tools">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest letter-spacing-1">
                        {{ $listings->total() }} ASSETS FOUND
                    </span>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="listings-table" class="table table-hover table-premium mb-0">
                        <thead>
                            <tr>
                                <th class="text-center pl-4" style="width: 80px">Asset</th>
                                <th>Identity & Metrics</th>
                                <th>Proprietor</th>
                                @if($type === 'all')
                                    <th>Vertical</th>
                                @endif
                                <th>State</th>
                                <th class="text-right pr-4">Metrics</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($listings as $listing)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 50px; height: 50px;">
                                            <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'" class="w-100 h-100 object-fit-cover">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 1rem;">{{ $listing->title ?? 'Untitled' }}</span>
                                        <div class="d-flex align-items-center mt-1">
                                            <span class="smallest font-weight-bold text-muted mr-3">#{{ str_pad($listing->id, 5, '0', STR_PAD_LEFT) }}</span>
                                            <small class="text-muted font-weight-600">
                                                <i class="fas fa-map-marker-alt mr-1 text-danger"></i>{{ $listing->location->title ?? 'Global Access' }}
                                            </small>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if ($listing->user)
                                            <div class="d-flex align-items-center">
                                                <div class="bg-primary-soft rounded-circle mr-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                                                    <i class="fas fa-user text-primary smallest"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark" style="font-size: 0.85rem;">{{ $listing->user->name }}</span>
                                                    <small class="text-muted smallest font-weight-bold uppercase">UID: {{ $listing->user->id }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill smallest font-weight-bold">LEGACY ACCOUNT</span>
                                        @endif
                                    </td>
                                    @if($type === 'all')
                                        <td class="align-middle">
                                            @php
                                                $styles = [
                                                    'Property'   => ['bg' => 'primary-soft', 'text' => 'primary', 'icon' => 'building'],
                                                    'Auto'       => ['bg' => 'info-soft', 'text' => 'info', 'icon' => 'car'],
                                                    'Event'      => ['bg' => 'success-soft', 'text' => 'success', 'icon' => 'calendar-check'],
                                                    'JobListing' => ['bg' => 'dark-soft', 'text' => 'dark', 'icon' => 'briefcase'],
                                                    'Service'    => ['bg' => 'danger-soft', 'text' => 'danger', 'icon' => 'tools'],
                                                    'Classified' => ['bg' => 'warning-soft', 'text' => 'warning', 'icon' => 'bullhorn'],
                                                ];
                                                $style = $styles[$listing->listing_type] ?? ['bg' => 'secondary-soft', 'text' => 'secondary', 'icon' => 'cube'];
                                            @endphp
                                            <span class="badge badge-{{ $style['text'] }}-light px-3 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                <i class="fas fa-{{ $style['icon'] }} mr-1"></i> {{ $listing->listing_type }}
                                            </span>
                                        </td>
                                    @endif
                                    <td class="align-middle">
                                        <div class="mb-1">
                                            @if ($listing->expires_at && $listing->expires_at->isPast())
                                                <span class="badge badge-danger-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">EXPIRED</span>
                                            @elseif ($listing->is_published && $listing->approved_at)
                                                <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase animate-pulse">ACTIVE</span>
                                            @elseif ($listing->is_published && !$listing->approved_at)
                                                <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">PENDING</span>
                                            @else
                                                <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">DRAFT</span>
                                            @endif
                                        </div>
                                        <small class="text-muted font-weight-bold smallest uppercase letter-spacing-1">
                                            SYNCED {{ $listing->created_at->format('M d, Y') }}
                                        </small>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            @php
                                                $typeKey = strtolower($listing->listing_type);
                                                $pluralMap = ['joblisting' => 'jobs'];
                                                $vertical = $pluralMap[$typeKey] ?? \Illuminate\Support\Str::plural($typeKey);
                                                $routePrefix = "admin." . $vertical;
                                            @endphp

                                            @if (!$listing->approved_at)
                                                <form action="{{ route($routePrefix . '.approve', $listing->id) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-white btn-sm text-success py-2 px-3 border-right" data-toggle="tooltip" title="Approve">
                                                        <i class="fas fa-check-double"></i>
                                                    </button>
                                                </form>
                                            @else
                                                <form action="{{ route($routePrefix . '.disapprove', $listing->id) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-white btn-sm text-warning py-2 px-3 border-right" data-toggle="tooltip" title="Rollback">
                                                        <i class="fas fa-undo-alt"></i>
                                                    </button>
                                                </form>
                                            @endif

                                            <a href="{{ route($routePrefix . '.edit', $listing->id) }}" class="btn btn-white btn-sm text-primary py-2 px-3 border-right" data-toggle="tooltip" title="Modify">
                                                <i class="fas fa-pencil-alt"></i>
                                            </a>
                                            
                                            <form action="{{ route($routePrefix . '.destroy', $listing->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Purge" onclick="return confirm('Permanently delete listing?')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="py-5 text-center">
                                        <i class="fas fa-layer-group fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">Registry Is Idle</h5>
                                        <p class="text-secondary small">No marketplace assets matched your current filtration parameters.</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($listings, 'hasPages') && $listings->hasPages())
                <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase">Showing {{ $listings->firstItem() }} to {{ $listings->lastItem() }} of {{ $listings->total() }} assets</div>
                    <div>{{ $listings->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection

@push('css')
<style>
    #statusTabs.nav-pills .nav-link { color: #64748b; transition: all 0.3s ease; border: none !important; }
    #statusTabs.nav-pills .nav-link.active { background-color: var(--primary) !important; color: #fff !important; }
    #statusTabs.nav-pills .nav-link:hover:not(.active) { background-color: var(--primary-soft); color: var(--primary); }
</style>
@endpush

@push('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endpush
