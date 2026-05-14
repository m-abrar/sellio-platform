{{--
    Administrative Taxonomy: Tag Registry
    
    This view provides the authoritative command center for managing 
    platform-wide meta tags. It aggregates tag identities, cross-module 
    applicability, and publication status, facilitating efficient 
    auditing and moderation of the platform's granular taxonomy 
    registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $tags Collection of Tag model instances.
--}}
@extends('adminlte::page')

@section('title', __('Tags'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> {{ __('Listing Tags') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage high-level classification labels for quick filtering and discovery.') }}
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.tags.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Tag') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24 datatable-premium-layout">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Listing Tags Catalog') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-hashtag mr-1"></i> {{ count($tags) }} {{ __('TAGS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="tags-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "lengthChange": true, "searching": true, "ordering": true, "info": true, "columnDefs": [{"orderable": false, "targets": [0, 4]}]}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-70">{{ __('Preview') }}</th>
                            <th>{{ __('Tag Details') }}</th>
                            <th>{{ __('Module Applicability') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($tags as $tag)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $tag->thumbnail_url }}" 
                                             alt="{{ $tag->title ?? 'Tag' }}" 
                                             onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $tag->title ?? __('N/A') }}</span>
                                    <small class="text-muted text-monospace smallest-0-75">/{{ $tag->slug }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $tag])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $tag->is_published ? 'badge-success-light text-success' : 'badge-danger-light text-danger' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $tag->is_published ? __('Active') : __('Inactive') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.tags.edit', $tag->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Settings') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-tag-{{ $tag->id }}" action="{{ route('admin.tags.destroy', $tag->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                             <button type="button" class="btn text-danger" 
                                                     data-toggle="tooltip" title="{{ __('Delete Tag') }}"
                                                     data-action="delete-trigger"
                                                     data-confirm-title="{{ __('Delete Tag?') }}"
                                                     data-confirm-text="{{ __('Are you sure you want to delete this tag?') }}">
                                                 <i class="fas fa-trash-alt"></i>
                                             </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 5,
                            'icon' => 'fas fa-tags',
                            'title' => __('No Tags Found'),
                            'description' => request('search') 
                                ? __('No results matching ":search"', ['search' => request('search')]) 
                                : __('Group your items by adding searchable tags.'),
                            'button_text' => request('search') ? __('Clear Search') : __('Add Tag'),
                            'button_link' => request('search') ? route('admin.tags.index') : route('admin.tags.create')
                        ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @include('admin._partials._sweetalert')
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection


@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
