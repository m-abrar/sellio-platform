@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'apis']) }}" method="POST">
    @csrf
    {{-- 1. GOOGLE ECOSYSTEM INTEGRATIONS --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fab fa-google mr-2 text-primary opacity-50"></i> {{ __('Google Ecosystem Integrations') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Configure mapping engines and intelligent tracking protocols.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="row">
                <div class="col-12 mb-4">
                    <div class="form-group">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Google Maps JavaScript API Key') }}</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-map-marked-alt text-primary"></i></span>
                            </div>
                            <input type="text" name="google_map_api_key" class="form-control" placeholder="AIzaSy..." value="{{ old('google_map_api_key', $settings['google_map_api_key'] ?? '') }}">
                        </div>
                    </div>
                </div>
                
                <div class="col-12">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Google Analytics / Tag Manager') }}</label>
                        <textarea name="google_analytics" class="form-control text-monospace small" rows="5" placeholder="<!-- Global site tag (gtag.js) - Google Analytics -->">{{ old('google_analytics', $settings['google_analytics'] ?? '') }}</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- 2. CUSTOM CODE INJECTION --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-terminal mr-2 text-primary opacity-50"></i> {{ __('Custom Script Injection') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Inject custom meta tags, CSS overrides, or JavaScript snippets into the platform.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Header Scripts') }} (&lt;head&gt;)</label>
                        <textarea name="custom_head_code" class="form-control text-monospace small" rows="8" placeholder="<meta name='verification' content='...'>">{{ old('custom_head_code', $settings['custom_head_code'] ?? '') }}</textarea>
                        <small class="text-muted smallest mt-2 d-block font-weight-bold text-uppercase letter-spacing-1">{{ __('Injected before') }} &lt;/head&gt;</small>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Footer Scripts') }} (&lt;/body&gt;)</label>
                        <textarea name="custom_footer_code" class="form-control text-monospace small" rows="8" placeholder="<!-- Chat Widgets / Hotjar / Pixel -->">{{ old('custom_footer_code', $settings['custom_footer_code'] ?? '') }}</textarea>
                        <small class="text-muted smallest mt-2 d-block font-weight-bold text-uppercase letter-spacing-1">{{ __('Injected before') }} &lt;/body&gt;</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-right pb-5">
        <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold shadow-premium">
            <i class="fas fa-save mr-2"></i> {{ __('Save System Integrations') }}
        </button>
    </div>
</form>
@endsection
