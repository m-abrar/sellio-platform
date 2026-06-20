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

                @php
                    $platformUrlFields = app(\App\Services\Admin\PlatformUrlVerificationService::class)->getFieldsMetadata($settings);
                    $unconfiguredPlatformUrls = collect($platformUrlFields)->filter(fn ($field) => $field['status'] !== 'connected')->count();
                @endphp

                <div class="row mt-4 pt-4 border-top" id="platform-url-settings"
                    data-verify-url="{{ route('admin.settings.verify.platform-url') }}">
                    <div class="col-md-12 mb-3">
                        <h5 class="font-weight-bold text-dark text-uppercase small ls-1"><i class="fas fa-link mr-2 text-primary"></i>
                            {{ __('Platform URLs') }}</h5>
                        <p class="text-muted small mb-3">
                            {{ __('Enter the real absolute URLs for your storefront, admin panel, partner portal, and customer app. Test each URL before saving so Sellio can confirm the path exists.') }}
                        </p>

                        @if ($unconfiguredPlatformUrls > 0)
                            <div class="alert alert-warning-light border-0 shadow-xs rounded-xl mb-0">
                                <div class="d-flex align-items-start">
                                    <i class="fas fa-exclamation-triangle text-warning mt-1 mr-3"></i>
                                    <div class="small">
                                        <strong class="text-dark d-block mb-1">{{ __('Action required after installation') }}</strong>
                                        <span class="text-secondary">
                                            {{ __('These URLs are intentionally left blank during setup. Replace any demo or placeholder values with your own domains, click Test connection for each field, then save once every URL shows Connected.') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>

                    @foreach ($platformUrlFields as $fieldKey => $fieldMeta)
                        <div class="col-md-6">
                            <div class="form-group platform-url-field" data-field="{{ $fieldKey }}">
                                <label class="small font-weight-bold text-secondary d-flex align-items-center justify-content-between">
                                    <span>{{ $fieldMeta['label'] }}</span>
                                    <span class="platform-url-status badge badge-{{ $fieldMeta['status'] === 'connected' ? 'success' : ($fieldMeta['status'] === 'empty' ? 'secondary' : 'warning') }} font-weight-bold"
                                        data-status="{{ $fieldMeta['status'] }}">
                                        @if ($fieldMeta['status'] === 'connected')
                                            <i class="fas fa-check-circle mr-1"></i> {{ __('Connected') }}
                                        @elseif ($fieldMeta['status'] === 'empty')
                                            <i class="fas fa-circle mr-1"></i> {{ __('Not configured') }}
                                        @else
                                            <i class="fas fa-exclamation-circle mr-1"></i> {{ __('Not verified') }}
                                        @endif
                                    </span>
                                </label>
                                <div class="input-group shadow-xs">
                                    <input type="url"
                                        name="{{ $fieldKey }}"
                                        class="form-control platform-url-input"
                                        placeholder="{{ $fieldMeta['placeholder'] }}"
                                        value="{{ old($fieldKey, $fieldMeta['value']) }}"
                                        data-verified-value="{{ $settings[$fieldKey . '_verified_url'] ?? '' }}">
                                    <div class="input-group-append">
                                        <button type="button"
                                            class="btn btn-outline-primary btn-verify-platform-url font-weight-bold"
                                            data-field="{{ $fieldKey }}">
                                            <i class="fas fa-plug mr-1"></i> {{ __('Test') }}
                                        </button>
                                    </div>
                                </div>
                                <small class="platform-url-feedback text-muted d-block mt-2">
                                    {{ $fieldMeta['status_message'] }}
                                </small>
                            </div>
                        </div>
                    @endforeach
                </div>

                @php
                    $corsOrigins = app(\App\Services\CorsOriginResolver::class)->resolve();
                @endphp

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-12 mb-3">
                        <h5 class="font-weight-bold text-dark text-uppercase small ls-1">
                            <i class="fas fa-shield-alt mr-2 text-primary"></i> {{ __('API CORS Origins') }}
                        </h5>
                        <p class="text-muted small mb-0">
                            {{ __('Browser requests from your Storefront (Next.js), Partner Portal (seller), and Customer App (buyer) URLs above are automatically allowed to call the Laravel API. Add extra origins below for staging hosts or custom domains.') }}
                        </p>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-secondary">{{ __('Additional CORS Origins') }}</label>
                            <textarea name="cors_allowed_origins" rows="4" class="form-control"
                                placeholder="https://staging.example.com&#10;https://preview.example.com">{{ old('cors_allowed_origins', $settings['cors_allowed_origins'] ?? '') }}</textarea>
                            <small class="text-muted d-block mt-2">
                                {{ __('One origin per line or comma-separated. Paths are ignored — only the domain is used.') }}
                            </small>
                        </div>
                    </div>
                    @if (!empty($corsOrigins))
                        <div class="col-md-12 mt-3">
                            <div class="bg-light p-3 rounded-xl border">
                                <p class="small font-weight-bold text-secondary text-uppercase mb-2 ls-05">
                                    {{ __('Active CORS Origins') }}
                                </p>
                                <ul class="mb-0 pl-3 small text-dark">
                                    @foreach ($corsOrigins as $origin)
                                        <li><code>{{ $origin }}</code></li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    @endif
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-12 mb-3">
                        <div class="form-group">
                            <label class="small font-weight-bold d-block mb-1 text-uppercase text-secondary ls-05">{{ __('Built-in Website Accessibility') }}</label>
                            <p class="text-muted small mb-3">
                                {{ __('Determine if visitors can access the standard Laravel storefront pages.') }}
                            </p>
                            <select name="built_in_website_status" class="form-control select2 shadow-xs">
                                <option value="active" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'active') ? 'selected' : '' }}>
                                    {{ __('Full Access (Standard Laravel Front)') }}
                                </option>
                                <option value="redirect" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'redirect') ? 'selected' : '' }}>
                                    {{ __('Intelligent Redirect (Sends Users to their Portals)') }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="col-md-12 mt-2">
                        <div class="bg-light p-3 rounded-xl border">
                            <div class="custom-control custom-switch">
                                <input type="hidden" name="frontend_edit" value="0">
                                <input type="checkbox" name="frontend_edit" class="custom-control-input" id="frontendEdit"
                                    value="1" {{ (old('frontend_edit', $settings['frontend_edit'] ?? '0') == '1') ? 'checked' : '' }}>
                                <label class="custom-control-label font-weight-bold text-dark" for="frontendEdit">
                                    {{ __('Enable In-Context Frontend Editing') }}
                                </label>
                                <p class="text-muted small mb-0 mt-1">
                                    {{ __('Allows super-admins to modify page content directly from the public storefront while logged in.') }}
                                </p>
                            </div>
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