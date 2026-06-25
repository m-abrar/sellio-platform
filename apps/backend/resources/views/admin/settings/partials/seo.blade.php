@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'seo']) }}" method="POST">
    @csrf

    {{-- 1. Meta Tags --}}
    <div class="card border-0 shadow-premium mb-4 rounded-24">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-search mr-2 text-primary opacity-50"></i> {{ __('Search Engine Optimization') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Optimize how your marketplace appears in global search results and social shares.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="form-group mb-4">
                <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('Global Meta Title') }}</label>
                <input type="text" name="meta_title" class="form-control" value="{{ old('meta_title', $settings['meta_title'] ?? '') }}" placeholder="{{ __('Primary Title for Search Engines') }}">
                <div class="d-flex justify-content-between mt-2">
                    <small class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1">{{ __('Target Length') }}: 50-60 {{ __('characters') }}</small>
                    <small class="text-primary smallest font-weight-bold">{{ strlen($settings['meta_title'] ?? '') }} {{ __('chars') }}</small>
                </div>
            </div>
            <div class="form-group mb-0">
                <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('Global Meta Description') }}</label>
                <textarea name="meta_description" class="form-control" rows="4" placeholder="{{ __('Brief summary of your platform...') }}">{{ old('meta_description', $settings['meta_description'] ?? '') }}</textarea>
                <div class="d-flex justify-content-between mt-2">
                    <small class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1">{{ __('Target Length') }}: 150-160 {{ __('characters') }}</small>
                    <small class="text-primary smallest font-weight-bold">{{ strlen($settings['meta_description'] ?? '') }} {{ __('chars') }}</small>
                </div>
            </div>
        </div>
    </div>

    {{-- 2. Analytics & Tracking --}}
    <div class="card border-0 shadow-premium mb-4 rounded-24">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-chart-bar mr-2 text-primary opacity-50"></i> {{ __('Analytics & Tracking') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Configure Google Tag Manager and Google Analytics. Use GTM to manage all tracking tags from one place.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">

            <div class="alert alert-info-light border-0 rounded-xl mb-4 small">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>{{ __('Tip') }}:</strong> {{ __('If you configure GTM, add GA4 and other tracking tags inside GTM. The GA4 Measurement ID field below is only used when GTM is not configured.') }}
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-4">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">
                            {{ __('GTM Container ID') }}
                            <span class="badge badge-success ml-1">{{ __('Recommended') }}</span>
                        </label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-tag text-primary"></i></span>
                            </div>
                            <input type="text" name="gtm_container_id" class="form-control"
                                value="{{ old('gtm_container_id', $settings['gtm_container_id'] ?? '') }}"
                                placeholder="GTM-XXXXXXX">
                        </div>
                        <small class="text-muted d-block mt-2">{{ __('Google Tag Manager Container ID. Injects GTM on all frontend and admin pages.') }}</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-4">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('GA4 Measurement ID') }}</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fab fa-google text-primary"></i></span>
                            </div>
                            <input type="text" name="google_analytics" class="form-control"
                                value="{{ old('google_analytics', $settings['google_analytics'] ?? '') }}"
                                placeholder="G-XXXXXXXXXX">
                        </div>
                        <small class="text-muted d-block mt-2">{{ __('Used only when GTM Container ID above is not set.') }}</small>
                    </div>
                </div>
            </div>

            <div class="form-group mb-0">
                <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ __('Google Site Verification') }}</label>
                <div class="input-group shadow-xs">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-check-circle text-primary"></i></span>
                    </div>
                    <input type="text" name="google_verification_code" class="form-control"
                        value="{{ old('google_verification_code', $settings['google_verification_code'] ?? '') }}"
                        placeholder="{{ __('Verification code from Google Search Console') }}">
                </div>
                <small class="text-muted d-block mt-2">{{ __('Injected as a') }} <code>&lt;meta name="google-site-verification"&gt;</code> {{ __('tag in the frontend head.') }}</small>
            </div>
        </div>
    </div>

    {{-- 3. Custom Code --}}
    <div class="card border-0 shadow-premium mb-4 rounded-24">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-code mr-2 text-primary opacity-50"></i> {{ __('Custom Code Injection') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Inject arbitrary HTML/JS/CSS snippets globally. Use with caution — raw code is rendered unescaped.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="alert alert-warning-light border-0 rounded-xl mb-4 small">
                <i class="fas fa-exclamation-triangle mr-2 text-warning"></i>
                {{ __('Code entered here is rendered with') }} <code>{!! !!}</code>. {{ __('Only paste trusted code such as chat widgets, cookie consent scripts, or other third-party snippets.') }}
            </div>
            <div class="form-group mb-4">
                <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">
                    {{ __('Custom Head Code') }}
                    <small class="text-muted normal-weight ml-2">— {{ __('injected before') }} <code>&lt;/head&gt;</code></small>
                </label>
                <textarea name="custom_head_code" class="form-control font-monospace" rows="6"
                    placeholder="{{ __('<!-- e.g. chat widget init, font preloads, additional meta tags -->') }}">{{ old('custom_head_code', $settings['custom_head_code'] ?? '') }}</textarea>
            </div>
            <div class="form-group mb-0">
                <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">
                    {{ __('Custom Footer Code') }}
                    <small class="text-muted normal-weight ml-2">— {{ __('injected before') }} <code>&lt;/body&gt;</code></small>
                </label>
                <textarea name="custom_footer_code" class="form-control font-monospace" rows="6"
                    placeholder="{{ __('<!-- e.g. cookie consent scripts, support chat widgets -->') }}">{{ old('custom_footer_code', $settings['custom_footer_code'] ?? '') }}</textarea>
            </div>
        </div>
    </div>

    <div class="text-right pb-5">
        <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold shadow-premium">
            <i class="fas fa-save mr-2"></i> {{ __('Save SEO Settings') }}
        </button>
    </div>
</form>
@endsection
