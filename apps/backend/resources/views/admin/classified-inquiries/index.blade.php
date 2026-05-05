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
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Filter Protocol --}}
        <div class="card registry-card-premium registry-filter-card mb-4">
            <div class="card-body">
                <form method="GET" action="{{ url()->current() }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="form-label-premium">Target Asset</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-search-dollar text-xs"></i></span>
                                </div>
                                <select name="classifiedad" class="form-control select2">
                                    <option value="">All Classifieds</option>
                                    @foreach($classifieds as $c)
                                        <option value="{{ $c->id }}" {{ request('classifiedad') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">Market Category</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-tags text-xs"></i></span>
                                </div>
                                <select name="category" class="form-control select2">
                                    <option value="">All Categories</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-premium">Inquiry Status</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control select2">
                                    <option value="all">All Lifecycle States</option>
                                    <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Awaiting Review</option>
                                    <option value="viewed" {{ $status == 'viewed' ? 'selected' : '' }}>Lead Viewed</option>
                                    <option value="contacted" {{ $status == 'contacted' ? 'selected' : '' }}>Contact Established</option>
                                    <option value="replied" {{ $status == 'replied' ? 'selected' : '' }}>Response Dispatched</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                                <button type="submit" class="btn-filter-premium flex-grow-1">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
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
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none" style="letter-spacing: 1px;">Marketplace Registry</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-bullhorn mr-1"></i> {{ $inquiries->total() }} INQUIRIES
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="inquiries-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4" style="width: 80px">Asset</th>
                                <th>Ad Intelligence</th>
                                <th>Inquirer Principal</th>
                                <th>Engagement Date</th>
                                <th class="text-center">Lifecycle</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($inquiries as $inquiry)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $inquiry->classifiedAd->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $inquiry->classifiedAd->title ?? 'N/A' }}</span>
                                        <div class="d-flex align-items-center mt-1" style="gap: 6px;">
                                            @if($inquiry->classifiedAd && $inquiry->classifiedAd->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $inquiry->classifiedAd->category->title }}
                                                </span>
                                            @endif
                                            <span class="text-muted smallest font-weight-bold uppercase">ID: #{{ $inquiry->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $inquiry->user->name ?? 'Guest Lead' }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $inquiry->user->email ?? 'no-email' }}</div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                            {{ $inquiry->created_at->format('d M, Y') }}
                                        </div>
                                        <small class="text-muted smallest uppercase font-weight-bold">
                                            <i class="far fa-clock mr-1 text-primary opacity-50"></i>{{ $inquiry->created_at->format('H:i') }}
                                        </small>
                                    </td>
                                    @php
                                        $statusMap = ['pending' => 'badge-warning-light', 'viewed' => 'badge-info-light', 'contacted' => 'badge-success-light', 'replied' => 'badge-success-light'];
                                        $statusClass = $statusMap[$inquiry->status] ?? 'badge-secondary-light';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" style="min-width: 90px;">
                                            {{ $inquiry->status ?? 'Received' }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.classified-inquiries.show', $inquiry->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
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
@endsection

@section('css')
<style>
    .input-group-premium .select2-container { flex: 1 1 auto !important; width: 1% !important; }
    .input-group-premium .select2-container .select2-selection--single { height: 46px !important; border: 0 !important; padding-top: 10px !important; border-radius: 0 12px 12px 0 !important; }
</style>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        if (typeof $.fn.select2 === 'function') {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#inquiries-table tbody tr:not(.empty-state)').length > 0) {
            $('#inquiries-table').DataTable({
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
                    "searchPlaceholder": "Search marketplace registry..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@endsection
