{{--
    Administrative Classifieds: Marketplace Inquiry Registry
    
    This view serves as the authoritative command center for monitoring 
    consumer engagement and lead generation performance. It aggregates 
    ad intelligence, inquirer principals, and engagement timelines, 
    facilitating efficient auditing of the marketplace conversion funnel 
    through a responsive data architecture and multi-dimensional filtering.
    
    @extends adminlte::page
    @context Classified Module Management
    @variables Paginator $inquiries Paginated collection of ClassifiedInquiry model instances.
--}}
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
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Monitor consumer engagement, ad inquiries, and marketplace lead generation performance.') }}</p>
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
        @include('admin.classified-inquiries._filter')

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Marketplace Registry') }}</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-bullhorn mr-1"></i> {{ $inquiries->total() }} {{ __('INQUIRIES') }}
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
                                <th class="text-center pl-4 col-media-80">{{ __('Asset') }}</th>
                                <th>{{ __('Ad Intelligence') }}</th>
                                <th>{{ __('Inquirer Principal') }}</th>
                                <th>{{ __('Engagement Date') }}</th>
                                <th class="text-center">{{ __('Lifecycle') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
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
                                        <div class="d-flex align-items-center mt-1 gap-6">
                                            @if($inquiry->classifiedAd && $inquiry->classifiedAd->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $inquiry->classifiedAd->category->title }}
                                                </span>
                                            @endif
                                            <span class="text-muted smallest font-weight-bold uppercase">ID: #{{ $inquiry->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $inquiry->user->name ?? __('Guest Lead') }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $inquiry->user->email ?? __('no-email') }}</div>
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
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 badge-min-90">
                                            {{ __($inquiry->status ?? 'Received') }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.classified-inquiries.show', $inquiry->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
                                        </div>
                                    </td>
                                </tr>
                                @empty
                                    @include('admin._partials._empty-state', [
                                        'colspan' => 6,
                                        'icon' => 'fas fa-bullhorn',
                                        'title' => __('No Inquiries Detected'),
                                        'description' => __('Consumer inquiries for marketplace ads will materialize here once synchronized with the community listings.'),
                                    ])
                                @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($inquiries, 'hasPages') && $inquiries->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $inquiries->firstItem() }} - {{ $inquiries->lastItem() }} {{ __('of') }} {{ $inquiries->total() }} {{ __('records') }}</div>
                    <div>{{ $inquiries->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
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
                "searching": false,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": 't',
                "language": {
                    "search": "",
                    "searchPlaceholder": "{{ __('Search marketplace registry...') }}"
                }
            });
        }
    });
</script>
@endsection
