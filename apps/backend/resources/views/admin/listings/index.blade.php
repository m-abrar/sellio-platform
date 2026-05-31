{{--
    Administrative Marketplace: Unified Asset Registry
    
    This view serves as the authoritative command center for all marketplace 
    verticals (Properties, Autos, Events, Jobs, Services, Classifieds). It 
    facilitates high-fidelity auditing of submission states, proprietor 
    identifiers, and lifecycle transitions across the platform's distributed 
    asset architecture.
    
    @extends adminlte::page
    @context Marketplace Management
    @variables Paginator $listings Paginated collection of Listing model instances.
    @variables String $type The active vertical filter (all, properties, etc).
    @variables String $status The active lifecycle state filter.
--}}
@extends('adminlte::page')

@section('title', __(':type Listings', ['type' => ($type !== 'all' ? \Illuminate\Support\Str::title($type) : \Illuminate\Support\Str::title($status ?? 'All'))]))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i>
                    {{ __(':type Marketplace', ['type' => ($type !== 'all' ? __(Str::title($type)) : __(Str::title($status ?? 'All')))]) }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Audit marketplace submissions, moderation statuses, and lifecycle states.') }}</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-center justify-content-sm-end gap-12">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large mr-2"></i> {{ __('Dashboard') }}
                </a>
                <div class="dropdown">
                    <button class="btn btn-primary btn-registry-add dropdown-toggle" type="button" id="addListingDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD NEW ASSET') }}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-premium border-0 animate__animated animate__fadeInUp" aria-labelledby="addListingDropdown">
                        <h6 class="dropdown-header text-uppercase smallest letter-spacing-1 font-weight-bold text-muted mb-2">{{ __('Select Listing Vertical') }}</h6>
                        
                        @if(module_enabled('properties'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.properties.create') }}">
                            <div class="icon-box-soft bg-success-soft text-success mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-home smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Property Listing') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('autos'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.autos.create') }}">
                            <div class="icon-box-soft bg-primary-soft text-primary mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-car smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Automotive Asset') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('events'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.events.create') }}">
                            <div class="icon-box-soft bg-info-soft text-info mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-calendar-alt smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Event / Ticket') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('jobs'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.jobs.create') }}">
                            <div class="icon-box-soft bg-warning-soft text-warning mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-briefcase smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Job Opportunity') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('services'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.services.create') }}">
                            <div class="icon-box-soft bg-danger-soft text-danger mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-tools smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Professional Service') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('classifieds'))
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.classifieds.create') }}">
                            <div class="icon-box-soft bg-secondary-soft text-secondary mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-tags smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('General Classified') }}</span>
                        </a>
                        @endif

                        @if(module_enabled('products'))
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item d-flex align-items-center py-2 px-4 transition-all" href="{{ route('admin.products.create') }}">
                            <div class="icon-box-soft bg-dark-soft text-dark mr-3 rounded-circle d-flex align-items-center justify-content-center icon-box-sm">
                                <i class="fas fa-shopping-bag smallest"></i>
                            </div>
                            <span class="font-weight-bold small">{{ __('Retail Product') }}</span>
                        </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Filter Protocol --}}
        <div class="card registry-card-premium registry-filter-card mb-4">
            <div class="card-body">
                <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
                    <div class="d-flex flex-column flex-md-row align-items-center">
                        <span class="form-label-premium mb-3 mb-md-0 mr-md-4">
                            <i class="fas fa-filter mr-2 text-primary"></i> {{ __('Lifecycle State:') }}
                        </span>
                        <ul class="nav nav-pills nav-pills-premium flex-wrap justify-content-center">
                            <li class="nav-item">
                                <a class="nav-link {{ $status === 'all' ? 'active' : '' }}" 
                                   href="{{ route(Route::currentRouteName(), ['status' => 'all']) }}">
                                   <i class="fas fa-th-large mr-1 mr-md-2"></i> {{ __('ALL ASSETS') }}
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ $status === 'active' ? 'active' : '' }}" 
                                   href="{{ route(Route::currentRouteName(), ['status' => 'active']) }}">
                                   <i class="fas fa-check-circle mr-1 mr-md-2"></i> {{ __('ACTIVE') }}
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ $status === 'pending' ? 'active' : '' }}" 
                                   href="{{ route(Route::currentRouteName(), ['status' => 'pending']) }}">
                                   <i class="fas fa-hourglass-half mr-1 mr-md-2"></i> {{ __('PENDING') }}
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ $status === 'expired' ? 'active' : '' }}" 
                                   href="{{ route(Route::currentRouteName(), ['status' => 'expired']) }}">
                                   <i class="fas fa-calendar-times mr-1 mr-md-2"></i> {{ __('EXPIRED') }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">
                    {{ $type !== 'all' ? __('Filtering for') . ' ' . __(Str::title($type)) : __('Marketplace Catalog') }}
                </h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-database mr-1"></i> {{ $listings->total() }} {{ __('ASSETS FOUND') }}
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="listings-table" class="table table-hover table-premium mb-0 datatable-init"
                           data-datatable-config='{"paging": false, "lengthChange": false, "searching": false, "ordering": true, "info": false}'>
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4 col-media-80">{{ __('Asset') }}</th>
                                <th>{{ __('Identity & Location') }}</th>
                                <th>{{ __('Proprietor') }}</th>
                                @if($type === 'all')
                                    <th class="text-center">{{ __('Vertical') }}</th>
                                @endif
                                <th>{{ __('State & Sync') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($listings as $listing)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $listing->title ?? __('Untitled Asset') }}</span>
                                        <div class="d-flex align-items-center mt-1 gap-10">
                                            <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID:') }} #{{ str_pad($listing->id, 5, '0', STR_PAD_LEFT) }}</span>
                                            <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                                <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $listing->location->title ?? __('Global') }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if ($listing->user)
                                            <div class="d-flex align-items-center">
                                                <div class="mr-3 shadow-xs rounded-circle overflow-hidden border bg-white" style="width: 42px; height: 42px;">
                                                    <img src="{{ $listing->user->avatar_url }}" alt="{{ $listing->user->name }}" class="w-100 h-100" style="object-fit: cover;">
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $listing->user->name }}</span>
                                                    <div class="smallest text-muted text-monospace">{{ __('UID:') }} #{{ $listing->user->id }}</div>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ __('Legacy Account') }}</span>
                                        @endif
                                    </td>
                                    @if($type === 'all')
                                        <td class="align-middle text-center">
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
                                            <span class="badge badge-{{ $style['text'] }}-light px-3 py-1 rounded-pill smallest font-weight-bold uppercase letter-spacing-1">
                                                <i class="fas fa-{{ $style['icon'] }} mr-1 opacity-50"></i> {{ __($listing->listing_type) }}
                                            </span>
                                        </td>
                                    @endif
                                    <td class="align-middle">
                                        <div class="mb-1">
                                            @php $listingStatus = $listing->getStatusMeta(); @endphp
                                            <span class="badge badge-{{ $listingStatus['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                                <i class="fas fa-{{ $listingStatus['icon'] }} mr-1"></i> {{ $listingStatus['label'] }}
                                            </span>
                                        </div>
                                        <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-1 text-primary opacity-50"></i>{{ $listing->created_at ? $listing->created_at->diffForHumans(null, true) . ' ' . __('ago') : __('No Date') }}
                                        </div>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            @php
                                                $mType = (string)($listing->listing_type ?? class_basename($listing) ?? 'all');
                                                $mId   = (int)($listing->id ?? (method_exists($listing, 'getKey') ? $listing->getKey() : 0));
                                                $routeParams = ['listing_type' => trim(strtolower($mType)), 'listing_id' => $mId];
                                            @endphp

                                            @if (!$listing->approved_at)
                                                <form action="{{ route('admin.listings.approve', $routeParams) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn text-success" data-toggle="tooltip" title="{{ __('Approve Entry') }}">
                                                        <i class="fas fa-check-double"></i>
                                                    </button>
                                                </form>
                                            @else
                                                <form action="{{ route('admin.listings.disapprove', $routeParams) }}" method="POST" class="d-inline">
                                                    @csrf
                                                    <button type="submit" class="btn text-warning" data-toggle="tooltip" title="{{ __('Rollback Status') }}">
                                                        <i class="fas fa-undo-alt"></i>
                                                    </button>
                                                </form>
                                            @endif

                                            <a href="{{ route('admin.listings.edit', $routeParams) }}" class="btn text-primary" data-toggle="tooltip" title="{{ __('Modify Asset') }}">
                                                <i class="fas fa-pencil-alt"></i>
                                            </a>
                                            
                                            <form action="{{ route('admin.listings.destroy', $routeParams) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn text-danger" 
                                                        data-toggle="tooltip" title="{{ __('Purge Record') }}"
                                                        data-action="delete-trigger"
                                                        data-confirm-title="{{ __('Purge Record?') }}"
                                                        data-confirm-text="{{ __('Are you sure you want to permanently delete this asset?') }}">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => $type === 'all' ? 7 : 6,
                                    'icon' => 'fas fa-layer-group',
                                    'title' => ($status === 'all' || !$status) ? __('No Assets Found') : __('No :status Assets Found', ['status' => __(Str::title($status))]),
                                    'description' => __('The catalog is currently awaiting synchronized marketplace entries. Initialize your first entry to get started.'),
                                    'button_text' => __('ADD FIRST ASSET'),
                                    'button_link' => route('admin.listings.index')
                                ])
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($listings, 'hasPages') && $listings->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $listings->firstItem(), 'last' => $listings->lastItem(), 'total' => $listings->total()]) }}</div>
                    <div>{{ $listings->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@stop

@push('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endpush
