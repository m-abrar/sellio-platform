{{--
    Administrative Communication Module: Automated Notification Registry
    
    This view serves as the primary orchestration layer for system-wide 
    communication triggers. It facilitates the management of automated 
    email blueprints, delivery heartbeat monitoring, and dynamic 
    placeholder injection protocols across the platform's notification engine.
    
    @extends adminlte::page
    @context Communication Management
    @variables Collection $templates Collection of EmailTemplate model instances.
--}}
@extends('adminlte::page')

@section('title', 'Communication Assets | Automated Blueprints')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-paper-plane mr-2 text-primary opacity-50"></i> Communication Assets
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage automated system triggers and high-fidelity email notification blueprints.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-paper-plane mr-2 text-primary opacity-50"></i> System Notification Registry
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                {{ count($templates) }} ACTIVE BLUEPRINTS
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="email-templates-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4 w-45-p">Subject & Logic Spectrum</th>
                            <th class="w-20-p">Identifier Key</th>
                            <th class="text-center">Operational Heartbeat</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($templates as $template)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center icon-box-50 rounded-14">
                                            <i class="fas fa-envelope-open-text text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-1-0">{{ $template->subject }}</span>
                                            <small class="text-muted font-weight-bold uppercase smallest letter-spacing-1">
                                                <i class="fas fa-bolt mr-1 text-warning"></i> Automated Trigger Logic
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <code class="text-primary font-weight-bold bg-primary-soft px-3 py-1 rounded-pill border-0 smallest letter-spacing-1">
                                        {{ $template->key }}
                                    </code>
                                </td>

                                <td class="text-center align-middle">
                                    @if($template->is_active === true)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-check-circle mr-1 animate-pulse"></i> ACTIVE
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-pause-circle mr-1"></i> STANDBY
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.email-templates.edit', $template->id) }}" 
                                           class="btn btn-white text-info py-2 px-3 font-weight-bold smallest uppercase d-inline-flex align-items-center" 
                                           data-toggle="tooltip" title="Configure Template">
                                            <i class="fas fa-cog mr-1"></i> CONFIG
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="4" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-mail-bulk fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">Notification Engine Is Idle</h5>
                                        <p class="text-secondary small">System email templates will appear here once seeded.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {{-- Intelligence Tip --}}
    <div class="bg-dark p-4 rounded-xl shadow-premium border border-white border-opacity-10 mt-4">
        <div class="d-flex align-items-center">
            <div class="bg-primary-soft rounded-circle mr-3 d-flex align-items-center justify-content-center shadow-lg icon-box-48">
                <i class="fas fa-lightbulb text-primary"></i>
            </div>
            <div>
                <h6 class="font-weight-bold text-white mb-1 smallest uppercase letter-spacing-1">Data Injection Protocol</h6>
                <p class="text-white opacity-50 mb-0 small font-weight-600">
                    Inject dynamic context using placeholders: 
                    <code class="mx-1 text-primary font-weight-bold">@{{user_name}}</code>, 
                    <code class="mx-1 text-primary font-weight-bold">@{{order_id}}</code>, or 
                    <code class="mx-1 text-primary font-weight-bold">@{{site_name}}</code>.
                </p>
            </div>
        </div>
    </div>
</div>
@endsection

@push('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        if ($('#email-templates-table tbody tr:not(.empty-state)').length > 0) {
            $('#email-templates-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-0 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-0 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter blueprints...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light w-250-p');
        }
    });
</script>
@endpush
