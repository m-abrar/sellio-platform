{{--
    Administrative Marketing Module: Testimonial Configuration

    Creates and edits curated social proof with theme placement
    priority, featured flags, avatar media, and publication status.

    @extends adminlte::page
    @context Marketing Management
    @variables Testimonial $testimonial The testimonial model instance.
    @variables Collection $themes Available storefront themes.
    @variables Collection $assignedThemes Theme assignments keyed by theme id.
--}}
@extends('adminlte::page')

@section('title', ($testimonial->exists ? __('Edit') : __('Add')) . ' ' . __('Testimonial'))

@section('plugins.Select2', true)
@section('plugins.Sweetalert2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-comment-dots mr-2 text-primary opacity-50"></i>
                    {{ $testimonial->exists ? __('Edit Testimonial') : __('Create Testimonial') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $testimonial->exists
                        ? __('Modify social proof content, theme placement, and publication status.')
                        : __('Initialize a new testimonial with theme-specific placement rules.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.testimonials.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left"></i> {{ __('Back to Testimonials') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="testimonial-form"
          action="{{ $testimonial->exists ? route('admin.testimonials.update', $testimonial) : route('admin.testimonials.store') }}"
          method="POST"
          enctype="multipart/form-data">
        @csrf
        @if($testimonial->exists) @method('PATCH') @endif

        <div class="row">
            <div class="col-md-8">
                @include('admin.testimonials.partials._content')
                @include('admin.testimonials.partials._theme-priority')
            </div>

            <div class="col-md-4">
                <div class="sticky-top top-20 z-10">
                    @include('admin.testimonials.partials._sidebar')
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
    @include('admin._partials._sweetalert')
@endsection

@if($testimonial->exists)
    <form id="delete-form" action="{{ route('admin.testimonials.destroy', $testimonial) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
@endif
