{{--
    Administrative Real Estate: Global Property
    
    This view serves as the authoritative inventory control hub for 
    real estate assets. It integrates multi-dimensional filtering, 
    lifecycle status auditing, and direct access to asset configuration 
    and cloning protocols, ensuring streamlined marketplace oversight.
    
    @extends adminlte::page
    @context Property Inventory Management
    @variables Paginator $properties Paginated collection of Property models.
--}}
@extends('adminlte::page')

@section('title', __('Properties'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-building mr-2 text-primary"></i> {{ __('Properties') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage real estate listings, property features, and booking availability.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.properties.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Property') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @php
        $propertyModeTabs = [
            'all' => ['label' => __('All'), 'icon' => 'fa-layer-group'],
            'rental' => ['label' => __('Rental'), 'icon' => 'fa-key'],
            'sale' => ['label' => __('Sale'), 'icon' => 'fa-tag'],
        ];
    @endphp
    <div class="card registry-card-premium registry-filter-card mb-4">
        <div class="card-body py-3">
            <ul class="nav nav-pills nav-pills-premium flex-wrap">
                @foreach($propertyModeTabs as $mode => $tab)
                    <li class="nav-item">
                        <a class="nav-link {{ ($activePropertyMode ?? 'all') === $mode ? 'active' : '' }}"
                           href="{{ route('admin.properties.index', array_merge(request()->except(['page', 'property_mode']), $mode === 'all' ? [] : ['property_mode' => $mode])) }}">
                            <i class="fas {{ $tab['icon'] }} mr-1 mr-md-2"></i>
                            {{ $tab['label'] }}
                            <span class="badge badge-light text-muted ml-2">{{ $propertyModeCounts[$mode] ?? 0 }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>

    @include('admin.properties._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Property Inventory') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $properties->total() }} {{ __('ASSETS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="properties-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "searching": true, "ordering": true, "info": false, "dom": "<\"row pt-3\"<\"col-sm-12\"f>>t", "language": {"search": "", "searchPlaceholder": "{{ __('Search property catalog...') }}"}}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">{{ __('Media') }}</th>
                            <th>{{ __('Property Identity') }}</th>
                            <th>{{ __('Classification') }}</th>
                            <th>{{ __('Financials') }}</th>
                            <th>{{ __('Lifecycle') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($properties as $property)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $property->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $property->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID:') }} #{{ str_pad($property->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $property->location->title ?? $property->city ?? __('Global') }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $property->category->title ?? __('Uncategorized') }}</div>
                                    <small class="text-muted smallest uppercase letter-spacing-1">
                                        {{ $property->number_of_bedrooms ?? 0 }} {{ __('Beds') }} | {{ $property->number_of_bathrooms ?? 0 }} {{ __('Baths') }}
                                    </small>
                                </td>

                                <td class="align-middle">
                                    @if($property->is_rental)
                                        <div class="font-weight-bold text-warning smallest uppercase letter-spacing-1">{{ __('Short-Term Rental') }}</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($property->price_per_night, 2) }} <small class="text-muted">/ {{ __('night') }}</small></div>
                                    @else
                                        <div class="font-weight-bold text-success smallest uppercase letter-spacing-1">{{ __('Direct Sale') }}</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($property->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $property->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                    <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-user-tie mr-1 opacity-50"></i> {{ $property->user->name ?? __('Admin') }}
                                    </small>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.properties.edit', $property->id) }}" 
                                           class="btn text-primary" 
                                           data-toggle="tooltip" title="{{ __('Modify Asset') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <a href="{{ route('admin.properties.duplicate', $property->id) }}" 
                                           class="btn text-success" 
                                           data-toggle="tooltip" title="{{ __('Clone Entry') }}">
                                            <i class="fas fa-copy"></i>
                                        </a>
                                        <form action="{{ route('admin.properties.destroy', $property->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Asset') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Asset?') }}"
                                                    data-confirm-text="{{ __('Permanently delete this property listing?') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-building',
                                'title' => __('No real-estate assets detected.'),
                                'description' => __('Synchronize your inventory or initialize new property entries to populate this registry.'),
                                'button_text' => __('INITIALIZE PROPERTY'),
                                'button_link' => route('admin.properties.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($properties->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $properties->firstItem(), 'last' => $properties->lastItem(), 'total' => $properties->total()]) }}</div>
                <div>{{ $properties->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
