{{--
    Administrative Services: Global Inventory Registry
    
    This view provides the authoritative Dashboard for the 
    professional services marketplace. It aggregates service focus 
    areas, vertical classifications, and financial rate configurations 
    for all service assets. It facilitates efficient lifecycle tracking 
    and catalog oversight through a responsive data architecture.
    
    @extends adminlte::page
    @context Service Inventory Management
    @variables Paginator $services Paginated collection of Service model instances.
--}}
@extends('adminlte::page')

@section('title', __('Services'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i> {{ __('Service Listings') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage professional service offerings and appointment configurations.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.services.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Service') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.services._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Service Catalog') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $services->total() }} {{ __('ASSETS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="services-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "searching": false, "ordering": true, "info": false, "dom": "t"}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">{{ __('Media') }}</th>
                            <th>{{ __('Service Identity') }}</th>
                            <th>{{ __('Classification') }}</th>
                            <th>{{ __('Financials') }}</th>
                            <th>{{ __('Lifecycle') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($services as $service)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $service->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $service->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID') }}: #{{ str_pad($service->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-folder mr-1 opacity-50"></i> {{ $service->category->title ?? __('General') }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if($service->is_subscription)
                                            <span class="badge badge-info-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ __('Subscription') }}</span>
                                        @elseif($service->is_project_based)
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ __('Project-Based') }}</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ __('Fixed Rate') }}</span>
                                        @endif
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>{{ $service->city ?? __('Remote') }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-success h6 mb-0">{{ $service->price_formatted ?? '$0.00' }}</div>
                                    <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Base Quotation') }}</small>
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $service->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.services.edit', $service->id) }}" class="btn text-primary" data-toggle="tooltip" title="{{ __('Modify Service') }}"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.services.duplicate', $service->id) }}" class="btn text-success" data-toggle="tooltip" title="{{ __('Clone Entry') }}"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.services.destroy', $service->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Service') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Service?') }}"
                                                    data-confirm-text="{{ __('Permanently delete this service listing?') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-concierge-bell',
                                'title' => __('No professional services detected.'),
                                'description' => __('Synchronize your service board or initialize new service entries to populate this registry.'),
                                'button_text' => __('INITIALIZE SERVICE'),
                                'button_link' => route('admin.services.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($services->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $services->firstItem() }} - {{ $services->lastItem() }} {{ __('of') }} {{ $services->total() }} {{ __('records') }}</div>
                <div>{{ $services->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection
