@extends('adminlte::page')

@section('title', 'Content Management')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary opacity-50"></i> Page Content Manager
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Theme-specific content orchestration for dynamic platform verticals.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Content Strategy Alert --}}
    <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 20px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-warning d-flex align-items-center justify-content-center shadow-premium-lg" style="width: 100px; height: 100px; min-width: 100px; border-radius: 20px; opacity: 0.9;">
                    <i class="fas fa-layer-group text-white fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">Theme-Specific Content Strategy</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">Content sections are tied to specific skins. Modifying assets for one theme will not affect other visual configurations.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-file-invoice mr-2 text-primary opacity-50"></i> Editable Page Sections
            </h5>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-cubes mr-1"></i> {{ $contentPages->count() }} FRAGMENTS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="content-pages-table" class="table table-hover table-premium mb-0">
                    <thead>
                        <tr>
                            <th class="pl-4">Internal Page Key</th>
                            <th>Active Theme Skin</th>
                            <th>Last Modification</th>
                            <th class="text-right pr-4">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($contentPages as $contentEntry)
                            <tr>
                                <td class="pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square-premium mr-3">
                                            <i class="fas fa-file-alt text-primary opacity-75"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark text-capitalize uppercase letter-spacing-1">{{ str_replace('_', ' ', $contentEntry->page) }}</span>
                                            <code class="premium-code">{{ $contentEntry->page }}</code>
                                        </div>
                                    </div>
                                </td>
                                
                                <td>
                                    <span class="badge badge-indigo-soft px-3 py-1 font-weight-bold rounded-pill uppercase">
                                        <i class="fas fa-palette mr-1"></i> {{ $contentEntry->theme_key }}
                                    </span>
                                </td>
                                
                                <td>
                                    <div class="d-flex align-items-center text-muted smallest font-weight-bold uppercase">
                                        <i class="far fa-clock mr-2 text-warning"></i>
                                        @isset($contentEntry->latest_update)
                                            <span>{{ \Carbon\Carbon::parse($contentEntry->latest_update)->diffForHumans() }}</span>
                                        @else
                                            <span class="opacity-50 italic">No history found</span>
                                        @endisset
                                    </div>
                                </td>
                                
                                <td class="text-right pr-4">
                                    <a href="{{ route('admin.content.edit', ['page' => $contentEntry->page, 'theme_key' => $contentEntry->theme_key]) }}" 
                                       class="btn btn-premium-soft btn-premium-soft-primary">
                                        <i class="fas fa-pencil-alt mr-1"></i> Edit Content
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="text-center py-5">
                                    <div class="empty-state">
                                        <i class="fas fa-folder-open fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold smallest uppercase letter-spacing-1">No Editable Sections Found</h5>
                                        <p class="small text-secondary mb-0">Ensure your page content registries are seeded correctly in the database.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4">
             <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                <i class="fas fa-info-circle mr-1 text-info"></i> Global Content Ledger Synchronized
             </span>
        </div>
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#content-pages-table tbody tr:not(.empty-state)').length > 0) {
            $('#content-pages-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-0 pt-2"<"col-sm-12"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row px-0 pb-3"<"col-sm-12"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search content keys...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '220px');
        }
    });
</script>
@endsection
