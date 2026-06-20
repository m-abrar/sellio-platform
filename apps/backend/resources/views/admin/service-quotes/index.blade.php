{{--
    Administrative Services: Global All Leads
    
    This view provides a central Dashboard for tracking service 
    quote requests. It integrates high-fidelity audit trails for 
    customer inquiries, scope requests, and estimated revenue across 
    services. It facilitates efficient lead management through 
    multi-dimensional filtering and responsive data architecture.
    
    @extends adminlte::page
    @context Service Quote Management
    @variables Paginator $serviceQuotes Paginated collection of ServiceQuote models.
    @variables Collection $services List of active services for mapping.
    @variables Collection $categories Service categories for vertical taxonomy.
--}}
@extends('adminlte::page')

@section('title', __('Service Quotes') . ' | ' . __('Revenue'))

@section('plugins.Select2', true)
@section('plugins.Sweetalert2', true)
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice mr-2 text-primary opacity-50"></i>
                    {{ __('Service Quotes') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Track customer inquiries, scope requests, and estimated revenue across services.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
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
                <form method="GET" action="{{ url()->current() }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="form-label-premium">{{ __('Target Service') }}</label>
                            <div class="input-group input-group-premium select2-input-group-fix">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-concierge-bell text-xs"></i></span>
                                </div>
                                <select name="service" class="form-control select2">
                                    <option value="">{{ __('All Services') }}</option>
                                    @foreach($services as $s)
                                        <option value="{{ $s->id }}" {{ request('service') == $s->id ? 'selected' : '' }}>{{ $s->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">{{ __('Service Sector') }}</label>
                            <div class="input-group input-group-premium select2-input-group-fix">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-tags text-xs"></i></span>
                                </div>
                                <select name="category" class="form-control select2">
                                    <option value="">{{ __('All Sectors') }}</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">{{ __('Quote Status') }}</label>
                            <div class="input-group input-group-premium select2-input-group-fix">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control select2">
                                    <option value="all">{{ __('All Lifecycle States') }}</option>
                                    @foreach (['pending' => __('Awaiting Review'), 'quoted' => __('Quote Issued'), 'accepted' => __('Accepted Engagement'), 'rejected' => __('Rejected')] as $val => $label)
                                        <option value="{{ $val }}" {{ $status == $val ? 'selected' : '' }}>{{ $label }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex align-items-center justify-content-end gap-12">
                                <button type="submit" class="btn-filter-premium flex-grow-1">
                                    <i class="fas fa-sync-alt mr-2"></i> {{ __('UPDATE') }}
                                </button>
                                <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Filters') }}">
                                    <i class="fas fa-undo"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('All Leads') }}</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-file-invoice-dollar mr-1"></i> {{ $serviceQuotes->total() }} {{ __('LEADS') }}
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="quotes-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4 width-80">{{ __('Asset') }}</th>
                                <th>{{ __('Service') }}</th>
                                <th>{{ __('Customer Principal') }}</th>
                                <th>{{ __('Scope') }}</th>
                                <th>{{ __('Engagement') }}</th>
                                <th class="text-center">{{ __('Lifecycle') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($serviceQuotes as $quote)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $quote->service->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $quote->service->title ?? 'N/A' }}</span>
                                        <div class="d-flex align-items-center mt-1 gap-6">
                                            @if($quote->service && $quote->service->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $quote->service->category->title }}
                                                </span>
                                            @endif
                                            <span class="text-muted smallest font-weight-bold uppercase">ID: #{{ $quote->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $quote->user->name ?? __('Guest Prospect') }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $quote->user->email ?? __('no-email') }}</div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="badge badge-light border text-dark uppercase font-weight-bold px-3 py-1 rounded-pill smallest letter-spacing-1">
                                            {{ __($quote->scope_size ?: 'Standard') }}
                                        </span>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                            {{ $quote->requested_date ? $quote->requested_date->format('M d, Y') : __('Flexible') }}
                                        </div>
                                        <small class="text-muted smallest uppercase font-weight-bold">{{ $quote->created_at->diffForHumans() }}</small>
                                    </td>
                                    @php
                                        $statusMap = ['pending' => 'badge-warning-light', 'quoted' => 'badge-info-light', 'accepted' => 'badge-success-light', 'rejected' => 'badge-danger-light'];
                                        $statusClass = $statusMap[$quote->status] ?? 'badge-secondary-light';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 min-width-90">
                                            {{ strtoupper(__($quote->status)) }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.service-quotes.show', $quote->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Inspect Record') }}"><i class="fas fa-eye"></i></a>
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Record') }}"
                                                    data-action="delete-trigger"
                                                    data-form-id="delete-form-{{ $quote->id }}"
                                                    data-confirm-title="{{ __('Purge Record?') }}"
                                                    data-confirm-text="{{ __('Permanently delete quote request?') }}"
                                                    data-confirm-btn="{{ __('Confirm') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                            <form id="delete-form-{{ $quote->id }}" action="{{ route('admin.service-quotes.destroy', $quote->id) }}" method="POST" class="d-none">
                                                @csrf @method('DELETE')
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                    @include('admin._partials._empty-state', [
                                        'colspan' => 7,
                                        'icon' => 'fas fa-file-invoice',
                                        'title' => __('No Leads Detected'),
                                        'description' => __('Customer scope requests and revenue inquiries will materialize here once synchronized with the professional services catalog.'),
                                    ])
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if($serviceQuotes->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $serviceQuotes->firstItem(), 'last' => $serviceQuotes->lastItem(), 'total' => $serviceQuotes->total()]) }}</div>
                    <div>{{ $serviceQuotes->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/service-quotes-index.js') }}"></script>
@endsection
