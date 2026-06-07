@extends('adminlte::page')

@section('title', __('Edit Content') . ' | ' . Str::of($item->content_key)->replace('_', ' ')->title())

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-pencil-alt mr-2 text-primary opacity-50"></i>
                    {{ Str::of($item->content_key)->replace('_', ' ')->title() }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ Str::of($item->page)->title() }} / {{ Str::of($item->section)->replace('_', ' ')->title() }}
                    &middot; {{ Str::of($item->theme_key)->replace('_', ' ')->title() }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.content.edit', ['page' => $item->page, 'theme_key' => $item->theme_key]) }}"
                   class="btn btn-light rounded-pill font-weight-bold smallest">
                    <i class="fas fa-layer-group mr-1"></i> {{ __('Full Page Editor') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card card-premium border-0 shadow-premium overflow-hidden">
                <div class="card-header bg-white py-4 px-4 border-0">
                    <h3 class="card-title font-weight-bold text-dark mb-0">
                        {{ __('Content Value') }}
                    </h3>
                </div>
                <div class="card-body p-4">
                    <form method="POST" action="{{ route('admin.content.bulk_update') }}" enctype="multipart/form-data">
                        @csrf
                        <div class="mb-4">
                            <label for="setting-{{ $item->id }}" class="d-block font-weight-bold text-muted small text-uppercase mb-2">
                                {{ Str::of($item->content_key)->replace('_', ' ')->title() }}
                                <span class="text-lowercase">({{ $item->input_type }})</span>
                            </label>
                            @include('admin.content._partials._editor_input_factory', ['item' => $item])
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            <button type="submit" class="btn btn-primary rounded-pill font-weight-bold px-4">
                                <i class="fas fa-save mr-1"></i> {{ __('Save Changes') }}
                            </button>
                            <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('admin.content.edit', ['page' => $item->page, 'theme_key' => $item->theme_key]) }}"
                               class="btn btn-light rounded-pill font-weight-bold px-4">
                                {{ __('Cancel') }}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
