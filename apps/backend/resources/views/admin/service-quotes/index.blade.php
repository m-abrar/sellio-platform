@extends('adminlte::page')

@section('title', __('Service Quotes | Revenue Intelligence'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice mr-2 text-primary opacity-50"></i>
                    {{ __('Service Quotes') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track customer inquiries, scope requests, and estimated revenue across services.</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')
        
        {{-- Glass Filter Card --}}
        <div class="card card-premium shadow-premium mb-4 border-0" style="border-radius: 20px;">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.service-quotes.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Target Service</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-concierge-bell text-primary text-xs"></i></span>
                                </div>
                                <select name="service" class="form-control border-left-0 select2">
                                    <option value="">All Services</option>
                                    @foreach($services as $s)
                                        <option value="{{ $s->id }}" {{ request('service') == $s->id ? 'selected' : '' }}>{{ $s->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Service Sector</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-tags text-primary text-xs"></i></span>
                                </div>
                                <select name="category" class="form-control border-left-0 select2">
                                    <option value="">All Sectors</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Quote Status</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-traffic-light text-primary text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control border-left-0 select2">
                                    <option value="">All Lifecycle States</option>
                                    @foreach (['pending' => 'Awaiting Review', 'quoted' => 'Quote Issued', 'accepted' => 'Accepted', 'rejected' => 'Rejected'] as $val => $label)
                                        <option value="{{ $val }}" {{ $status == $val ? 'selected' : '' }}>{{ $label }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex" style="gap: 10px;">
                                <button type="submit" class="btn btn-primary flex-grow-1 font-weight-bold shadow-xs rounded-pill smallest uppercase">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ route('admin.service-quotes.index') }}" class="btn btn-default shadow-xs rounded-pill px-3 d-flex align-items-center justify-content-center" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo text-danger m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="card card-premium shadow-premium border-0 overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-clipboard-list mr-2 text-primary opacity-50"></i> {{ __('Revenue Opportunities') }}
                </h3>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="quotes-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4" style="width: 80px">Asset</th>
                                <th>Service Intelligence</th>
                                <th>Customer Profile</th>
                                <th>Scope</th>
                                <th>Engagement</th>
                                <th class="text-center">Lifecycle</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($serviceQuotes as $quote)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="icon-box-soft bg-primary-soft mx-auto d-flex align-items-center justify-content-center shadow-xs overflow-hidden" style="width:50px; height:50px; border-radius: 12px;">
                                            <img src="{{ $quote->service->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Service" class="img-fluid" style="object-fit: cover; width: 100%; height: 100%;" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">
                                            {{ $quote->service->title ?? __('N/A') }}
                                        </span>
                                        <div class="d-flex align-items-center mt-1" style="gap: 6px;">
                                            @if($quote->service && $quote->service->category)
                                                <span class="badge badge-primary-soft text-primary px-2 py-1 font-weight-bold smallest uppercase" style="border-radius: 6px;">
                                                    <i class="fas fa-tag mr-1 opacity-50"></i>{{ $quote->service->category->title }}
                                                </span>
                                            @endif
                                            @if($quote->service && $quote->service->location)
                                                <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $quote->service->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        @if($quote->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-light mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:36px; height:36px; border-radius: 10px;">
                                                    <span class="smallest font-weight-bold text-primary">{{ strtoupper(substr($quote->user->name ?? 'C', 0, 1)) }}</span>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $quote->user->name }}</span>
                                                    <small class="text-muted text-monospace smallest">{{ $quote->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('Guest Prospect') }}</span>
                                        @endif
                                    </td>

                                    <td class="align-middle">
                                        @if($quote->scope_size)
                                            <span class="badge badge-light border text-dark uppercase font-weight-bold px-3 py-2 rounded-xl smallest letter-spacing-1 shadow-xs">
                                                {{ $quote->scope_size }}
                                            </span>
                                        @else
                                            <span class="text-muted smallest uppercase font-weight-bold opacity-50">Standard</span>
                                        @endif
                                    </td>

                                    <td class="align-middle">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                            <i class="far fa-calendar-alt mr-2 text-primary opacity-50"></i>{{ $quote->requested_date ? $quote->requested_date->format('M d, Y') : 'Flexible' }}
                                        </div>
                                        <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-2 opacity-50"></i>{{ $quote->created_at->diffForHumans() }}
                                        </div>
                                    </td>

                                    @php
                                        $statusMap = [
                                            'pending'  => 'badge-warning-light text-warning',
                                            'quoted'   => 'badge-info-light text-info',
                                            'accepted' => 'badge-success-light text-success',
                                            'rejected' => 'badge-danger-light text-danger',
                                        ];
                                        $statusClass = $statusMap[$quote->status] ?? 'badge-secondary-light text-secondary';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            {{ $quote->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.service-quotes.show', $quote->id) }}"
                                               class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="Review Details">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <form id="delete-form-{{ $quote->id }}" action="{{ route('admin.service-quotes.destroy', $quote->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                        data-toggle="tooltip" title="Purge Lead"
                                                        onclick="confirmDelete('delete-form-{{ $quote->id }}', 'Purge Request?', 'This action will permanently remove the service lead from the revenue records.', 'Confirm')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-file-invoice fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Leads Detected</h5>
                                            <p class="text-secondary small mb-0">Customer scope requests and revenue inquiries will materialize here.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if($serviceQuotes->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $serviceQuotes->firstItem() }} - {{ $serviceQuotes->lastItem() }} of {{ $serviceQuotes->total() }} records</div>
                    <div>{{ $serviceQuotes->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@stop

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .select2-container--bootstrap4 .select2-selection--single { height: 100% !important; border: 0 !important; background: transparent !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered { line-height: 40px !important; padding-left: 0 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow { top: 50% !important; transform: translateY(-50%) !important; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'All Services'
        });
    });
</script>
@stop
