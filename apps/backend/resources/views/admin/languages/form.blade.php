{{--
    Administrative Localization Module: Locale Configuration Form
    
    This view facilitates the management of language metadata. It 
    orchestrates the synchronization between database entities and 
    filesystem-based translation JSONs.
--}}
@extends('adminlte::page')

@php
    $isEdit = isset($language);
    $title = $isEdit ? __('Configure Locale') : __('Initialize New Locale');
@endphp

@section('title', $title)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-globe-americas mr-2 text-primary opacity-50"></i> {{ $title }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Define locale identity, ISO codes, and regional display assets.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.languages.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-2"></i> {{ __('Back to Registry') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        <div class="col-lg-8">
            <div class="card card-premium shadow-premium border-0 rounded-24">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Identity & Protocol') }}
                    </h3>
                </div>
                
                <form action="{{ $isEdit ? route('admin.languages.update', $language) : route('admin.languages.store') }}" method="POST">
                    @csrf
                    @if($isEdit) @method('POST') @endif {{-- Note: LanguageController@update is mapped to POST in routes for simplicity or use PUT --}}
                    {{-- Correction: Usually update is PUT/PATCH, but I defined it as POST in routes. Group uses POST for update. --}}
                    
                    <div class="card-body px-4 py-3">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">
                                        {{ __('Display Name') }} <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" name="name" class="form-control form-control-premium @error('name') is-invalid @enderror" 
                                           placeholder="e.g. French, Spanish, Arabic" value="{{ old('name', $language->name ?? '') }}" required>
                                    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">
                                        {{ __('ISO Code') }} <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" name="code" class="form-control form-control-premium @error('code') is-invalid @enderror" 
                                           placeholder="e.g. fr, es, ar" value="{{ old('code', $language->code ?? '') }}" required>
                                    <small class="text-muted smallest mt-1 d-block">{{ __('Used for JSON filename and URL localization.') }}</small>
                                    @error('code') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="smallest text-uppercase font-weight-bold text-muted mb-2 letter-spacing-1">
                                        {{ __('Flag Icon (ISO 3166-1 alpha-2)') }}
                                    </label>
                                    <input type="text" name="flag_icon" class="form-control form-control-premium @error('flag_icon') is-invalid @enderror" 
                                           placeholder="e.g. fr, es, sa" value="{{ old('flag_icon', $language->flag_icon ?? '') }}">
                                    @error('flag_icon') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group mb-4 mt-4">
                                    <div class="custom-control custom-switch custom-switch-premium">
                                        <input type="checkbox" name="is_active" class="custom-control-input" id="isActive" value="1" {{ old('is_active', $language->is_active ?? true) ? 'checked' : '' }}>
                                        <label class="custom-control-label font-weight-bold text-dark" for="isActive">{{ __('Publish Locale') }}</label>
                                    </div>
                                    <p class="text-muted smallest mt-1">{{ __('If disabled, this language will not appear in public selectors.') }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-4">
                            <div class="custom-control custom-switch custom-switch-premium">
                                <input type="checkbox" name="is_default" class="custom-control-input" id="isDefault" value="1" {{ old('is_default', $language->is_default ?? false) ? 'checked' : '' }}>
                                <label class="custom-control-label font-weight-bold text-dark" for="isDefault">{{ __('Set as System Default') }}</label>
                            </div>
                            <p class="text-muted smallest mt-1">{{ __('The fallback language used for all non-localized sessions.') }}</p>
                        </div>
                    </div>

                    <div class="card-footer border-0 bg-light p-4 rounded-b-24 d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 font-weight-bold shadow-premium uppercase letter-spacing-1">
                            <i class="fas fa-save mr-2"></i> {{ $isEdit ? __('COMMIT CHANGES') : __('INITIALIZE LOCALE') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card card-premium shadow-premium border-0 rounded-24 bg-primary text-white overflow-hidden">
                <div class="card-body p-4 position-relative" style="z-index: 1;">
                    <i class="fas fa-magic fa-5x position-absolute" style="top: -10px; right: -10px; opacity: 0.1; transform: rotate(15deg);"></i>
                    <h4 class="font-weight-bold mb-3">{{ __('Pro-Tip') }}</h4>
                    <p class="small opacity-80 mb-4">
                        {{ __('Initializing a new locale will automatically clone the master English dictionary. You can then refine specific translations in the next step.') }}
                    </p>
                    <div class="bg-white-10 p-3 rounded-12 border-white-20">
                        <h6 class="smallest font-weight-bold text-uppercase letter-spacing-1 mb-2">{{ __('Supported Flags') }}</h6>
                        <p class="smallest mb-0 opacity-70">
                            {{ __('We use the Flag Icon CSS library. Use standard 2-letter country codes.') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
