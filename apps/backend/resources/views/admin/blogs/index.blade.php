@extends('adminlte::page')

@section('title', 'Blog Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-blog mr-2 text-primary"></i> Blog Articles
                </h1>
                <ol class="breadcrumb bg-transparent p-0 mt-2 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Blogs</li>
                </ol>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Compose and curate editorial content for your marketplace community.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.blogs.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> WRITE NEW POST
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Main Table Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                Article Registry <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ $blogs->total() }} Total</span>
            </h3>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="blogs-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4" style="width: 35%">Article Info</th>
                            <th style="width: 20%">Category & Tags</th>
                            <th class="text-right">Stats</th>
                            <th class="text-right">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($blogs as $blog)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        {{-- Spatie Media Image Implementation --}}
                                        <div class="mr-3 border rounded shadow-xs overflow-hidden" style="width:60px; height:45px;">
                                            <img src="{{ $blog->thumbnail_url }}" 
                                                 alt="Cover" class="img-fluid w-100 h-100" style="object-fit: cover;">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ Str::limit($blog->title, 40) }}</span>
                                            <small class="text-muted"><i class="far fa-user mr-1"></i> {{ $blog->user->name ?? 'Admin' }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="badge badge-primary-light text-primary text-xs px-2 mb-1">
                                        {{ $blog->category->name ?? 'Uncategorized' }}
                                    </span>
                                    <div class="text-xs text-muted">
                                        <i class="fas fa-link mr-1"></i> /{{ Str::limit($blog->slug, 20) }}
                                    </div>
                                </td>

                                <td class="text-right align-middle">
                                    <div class="text-xs font-weight-bold">
                                        <i class="far fa-eye text-info mr-1"></i> {{ number_format($blog->view_count) }}
                                    </div>
                                    <small class="text-muted" title="Reading Time">
                                        <i class="far fa-clock mr-1"></i> {{ $blog->reading_time ?? '5' }}m
                                    </small>
                                </td>

                                <td class="text-right align-middle">
                                    @if($blog->is_published)
                                        <span class="badge badge-success-light px-3 py-1 text-uppercase" style="font-size: 0.7rem;">
                                            <i class="fas fa-check-circle mr-1"></i> Published
                                        </span>
                                    @else
                                        <span class="badge badge-warning-light px-3 py-1 text-uppercase" style="font-size: 0.7rem;">
                                            <i class="fas fa-clock mr-1"></i> Draft
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.blogs.edit', $blog->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Article">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.blogs.destroy', $blog->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Post"
                                                    onclick="return confirm('Permanently remove this article?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-feather fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Articles Found</h5>
                                        <p class="text-secondary mb-3">Start sharing news and insights with your audience.</p>
                                        <a href="{{ route('admin.blogs.create') }}" class="btn btn-primary btn-sm px-4">
                                            <i class="fas fa-plus mr-1"></i> Create First Post
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            @if($blogs->hasPages())
                <div class="px-4 py-3 border-top">
                    {{ $blogs->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@section('css')
<style>


    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-warning-light { background-color: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
    .font-weight-600 { font-weight: 600 !important; }
    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>

@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        if ($('#blogs-table tbody tr').length > 0 && !$('.empty-state').length) {
            $('#blogs-table').DataTable({
                "paging": false,
                "info": false,
                "searching": true,
                "ordering": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-2"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search...",
                    "lengthMenu": "_MENU_ per page"
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-xs border').css('max-width', '250px');
        }
    });
</script>
@endsection
