{{--
    Administrative Automotive: Purchase Inquiry Registry
    
    This view provides a central command center for tracking vehicle 
    purchase leads. It integrates high-fidelity audit trails for lead 
    engagement, lifecycle status tracking (pending, viewed, contacted), 
    and multi-dimensional filtering to optimize sales pipeline conversion.
    
    @extends adminlte::page
    @context Automotive Lead Management
    @variables Paginator $inquiries Paginated collection of AutoInquiry models.
--}}
@extends('adminlte::page')

@section('title', __('Auto Inquiries'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i>
                    {{ __('Auto Inquiries') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track vehicle inquiries, buyer engagement, and automotive lead conversion metrics.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.auto-inquiries.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-2"></i> Log New Lead
                    </a>
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
        @include('admin.auto-inquiries._filter')

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">Leads Registry</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-bullseye mr-1"></i> {{ $inquiries->total() }} LEADS FOUND
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="inquiries-table" class="table table-hover table-premium mb-0 datatable-init"
                           data-datatable-config='{"paging": false, "lengthChange": false, "searching": false, "ordering": true, "info": false, "dom": "t"}'>
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4 col-media-80">Media</th>
                                <th>Vehicle Asset</th>
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
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $inquiry->auto->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $inquiry->auto->title ?? 'N/A' }}</span>
                                        <small class="text-muted font-weight-bold uppercase letter-spacing-1">ID: #{{ $inquiry->auto_id }}</small>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $inquiry->user->name ?? 'Guest Lead' }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $inquiry->user->email ?? 'no-email' }}</div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $inquiry->created_at->format('M d, Y') }}</div>
                                        <small class="text-muted smallest uppercase font-weight-bold"><i class="far fa-clock mr-1 text-xs"></i>{{ $inquiry->created_at->format('H:i') }}</small>
                                    </td>
                                    @php
                                        $statusMap = ['pending' => 'badge-warning-light', 'viewed' => 'badge-info-light', 'contacted' => 'badge-success-light'];
                                        $statusClass = $statusMap[$inquiry->status] ?? 'badge-secondary-light';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 badge-min-90">
                                            {{ $inquiry->status ?? 'Received' }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.auto-inquiries.show', $inquiry->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Lead"><i class="fas fa-eye"></i></a>
                                            <a href="{{ route('admin.auto-inquiries.edit', $inquiry->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Lead"><i class="fas fa-edit"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => 6,
                                    'icon' => 'fas fa-car',
                                    'title' => 'No Inquiries Found',
                                    'description' => 'Vehicle leads will materialize here once synchronized with the marketplace. You can also manually log a new lead.',
                                    'button_text' => 'LOG NEW LEAD',
                                    'button_link' => route('admin.auto-inquiries.create')
                                ])
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
