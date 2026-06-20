{{--
    Administrative Localization Module: Global Language Registry
    
    This view serves as the authoritative Dashboard for platform 
    localization. It orchestrates multi-language support, allowing admins 
    to manage locales, toggle visibility, and deep-link into translation 
    JSON management.
--}}
@extends('adminlte::page')

@section('title', __('Languages'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-language mr-2 text-primary opacity-50"></i> {{ __('Localization Management') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage platform locales, dynamic translations, and regional display settings.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.languages.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD LANGUAGE') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-atlas mr-2 text-primary opacity-50"></i> {{ __('Active Locales') }}
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-globe mr-1"></i> {{ $languages->count() }} {{ __('LANGUAGES') }}
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">{{ __('Locale & Identification') }}</th>
                            <th>{{ __('ISO Code') }}</th>
                            <th class="text-center">{{ __('Default') }}</th>
                            <th class="text-center">{{ __('State') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($languages as $lang)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="mr-3 bg-light border rounded-circle overflow-hidden shadow-xs icon-box-40 d-flex align-items-center justify-content-center">
                                            @if($lang->flag_icon)
                                                <i class="flag-icon flag-icon-{{ $lang->flag_icon }}"></i>
                                            @else
                                                <i class="fas fa-flag text-muted opacity-50"></i>
                                            @endif
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">
                                                {{ $lang->name }}
                                            </span>
                                            <small class="text-muted text-uppercase font-weight-bold smallest ls-0-5">
                                                ID: #{{ $lang->id }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <code class="px-3 py-1 bg-light rounded text-primary font-weight-bold">{{ strtoupper($lang->code) }}</code>
                                </td>

                                <td class="text-center align-middle">
                                    @if($lang->is_default)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                            <i class="fas fa-check-circle mr-1"></i> {{ __('DEFAULT') }}
                                        </span>
                                    @else
                                        <span class="text-muted smallest font-weight-bold uppercase opacity-50">—</span>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @if($lang->is_active)
                                        <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                            {{ __('ACTIVE') }}
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                            {{ __('INACTIVE') }}
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.languages.translations', $lang) }}" 
                                           class="btn btn-white text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="{{ __('Edit Translations') }}">
                                            <i class="fas fa-language"></i>
                                        </a>

                                        <a href="{{ route('admin.languages.edit', $lang) }}" 
                                           class="btn btn-white text-primary py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="{{ __('Settings') }}">
                                            <i class="fas fa-cog"></i>
                                        </a>

                                        @if(!$lang->is_default)
                                            <form id="delete-lang-{{ $lang->id }}" action="{{ route('admin.languages.destroy', $lang) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn btn-white text-danger py-2 px-3"
                                                        data-toggle="tooltip" title="{{ __('Delete Language') }}"
                                                        data-action="delete-trigger"
                                                        data-form-id="delete-lang-{{ $lang->id }}"
                                                        data-confirm-title="{{ __('Delete Language?') }}"
                                                        data-confirm-text="{{ __('Permanently remove this language and all translations?') }}">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-language',
                                'title' => __('No Locales Found'),
                                'description' => __('The system is currently running on hardcoded defaults. Add your first language to begin dynamic localization.'),
                                'button_text' => __('ADD FIRST LANGUAGE'),
                                'button_link' => route('admin.languages.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('vendor/npm/flag-icon-css/flag-icons.min.css') }}">
@stop

@section('js')
    <script>
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@stop
