{{--
    Administrative Marketing Module: All Reviews

    Curates storefront social proof with theme-specific placement
    priority, featured flags, and publication lifecycle controls.

    @extends adminlte::page
    @context Marketing Management
    @variables Paginator $testimonials Paginated collection of Testimonial models.
    @variables Collection $themes Available storefront themes for scope filtering.
--}}
@extends('adminlte::page')

@section('title', __('Testimonials'))

@section('plugins.Select2', true)
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-comment-dots mr-2 text-primary opacity-50"></i> {{ __('Testimonials') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Curated social proof with theme-specific placement priority.') }}
                </p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end gap-12">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                </a>
                <a href="{{ route('admin.testimonials.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('ADD TESTIMONIAL') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    @include('admin.testimonials._filter')

    <div class="card registry-table-card border-0 shadow-premium" style="border-radius: 24px; overflow: hidden;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">
                <i class="fas fa-database mr-2 text-primary opacity-50"></i> {{ __('All Reviews') }}
            </h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2 shadow-xs">
                    <i class="fas fa-comment-dots mr-1"></i> {{ $testimonials->total() }} {{ __('RECORDS') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="testimonials-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "ordering": true, "columnDefs": [{"orderable": false, "targets": [4]}], "dom": "tr"}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">{{ __('Author') }}</th>
                            <th>{{ __('Quote') }}</th>
                            <th>{{ __('Theme Scope') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Operations') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($testimonials as $testimonial)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="table-img-preview shadow-xs rounded-circle overflow-hidden border-0 mr-3" style="width: 48px; height: 48px;">
                                            <img src="{{ $testimonial->avatar_url }}" alt="{{ $testimonial->author_name }}" class="w-100 h-100 object-fit-cover">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $testimonial->author_name }}</span>
                                            <small class="text-muted">
                                                {{ $testimonial->author_title ?: __('No title') }}{{ $testimonial->company ? ' · ' . $testimonial->company : '' }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle text-muted">{{ Str::limit($testimonial->quote, 90) }}</td>
                                <td class="align-middle">
                                    @if($testimonial->themes->isEmpty())
                                        <span class="badge badge-secondary-light text-secondary px-2 py-1 rounded-pill">{{ __('Global') }}</span>
                                    @else
                                        @foreach($testimonial->themes as $theme)
                                            <span class="badge badge-primary-light text-primary px-2 py-1 mb-1 rounded-pill font-weight-bold smallest">
                                                {{ $theme->theme_key }} · #{{ $theme->pivot->priority }}
                                                @if($theme->pivot->is_featured) · {{ __('Featured') }} @endif
                                            </span>
                                        @endforeach
                                    @endif
                                </td>
                                <td class="text-center align-middle">
                                    @php
                                        $colors = ['draft' => 'secondary', 'published' => 'success', 'archived' => 'dark'];
                                    @endphp
                                    <span class="badge badge-{{ $colors[$testimonial->status] ?? 'secondary' }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ Str::headline($testimonial->status) }}
                                    </span>
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.testimonials.edit', $testimonial) }}"
                                           class="btn text-info"
                                           data-toggle="tooltip"
                                           title="{{ __('Edit Testimonial') }}">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <form id="delete-testimonial-{{ $testimonial->id }}" action="{{ route('admin.testimonials.destroy', $testimonial) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button"
                                                    class="btn text-danger"
                                                    data-toggle="tooltip"
                                                    title="{{ __('Archive Testimonial') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Archive Testimonial?') }}"
                                                    data-confirm-text="{{ __('This testimonial will be removed from all storefront theme placements.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-comment-dots',
                                'title' => __('No Testimonials Found'),
                                'description' => __('Create curated social proof for your storefront themes.'),
                                'button_text' => __('ADD FIRST TESTIMONIAL'),
                                'button_link' => route('admin.testimonials.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($testimonials->total() > 0)
            <div class="card-footer bg-white border-top py-4 px-4">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div class="small text-muted font-weight-bold uppercase letter-spacing-1 mb-3 mb-md-0">
                        <i class="fas fa-list-ol mr-2 text-primary opacity-50"></i>
                        {{ __('Showing :first - :last of :total testimonials', [
                            'first' => $testimonials->firstItem(),
                            'last' => $testimonials->lastItem(),
                            'total' => $testimonials->total(),
                        ]) }}
                    </div>
                    <div class="pagination-premium">
                        {{ $testimonials->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
