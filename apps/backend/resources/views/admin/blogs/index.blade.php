{{--
    Administrative Content: Article Registry
    
    This view provides the authoritative command center for the editorial 
    desk. It aggregates article information, category associations, 
    view statistics, and publication status, facilitating efficient 
    content auditing and moderation through a responsive data 
    architecture.
    
    @extends adminlte::page
    @context Blog Module Management
    @variables Paginator $blogs Paginated collection of Blog model instances.
--}}
@extends('adminlte::page')

@section('title', 'Blog Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-blog mr-2 text-primary opacity-50"></i> Blog Articles
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Compose and curate editorial content for your marketplace community.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm px-4">
                        <i class="fas fa-arrow-left mr-1"></i> BACK TO DASHBOARD
                    </a>
                    <a href="{{ route('admin.blogs.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                        <i class="fas fa-plus-circle mr-1"></i> WRITE NEW POST
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Main Table Card --}}
    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-feather mr-1 text-primary opacity-50"></i> Article Registry
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-database mr-1"></i> {{ $blogs->total() }} POSTS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="blogs-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4 w-35-p">Article Info</th>
                            <th class="w-20-p">Category & Tags</th>
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
                                        <div class="mr-3 border rounded shadow-xs overflow-hidden icon-box-60-45">
                                            <img src="{{ $blog->thumbnail_url }}" 
                                                 alt="Cover" class="img-fluid w-100 h-100 object-fit-cover">
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
                                    @php $status = $blog->getStatusMeta(); @endphp
                                    <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 text-uppercase smallest-0-7">
                                        <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.blogs.edit', $blog->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Edit Article">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.blogs.destroy', $blog->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Delete Post"
                                                    onclick="return confirm('Permanently remove this article?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-feather',
                                'title' => 'No Articles Found',
                                'description' => 'Start sharing news and insights with your audience by composing your first editorial piece.',
                                'button_text' => 'WRITE FIRST POST',
                                'button_link' => route('admin.blogs.create')
                            ])
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
            $('.dataTables_filter input').addClass('form-control shadow-xs border w-max-250');
        }
    });
</script>
@endsection
