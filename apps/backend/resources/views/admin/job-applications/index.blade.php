{{--
    Administrative Jobs: Global Application Registry
    
    This view provides a central Dashboard for tracking candidate 
    submissions. It integrates high-fidelity audit trails for talent 
    acquisition metrics, pipeline progression, and recruitment engagement. 
    It facilitates efficient candidate triage through multi-dimensional 
    filtering and responsive data architecture.
    
    @extends adminlte::page
    @context Job Application Management
    @variables Paginator $applications Paginated collection of JobApplication models.
--}}
@extends('adminlte::page')

@section('title', __('Job Applications | Talent Acquisition'))

@section('plugins.Select2', true)
@section('plugins.Sweetalert2', true)
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-signature mr-2 text-primary opacity-50"></i>
                    {{ __('Talent Acquisition') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Review candidate submissions, resume profiles, and hiring pipeline progress.') }}</p>
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
        @include('admin.job-applications._filter')

        {{-- Main Table --}}
        <div class="card registry-table-card">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Applications') }}</h3>
                <div class="card-tools d-flex align-items-center ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                        <i class="fas fa-users mr-1"></i> {{ $applications->total() }} {{ __('APPLICANTS') }}
                    </span>
                    <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="applications-table" class="table table-hover table-premium mb-0 datatable-init"
                           data-datatable-config='{"paging": false, "searching": false, "ordering": true, "info": false, "dom": "t"}'>
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4 col-media-80">{{ __('Asset') }}</th>
                                <th>{{ __('Listing') }}</th>
                                <th>{{ __('Candidate Principal') }}</th>
                                <th>{{ __('Applied At') }}</th>
                                <th class="text-center">{{ __('Pipeline') }}</th>
                                <th class="text-right pr-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($applications as $app)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm mx-auto">
                                            <img src="{{ $app->job->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">{{ $app->job->title ?? 'N/A' }}</span>
                                        <div class="d-flex align-items-center mt-1 gap-6">
                                            @if($app->job && $app->job->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">
                                                    {{ $app->job->category->title }}
                                                </span>
                                            @endif
                                            <span class="text-muted smallest font-weight-bold uppercase">ID: #{{ $app->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $app->user->name ?? __('External Applicant') }}</span>
                                        <div class="smallest text-muted text-monospace">{{ $app->user->email ?? __('no-email') }}</div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $app->created_at->format('d M, Y') }}</div>
                                        <small class="text-muted smallest uppercase font-weight-bold"><i class="far fa-clock mr-1 text-primary opacity-50"></i>{{ $app->created_at->format('H:i') }}</small>
                                    </td>
                                    @php $statusMeta = $app->getStatusMeta(); @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusMeta['color'] }}-light text-{{ $statusMeta['color'] }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 badge-min-90">
                                            <i class="fas fa-{{ $statusMeta['icon'] }} mr-1"></i> {{ $statusMeta['label'] }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium">
                                            <a href="{{ route('admin.job-applications.show', $app->id) }}" class="btn text-info" data-toggle="tooltip" title="Inspect Record"><i class="fas fa-eye"></i></a>
                                            <form action="{{ route('admin.job-applications.destroy', $app->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn text-danger" 
                                                        data-toggle="tooltip" title="Purge Record" 
                                                        data-action="delete-trigger"
                                                        data-confirm-title="Purge Record?"
                                                        data-confirm-text="Permanently delete application?">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => 6,
                                    'icon' => 'fas fa-file-signature',
                                    'title' => __('No Applications Detected'),
                                    'description' => __('The Applications is currently awaiting synchronized candidate submissions. These will appear as soon as your listings receive interest.')
                                ])
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($applications, 'hasPages') && $applications->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $applications->firstItem() }} - {{ $applications->lastItem() }} {{ __('of') }} {{ $applications->total() }} {{ __('records') }}</div>
                    <div>{{ $applications->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection


@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
