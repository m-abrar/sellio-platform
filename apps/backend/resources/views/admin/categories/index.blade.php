{{--
    Administrative Taxonomy: Category Registry
    
    This view provides the authoritative command center for managing the 
    platform's hierarchical classification system. It aggregates 
    category identities, parent-child relationships, cross-module 
    applicability, and publication status, facilitating efficient 
    auditing and moderation of the multi-dimensional taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $categories Collection of Category model instances.
--}}
@extends('adminlte::page')

@section('title', __('Categories'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-folder-open mr-2 text-primary"></i> {{ __('Market Segments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Organize platform listings into a logical hierarchy and taxonomy.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Category') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Global Taxonomy Registry') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-sitemap mr-1"></i> {{ count($categories) }} {{ __('CATEGORIES FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="categories-table" class="table table-hover table-premium mb-0 datatable-init">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80">{{ __('Icon') }}</th>
                            <th>{{ __('Segment Identity') }}</th>
                            <th>{{ __('Module Applicability Spectrum') }}</th>
                            <th class="text-right">{{ __('Lifecycle') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($categories as $category)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $category->thumbnail_url }}" alt="{{ $category->title }}">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        @if($category->parent_id)
                                            <div class="mr-2 text-primary opacity-50">
                                                <i class="fas fa-level-up-alt fa-rotate-90 fa-sm"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-1-0">
                                                {{ $category->title ?? __('N/A') }}
                                            </span>
                                            <small class="text-muted font-weight-bold uppercase smallest letter-spacing-1">
                                                @if($category->parent)
                                                    <span class="text-primary">{{ strtoupper($category->parent->title) }}</span> 
                                                    <i class="fas fa-chevron-right mx-1 smallest opacity-50"></i>
                                                @endif
                                                /{{ $category->slug }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $category])
                                </td>

                                <td class="text-right align-middle">
                                    @if($category->is_published)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase animate-pulse">{{ __('ACTIVE') }}</span>
                                    @else
                                        <span class="badge badge-danger-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">{{ __('OFFLINE') }}</span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Configuration') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-category-{{ $category->id }}" action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Segment') }}" 
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Taxonomy?') }}"
                                                    data-confirm-text="{{ __('This segment and its associations will be removed.') }}">
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
                            'title' => __('Taxonomy Is Unmapped'),
                            'description' => __('Organize your marketplace items by creating your first segment.'),
                            'button_text' => __('Add Category'),
                            'button_link' => route('admin.categories.create')
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
