@extends('adminlte::page')

@section('title', ($type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All')) . ' Listings')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i>
                    {{ $type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All') }} Marketplace
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Audit marketplace submissions, moderation statuses, and lifecycle states.</p>
            </div>
            <div class="col-sm-5 d-flex flex-column align-items-end justify-content-center">
                <ol class="breadcrumb bg-transparent p-0 mb-0 smallest font-weight-bold text-uppercase letter-spacing-1">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}" class="text-primary">Dashboard</a></li>
                    <li class="breadcrumb-item active text-muted">Marketplace</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Filtration Protocol --}}
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                    <div class="card-body p-2 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <span class="text-muted smallest font-weight-bold ml-3 mr-3 text-uppercase letter-spacing-1">
                                <i class="fas fa-filter mr-1 text-primary"></i> Filter Vertical:
                            </span>
                            <ul class="nav nav-pills p-1 bg-light rounded-pill">
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'all' ? 'active bg-primary shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                                       <i class="fas fa-th-large mr-2"></i> ALL ASSETS
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'active' ? 'active bg-success shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'active']) }}">
                                       <i class="fas fa-check-circle mr-2"></i> ACTIVE
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'pending' ? 'active bg-warning shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                                       <i class="fas fa-hourglass-half mr-2"></i> PENDING
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === 'expired' ? 'active bg-danger shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route(Route::currentRouteName(), ['status' => 'expired']) }}">
                                       <i class="fas fa-calendar-times mr-2"></i> EXPIRED
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                    {{ $type !== 'all' ? 'Filtering for ' . \Illuminate\Support\Str::title($type) : 'Marketplace Catalog' }}
                </h3>
                <div class="card-tools d-flex align-items-center">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-database mr-1"></i> {{ $listings->total() }} ASSETS FOUND
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="listings-table" class="table table-hover table-premium mb-0">
                        <thead class="bg-light text-uppercase smallest font-weight-bold">
                            <tr>
                                <th class="text-center py-3 border-0" style="width: 80px">Asset</th>
                                <th class="py-3 border-0">Identity & Location</th>
                                <th class="py-3 border-0">Proprietor</th>
                                @if($type === 'all')
                                    <th class="py-3 border-0 text-center">Vertical</th>
                                @endif
                                <th class="py-3 border-0">State & Sync</th>
                                <th class="text-right pr-4 py-3 border-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($listings as $listing)
                                <tr>
                                    <td class="text-center align-middle py-4">
                                        <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 50px; height: 50px;">
                                            <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'" class="w-100 h-100 object-fit-cover">
                                        </div>
                                    </td>
                                    <td class="align-middle py-4">
                                        <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 1rem;">{{ $listing->title ?? 'Untitled Asset' }}</span>
                                        <div class="d-flex align-items-center mt-1">
                                            <span class="smallest font-weight-bold text-muted mr-3">#{{ str_pad($listing->id, 5, '0', STR_PAD_LEFT) }}</span>
                                            <small class="text-muted font-weight-600">
                                                <i class="fas fa-map-marker-alt mr-1 text-danger"></i>{{ $listing->location->title ?? 'Global' }}
                                            </small>
                                        </div>
                                    </td>
                                    <td class="align-middle py-4">
                                        @if ($listing->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-circle bg-light border text-muted mr-3 shadow-xs" style="width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user-circle"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark smallest">{{ $listing->user->name }}</span>
                                                    <span class="text-muted smallest">UID: #{{ $listing->user->id }}</span>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light border px-2 smallest font-weight-bold uppercase">LEGACY ACCOUNT</span>
                                        @endif
                                    </td>
                                    @if($type === 'all')
                                        <td class="align-middle text-center py-4">
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
                                    <td class="align-middle py-4">
                                        <div class="mb-1">
                                            @if ($listing->expires_at && $listing->expires_at->isPast())
                                                <span class="badge badge-danger-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">EXPIRED</span>
                                            @elseif ($listing->is_published && $listing->approved_at)
                                                <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">ACTIVE</span>
                                            @elseif ($listing->is_published && !$listing->approved_at)
                                                <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase">PENDING</span>
                                            @else
                                                <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">DRAFT</span>
                                            @endif
                                        </div>
                                        <div class="font-weight-600 text-dark smallest">{{ $listing->created_at->diffForHumans(null, true) }} ago</div>
                                    </td>
                                    <td class="text-right align-middle pr-4 py-4">
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
                                        <div class="py-4">
                                            <i class="fas fa-layer-group fa-4x text-light mb-3 d-block"></i>
                                            <p class="text-muted font-weight-bold mb-0">No active listings found for this catalog.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($listings, 'hasPages') && $listings->hasPages())
                <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase">Displaying {{ $listings->firstItem() }} - {{ $listings->lastItem() }} of {{ $listings->total() }} records</div>
                    <div>{{ $listings->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@stop

@push('css')
<style>
    .transition-all { transition: all 0.25s ease-in-out; }
</style>
@endpush

@push('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        // DataTables Premium Initialization
        if ($('#listings-table tbody tr:not(.empty-state)').length > 0) {
            $('#listings-table').DataTable({
                "paging": false, 
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3"<"col-sm-12"f>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search within catalog..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@endpush
