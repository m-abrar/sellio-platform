@extends('adminlte::page')

@section('title', ($type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All')) . ' Listings')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-list-ul mr-2 text-danger"></i>
                    {{ $type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All') }} Listings
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Listings</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row mb-3">
            <div class="col-12">
                <div class="bg-white rounded shadow-sm p-2 d-flex align-items-center" style="gap: 10px; width: fit-content; border: 1px solid #e9ecef;">
                    <span class="text-muted font-weight-bold ml-2 mr-1"><i class="fas fa-filter mr-1 text-warning"></i> Status:</span>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'all' ? 'active bg-primary font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                               href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                               All
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'active' ? 'active bg-success font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                               href="{{ route(Route::currentRouteName(), ['status' => 'active']) }}">
                               Active
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'pending' ? 'active bg-warning font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                               href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                               Pending
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'expired' ? 'active bg-danger font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm" 
                               href="{{ route(Route::currentRouteName(), ['status' => 'expired']) }}">
                               Expired
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">
                    <i class="fas fa-search mr-1 text-warning"></i> 
                    {{ $type !== 'all' ? 'Filtering results for ' . \Illuminate\Support\Str::title($type) : 'Listing results from all Categories' }}
                </h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    {{-- Standardized premium table class --}}
                    <table id="listings-table" class="table table-striped table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 80px" class="text-center">ID</th>
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
                                        <span class="text-muted small font-weight-bold text-monospace">#{{ $listing->id }}</span>
                                    </td>
                                    <td class="align-middle">
                                        <div class="d-flex align-items-center">
                                            {{-- Premium shadow and border-radius for thumbnails --}}
                                            <div class="listing-img mr-3 shadow-xs border rounded overflow-hidden" style="width: 50px; height: 42px; background: #f8f9fa;">
                                                <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" 
                                                     class="w-100 h-100" style="object-fit: cover;">
                                            </div>
                                            <div>
                                                <span class="d-block font-weight-bold text-dark mb-0">{{ $listing->title ?? 'Untitled' }}</span>
                                                <small class="text-muted"><i class="fas fa-map-marker-alt mr-1"></i>{{ $listing->location->name ?? 'Global' }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if ($listing->user)
                                            <div class="d-flex align-items-center">
                                                <div class="user-avatar mr-2 bg-light rounded-circle text-center d-flex align-items-center justify-content-center shadow-xs" style="width: 32px; height: 32px; border: 1px solid #eee;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div class="user-info">
                                                    <span class="d-block text-sm font-weight-bold text-dark">{{ $listing->user->name }}</span>
                                                    <small class="text-muted text-monospace" style="font-size: 0.7rem;">UID: {{ $listing->user->id }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-light border text-muted px-2 py-1">
                                                <i class="fas fa-user-slash mr-1"></i> Deleted User
                                            </span>
                                        @endif
                                    </td>
                                    @if($type === 'all')
                                        <td class="align-middle">
                                            @php
                                                $badgeClasses = [
                                                    'Property'   => 'bg-indigo',
                                                    'Auto'       => 'bg-lightblue',
                                                    'Event'      => 'bg-olive',
                                                    'JobListing' => 'bg-navy',
                                                    'Service'    => 'bg-maroon',
                                                    'Classified' => 'bg-orange',
                                                ];
                                                $class = $badgeClasses[$listing->listing_type] ?? 'bg-secondary';
                                            @endphp
                                            <span class="badge {{ $class }} px-2 py-1 shadow-xs text-xs">
                                                <i class="fas fa-tag fa-xs mr-1 opacity-7"></i> {{ $listing->listing_type }}
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
                                        <div class="small">
                                            <span class="text-muted d-block" style="font-size: 0.75rem;">
                                                <i class="fas fa-plus-circle mr-1 text-secondary"></i> {{ $listing->created_at->format('M d, Y') }}
                                            </span>
                                            @if ($listing->expires_at)
                                                <span class="text-muted d-block" style="font-size: 0.75rem;">
                                                    <i class="fas fa-hourglass-end mr-1 text-secondary"></i> {{ $listing->expires_at->format('M d, Y') }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="text-right align-middle px-4">
                                        {{-- Standardized premium action group --}}
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
                                                    <button type="submit" class="btn btn-default btn-sm text-success" 
                                                            data-toggle="tooltip" title="Approve Listing"
                                                            onclick="return confirm('Approve this listing?')">
                                                        <i class="fas fa-check-circle"></i>
                                                    </button>
                                                </form>
                                            @else
                                                <form action="{{ route($routePrefix . '.disapprove', $listing->id) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-default btn-sm text-info" 
                                                            data-toggle="tooltip" title="Send back to Pending"
                                                            onclick="return confirm('Move back to pending?')">
                                                        <i class="fas fa-undo"></i>
                                                    </button>
                                                </form>
                                            @endif

                                            <a href="{{ route($routePrefix . '.edit', $listing->id) }}" 
                                               class="btn btn-default btn-sm text-warning" 
                                               data-toggle="tooltip" title="Edit Listing">
                                                <i class="fas fa-pencil-alt"></i>
                                            </a>
                                            
                                            <form action="{{ route($routePrefix . '.destroy', $listing->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                        data-toggle="tooltip" title="Delete Listing"
                                                        onclick="return confirm('Permanently delete listing?')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="py-5 text-center">
                                        <i class="fas fa-layer-group fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Listings Found</h5>
                                        <p class="text-secondary small">There are no listings in the system matching this status.</p>
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

@section('js')
<script>
    $(function () {
        if ($('#listings-table tbody tr:not(.empty-state)').length > 0) {
            $('#listings-table').DataTable({
                "paging": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "order": [[4, "desc"]],
                dom: '<"d-flex justify-content-start ml-3 mb-3"f>rt',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search {{ $status ?? 'all' }} listings..."
                },
                "columnDefs": [
                    { "orderable": false, "targets": [0, 1, 6] }
                ]
            });
        }
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection

