{{--
    Administrative Content: Page Registry Manifest
    
    This view provides the authoritative command center for managing the 
    platform's informational assets and static content. It aggregates 
    page identities, URI slugs, and visibility status, facilitating 
    efficient auditing of the informational layer through a 
    responsive data architecture and multi-dimensional filtering.
    
    @extends adminlte::page
    @context Content Management Module
    @variables Collection $pages Collection of Page model instances.
--}}
@extends('adminlte::page')

@section('title', __('Static Pages'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-alt mr-2 text-primary"></i> {{ __('Content & Static Pages') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage system blueprints, informational assets, and footer navigation layers.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.pages.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD PAGE') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Main Table Card --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Static Content Registry') }}</h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                <i class="fas fa-database mr-1"></i> {{ count($pages) }} {{ __('ACTIVE PAGES') }}
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="pages-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "lengthChange": false, "searching": false, "ordering": true, "info": true}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4 w-40-p">{{ __('Title & Identity') }}</th>
                            <th class="w-25-p">{{ __('Permanent Link (Slug)') }}</th>
                            <th class="text-center">{{ __('Visibility') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($pages as $page)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center icon-box-45 rounded-12">
                                            <i class="fas {{ $page->type == 'system' ? 'fa-microchip text-warning' : 'fa-feather-alt text-primary' }}"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-0-95">{{ $page->title }}</span>
                                            <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill font-weight-bold smallest uppercase mt-1">
                                                <i class="fas fa-tag mr-1 text-xs"></i> {{ $page->type }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-muted mb-1 font-weight-bold uppercase letter-spacing-1">{{ __('Segment') }}: <span class="text-primary">{{ $page->slug }}</span></div>
                                    <a href="{{ url($page->slug) }}" target="_blank" class="text-secondary smallest font-weight-bold d-flex align-items-center hover-primary">
                                        <i class="fas fa-external-link-alt mr-2"></i> 
                                        {{ __('Live View') }}
                                    </a>
                                </td>

                                <td class="text-center align-middle">
                                    @if($page->status == 'active')
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-check-circle mr-1"></i> {{ __('PUBLISHED') }}
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-eye-slash mr-1"></i> {{ __('ARCHIVED') }}
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.pages.edit', $page->id) }}" 
                                           class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center" 
                                           data-toggle="tooltip" title="{{ __('Edit Content') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form id="delete-form-{{ $page->id }}" action="{{ route('admin.pages.destroy', $page->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                    data-toggle="tooltip" title="{{ __('Purge Asset') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Page?') }}"
                                                    data-confirm-text="{{ __('This content will be permanently removed from the platform.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 4,
                                'icon' => 'fas fa-file-signature',
                                'title' => __('Content Library Is Empty'),
                                'description' => __('No static pages have been architected yet. Initialize your platform informational assets to populate this registry.'),
                                'button_text' => __('INITIALIZE PAGE'),
                                'button_link' => route('admin.pages.create')
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
