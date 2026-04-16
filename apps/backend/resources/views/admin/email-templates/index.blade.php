@extends('adminlte::page')

@section('title', 'Email Templates')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-paper-plane mr-2 text-primary"></i> Communication Assets
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Email Templates</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Template Table Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                System Email Registry <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ count($templates) }} Definitions</span>
            </h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="email-templates-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4" style="width: 45%">Subject & Blueprint</th>
                            <th style="width: 20%">Identifier</th>
                            <th class="text-center">Operational Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($templates as $template)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded d-flex align-items-center justify-content-center shadow-xs" style="width:45px; height:45px; border-radius: 8px !important;">
                                            <i class="fas fa-envelope-open-text text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $template->subject }}</span>
                                            <small class="text-muted italic">
                                                <i class="fas fa-bolt mr-1 text-xs text-warning"></i> Automated system trigger
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <code class="text-xs text-primary bg-primary-light px-2 py-1 rounded border-0 text-monospace font-weight-bold">
                                        {{ $template->key }}
                                    </code>
                                </td>

                                <td class="text-center align-middle">
                                    @if($template->is_active === true)
                                        <span class="badge badge-success-light px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-check-circle mr-1"></i> Enabled
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-light px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-pause-circle mr-1"></i> Disabled
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.email-templates.edit', $template->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Configure Template">
                                            <i class="fas fa-cog mr-1"></i> Configure
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-mail-bulk fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Templates Defined</h5>
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

    {{-- Dynamic Variable Helper Tip --}}
    <div class="card border-0 shadow-sm mt-3" style="border-left: 4px solid #17a2b8 !important;">
        <div class="card-body py-3">
            <div class="d-flex align-items-center">
                <i class="fas fa-lightbulb text-warning mr-3 fa-lg"></i>
                <div>
                    <h6 class="mb-1 font-weight-bold text-dark">Templating Quick Tip</h6>
                    <span class="small text-muted">Inject dynamic data using placeholders: 
                        <code class="mx-1 text-danger font-weight-bold">@{{user_name}}</code>, 
                        <code class="mx-1 text-danger font-weight-bold">@{{order_id}}</code>, or 
                        <code class="mx-1 text-danger font-weight-bold">@{{site_name}}</code>.
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Blueprint Layout Utilities */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, monospace !important; }
    .font-weight-600 { font-weight: 600 !important; }
    .italic { font-style: italic; }

    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-secondary-light { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; }

    /* Action Buttons Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; padding: 0.25rem 0.75rem; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
</style>
@endsection

@section('js')
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
                "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search templates...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
    });
</script>
@endsection
