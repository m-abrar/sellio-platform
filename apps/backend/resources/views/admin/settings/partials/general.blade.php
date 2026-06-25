{{--
    Administrative Infrastructure Component: General Identity Registry
    
    This partial orchestrates the foundational site identity and 
    localization settings. It facilitates the management of brand 
    assets (logo/favicon), regional preferences (language/timezone/ 
    currency), and global ecosystem URLs for the platform's 
    distributed architecture.
    
    @extends admin.settings.settings-layout
    @context Infrastructure Management
    @variables Array $settings Collection of key-value system settings.
--}}
@extends('admin.settings.settings-layout')

@section('setting-form-content')
@push('js')
    <script src="{{ asset('admin-assets/pages/settings-general.js') }}"></script>
@endpush

    <form action="{{ route('admin.settings.update.group', ['section' => 'general']) }}" method="POST"
        enctype="multipart/form-data">
        @csrf

        <div class="card border-0 shadow-premium">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-1 float-none d-block small text-uppercase letter-spacing-1">
                    <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> {{ __('Identity & Localization') }}
                </h3>
                <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-0">{{ __('Configure your marketplace name, branding, and regional preferences.') }}</p>
            </div>
            <div class="card-body px-4 pb-4">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('Site Name') }}</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-globe text-primary"></i></span>
                                </div>
                                <input type="text" name="site_name" class="form-control"
                                    value="{{ old('site_name', $settings['site_name'] ?? '') }}">
                            </div>
                            <div class="custom-control custom-checkbox custom-control-premium mt-3">
                                <input type="checkbox" name="hide_site_name" class="custom-control-input" id="hideSiteName"
                                    value="1" {{ (old('hide_site_name', $settings['hide_site_name'] ?? '0') == '1') ? 'checked' : '' }}>
                                <label class="custom-control-label small text-muted font-weight-bold" for="hideSiteName">
                                    {{ __('Hide Company Name text in header (if logo is present)') }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('Site Tagline') }}</label>
                            <input type="text" name="site_tagline" class="form-control rounded-10"
                                value="{{ old('site_tagline', $settings['site_tagline'] ?? '') }}">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-6 text-center border-right border-light">
                        <label class="d-block small font-weight-bold text-uppercase text-secondary mb-3 ls-05">{{ __('Main Brand Logo') }}</label>
                        
                        <div id="logo-dropzone"
                             class="dropzone-wrapper move-pointer mb-3 p-4 rounded-20 border-dashed-light transition-base bg-light">
                            
                            <div id="logo-preview-container" class="preview-container d-flex flex-column align-items-center justify-content-center min-h-140">
                                @if(isset($settings['site_logo']))
                                    <img src="{{ asset('storage/' . $settings['site_logo']) }}" class="img-fluid drop-shadow-sm mb-3 max-h-80" alt="Logo Preview">
                                @else
                                    <div class="text-center py-2">
                                        <div class="icon-circle bg-white shadow-xs mx-auto mb-3 icon-box-60 rounded-circle">
                                            <i class="fas fa-cloud-upload-alt text-primary fa-lg"></i>
                                        </div>
                                        <p class="text-dark font-weight-bold mb-1">{{ __('Upload Platform Logo') }}</p>
                                        <p class="text-muted small mb-0">{{ __('SVG, PNG or JPG (Max 2MB)') }}</p>
                                    </div>
                                @endif

                                <div class="mt-3">
                                    <span class="btn btn-sm btn-white rounded-pill px-4 font-weight-bold shadow-xs border">
                                        <i class="fas fa-search mr-1 text-primary"></i> {{ __('Browse Files') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_logo" id="site-logo-input" class="d-none" accept="image/*">
                        </div>
                    </div>

                    <div class="col-md-6 text-center">
                        <label class="d-block small font-weight-bold text-uppercase text-secondary mb-3 ls-05">{{ __('Browser Favicon') }}</label>
                        
                        <div id="favicon-dropzone"
                             class="dropzone-wrapper move-pointer mb-3 p-4 rounded-20 border-dashed-light transition-base w-180 mx-auto bg-light">
                            
                            <div id="favicon-preview-container" class="preview-container d-flex flex-column align-items-center justify-content-center h-140">
                                @if(isset($settings['site_favicon']))
                                    <img src="{{ asset('storage/' . $settings['site_favicon']) }}" width="56" height="56" class="drop-shadow-sm rounded shadow-xs" alt="Favicon Preview">
                                @else
                                    <div class="text-center">
                                        <div class="icon-circle bg-white shadow-xs mx-auto mb-3 icon-box-50 rounded-circle">
                                            <i class="fas fa-icons text-info"></i>
                                        </div>
                                        <p class="text-dark font-weight-bold mb-1 fs-08">{{ __('Favicon') }}</p>
                                    </div>
                                @endif

                                <div class="mt-3">
                                    <span class="btn btn-xs btn-white rounded-pill px-3 font-weight-bold shadow-xs border">
                                        {{ __('Browse') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_favicon" id="site-favicon-input" class="d-none" accept="image/*">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Default Language') }}</label>
                            <select name="default_language" class="form-control select2 shadow-xs">
                                @foreach(['en' => __('English'), 'fr' => __('French'), 'es' => __('Spanish')] as $code => $label)
                                    <option value="{{ $code }}" {{ (old('default_language', $settings['default_language'] ?? '') == $code) ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Timezone') }}</label>
                            <input type="text" name="timezone" class="form-control"
                                value="{{ old('timezone', $settings['timezone'] ?? 'UTC') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Currency Symbol') }}</label>
                            <input type="text" name="currency_symbol" class="form-control"
                                value="{{ old('currency_symbol', $settings['currency_symbol'] ?? '$') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Currency Code') }}</label>
                            <input type="text" name="currency_code" class="form-control"
                                value="{{ old('currency_code', $settings['currency_code'] ?? 'USD') }}">
                        </div>
                    </div>
                </div>


            </div>
            <div class="card-footer bg-light py-4 px-4 border-0 text-right">
                <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold">
                    <i class="fas fa-save mr-2"></i> {{ __('Save Configuration') }}
                </button>
            </div>
        </div>
    </form>
@endsection