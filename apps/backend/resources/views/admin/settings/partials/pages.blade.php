@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'pages']) }}" method="POST" enctype="multipart/form-data">
    @csrf

    {{-- 1. CORE NAVIGATION PAGES --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-compass mr-2 text-primary opacity-50"></i> {{ __('Core Navigation Pages') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Bind primary platform touchpoints to specific CMS content pages.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="form-group">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Home/Front Theme') }}</label>
                        <select name="site_home" class="form-control select2">
                            <option value="">-- {{ __('Default Theme') }} --</option>
                            @foreach($themes['all'] as $theme)
                                <option value="{{ $theme->theme_key }}" {{ old('site_home', $settings['site_home'] ?? '') == $theme->theme_key ? 'selected' : '' }}>
                                    {{ $theme->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="form-group">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Blog Archive') }}</label>
                        <select name="site_blog_archive" class="form-control select2">
                            <option value="">-- {{ __('Default Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_blog_archive', $settings['site_blog_archive'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="form-group">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Contact Page') }}</label>
                        <select name="site_contact" class="form-control select2">
                            <option value="">-- {{ __('Select Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_contact', $settings['site_contact'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('About Platform') }}</label>
                        <select name="site_about" class="form-control select2">
                            <option value="">-- {{ __('Select Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_about', $settings['site_about'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('FAQs Center') }}</label>
                        <select name="site_faqs" class="form-control select2">
                            <option value="">-- {{ __('Select Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_faqs', $settings['site_faqs'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- 2. SEGMENT ENGINE THEMES --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-palette mr-2 text-primary opacity-50"></i> {{ __('Segment Engine Themes') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Assign specific design languages and skins to individual marketplace segments.') }}</p>
        </div>
        <div class="card-body px-4 pb-2">
            <div class="row">
                @php
                    $themeSegments = [
                        ['id' => 'theme_unifieds', 'label' => __('Unified Listings'), 'key' => 'unifieds', 'icon' => 'fas fa-layer-group', 'color' => 'text-primary'],
                        ['id' => 'theme_properties', 'label' => __('Property Listings'), 'key' => 'properties', 'icon' => 'fas fa-home', 'color' => 'text-success'],
                        ['id' => 'theme_autos', 'label' => __('Auto Listings'), 'key' => 'autos', 'icon' => 'fas fa-car', 'color' => 'text-warning'],
                        ['id' => 'theme_events', 'label' => __('Event Listings'), 'key' => 'events', 'icon' => 'fas fa-calendar-alt', 'color' => 'text-danger'],
                        ['id' => 'theme_jobs', 'label' => __('Job Listings'), 'key' => 'jobs', 'icon' => 'fas fa-briefcase', 'color' => 'text-info'],
                        ['id' => 'theme_services', 'label' => __('Service Listings'), 'key' => 'services', 'icon' => 'fas fa-tools', 'color' => 'text-secondary'],
                        ['id' => 'theme_classifieds', 'label' => __('Classifieds Theme'), 'key' => 'classifieds', 'icon' => 'fas fa-tags', 'color' => 'text-dark'],
                    ];
                @endphp

                @foreach($themeSegments as $segment)
                <div class="col-md-4 mb-4">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-secondary mb-2 d-flex align-items-center">
                            <i class="{{ $segment['icon'] }} {{ $segment['color'] }} mr-2 opacity-75"></i> 
                            {{ $segment['label'] }}
                        </label>
                        <select name="{{ $segment['id'] }}" class="form-control select2">
                            <option value="">-- {{ __('Default Theme') }} --</option>
                            @foreach($themes[$segment['key']] as $theme)
                                <option value="{{ $theme->theme_key }}" {{ old($segment['id'], $settings[$segment['id']] ?? '') == $theme->theme_key ? 'selected' : '' }}>
                                    {{ $theme->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- 3. LEGAL COMPLIANCE MAPPING --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-balance-scale mr-2 text-primary opacity-50"></i> {{ __('Legal Compliance Mapping') }}
            </h5>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Ensure mandatory regulatory and agreement pages are correctly routed.') }}</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Terms & Conditions Page') }}</label>
                        <select name="site_terms" class="form-control select2">
                            <option value="">-- {{ __('Select Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_terms', $settings['site_terms'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Privacy Policy Page') }}</label>
                        <select name="site_privacy" class="form-control select2">
                            <option value="">-- {{ __('Select Page') }} --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_privacy', $settings['site_privacy'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-right pb-5">
        <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold shadow-premium">
            <i class="fas fa-save mr-2"></i> {{ __('Save Configuration') }}
        </button>
    </div>
@endsection
