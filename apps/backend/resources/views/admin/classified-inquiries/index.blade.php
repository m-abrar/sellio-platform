@extends('adminlte::page')

@section('title', __('Classified Inquiries | Marketplace Intelligence'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bullhorn mr-2 text-primary opacity-50"></i>
                    {{ __('Classified Inquiries') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor consumer engagement, ad inquiries, and marketplace lead generation performance.</p>
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
        <div class="card card-premium shadow-sm mb-4 border-0">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.classified-inquiries.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Target Asset</label>
                            <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-search-dollar text-primary"></i></span>
                                </div>
                                <select name="classifiedad" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2">
                                    <option value="">All Classifieds</option>
                                    @foreach($classifieds as $c)
                                        <option value="{{ $c->id }}" {{ request('classifiedad') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Market Category</label>
                            <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-tags text-primary"></i></span>
                                </div>
                                <select name="category" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0">
                                    <option value="">All Categories</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Inquiry Status</label>
                            <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                <div class="input-group-prepend border-0">
                                    <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-filter text-primary"></i></span>
                                </div>
                                <select name="status" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0">
                                    <option value="">All Statuses</option>
                                    <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Awaiting Review</option>
                                    <option value="viewed" {{ $status == 'viewed' ? 'selected' : '' }}>Viewed</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="btn-group w-100 shadow-sm rounded-pill overflow-hidden border" style="height: 46px;">
                                <button type="submit" class="btn btn-primary font-weight-bold smallest uppercase d-flex align-items-center justify-content-center">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ route('admin.classified-inquiries.index') }}" class="btn btn-white px-3 border-left d-flex align-items-center justify-content-center">
                                    <i class="fas fa-undo text-danger"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-exchange-alt mr-2 text-primary opacity-50"></i> {{ __('Interaction Registry') }}
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="inquiries-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4" style="width: 80px">Asset</th>
                                <th>Ad Intelligence</th>
                                <th>Inquirer Profile</th>
                                <th>Engagement Date</th>
                                <th class="text-center">Lifecycle</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($inquiries as $inquiry)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="icon-box-soft bg-primary-soft mx-auto d-flex align-items-center justify-content-center shadow-xs overflow-hidden" style="width:50px; height:50px; border-radius: 12px;">
                                            <img src="{{ $inquiry->classifiedAd->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Classified" class="img-fluid" style="object-fit: cover; width: 100%; height: 100%;" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">
                                            {{ $inquiry->classifiedAd->title ?? 'N/A' }}
                                        </span>
                                        <div class="d-flex align-items-center mt-1" style="gap: 6px;">
                                            @if($inquiry->classifiedAd && $inquiry->classifiedAd->category)
                                                <span class="badge badge-primary-soft text-primary px-2 py-1 font-weight-bold smallest uppercase" style="border-radius: 6px;">
                                                    <i class="fas fa-tag mr-1 opacity-50"></i>{{ $inquiry->classifiedAd->category->title }}
                                                </span>
                                            @endif
                                            @if($inquiry->classifiedAd && $inquiry->classifiedAd->location)
                                                <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">
                                                    <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i>{{ $inquiry->classifiedAd->location->title }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if($inquiry->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-light mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:36px; height:36px; border-radius: 10px;">
                                                    <span class="smallest font-weight-bold text-primary">{{ strtoupper(substr($inquiry->user->name ?? 'P', 0, 1)) }}</span>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $inquiry->user->name }}</span>
                                                    <small class="text-muted text-monospace smallest">{{ $inquiry->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('Guest Lead') }}</span>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                            <i class="far fa-calendar-alt mr-2 text-primary opacity-50"></i>{{ $inquiry->created_at->format('M d, Y') }}
                                        </div>
                                        <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-2 opacity-50"></i>{{ $inquiry->created_at->format('H:i') }}
                                        </div>
                                    </td>
                                    @php
                                        $statusMap = [
                                            'pending'   => 'badge-warning-light text-warning',
                                            'viewed'    => 'badge-info-light text-info',
                                            'contacted' => 'badge-success-light text-success',
                                            'replied'   => 'badge-success-light text-success',
                                        ];
                                        $statusClass = $statusMap[$inquiry->status] ?? 'badge-secondary-light text-secondary';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            {{ $inquiry->status ?? 'Received' }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.classified-inquiries.show', $inquiry->id) }}" 
                                               class="btn btn-white text-info py-2 px-4 d-inline-flex align-items-center"
                                               data-toggle="tooltip" title="Inspect Inquiry">
                                                <i class="fas fa-eye mr-1"></i> VIEW
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="6" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-exchange-alt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Inquiries Detected</h5>
                                            <p class="text-secondary small mb-0">Consumer inquiries for marketplace ads will materialize here.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($inquiries, 'hasPages') && $inquiries->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $inquiries->firstItem() }} - {{ $inquiries->lastItem() }} of {{ $inquiries->total() }} records</div>
                    <div>{{ $inquiries->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
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
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'All Classifieds'
        });
    });
</script>
@stop
