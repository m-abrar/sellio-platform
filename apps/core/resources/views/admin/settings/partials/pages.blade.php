@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'pages']) }}" method="POST" enctype="multipart/form-data">
    @csrf

    {{-- 1. GENERAL CORE PAGES --}}
    <div class="card shadow-sm border-0 mb-4 overflow-hidden">
        <div class="card-header bg-white py-3">
            <h5 class="mb-0 font-weight-bold text-dark">
                <i class="fas fa-globe-americas mr-2 text-primary"></i>Core Navigation Pages
            </h5>
        </div>
        <div class="card-body bg-light-gray p-4">
            <div class="row">
                {{-- Home/Front Page Theme --}}
                <div class="col-md-4 mb-4">
                    <div class="form-group mb-0 p-3 bg-white rounded shadow-xs border">
                        <label for="site_home" class="font-weight-bold small text-uppercase text-muted d-block mb-2">
                            Home/Front Page <span class="text-primary">Theme</span>
                        </label>
                        <select name="site_home" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Default Theme --</option>
                            @foreach($themes['all'] as $theme)
                                <option value="{{ $theme->theme_key }}" {{ old('site_home', $settings['site_home'] ?? '') == $theme->theme_key ? 'selected' : '' }}>
                                    {{ $theme->title }}
                                </option>
                            @endforeach
                        </select>
                        <div class="mt-2 small text-muted italic">
                            <i class="fas fa-info-circle mr-1"></i> Activates the theme globally for the landing page.
                        </div>
                        @error('site_home')
                            <span class="text-danger small">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                {{-- Blog Archive --}}
                <div class="col-md-4 mb-4">
                    <div class="form-group mb-0 p-3 bg-white rounded shadow-xs border">
                        <label for="site_blog_archive" class="font-weight-bold small text-uppercase text-muted d-block mb-2">Blog Archive</label>
                        <select name="site_blog_archive" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Default Page --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_blog_archive', $settings['site_blog_archive'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                {{-- Contact Page --}}
                <div class="col-md-4 mb-4">
                    <div class="form-group mb-0 p-3 bg-white rounded shadow-xs border">
                        <label for="site_contact" class="font-weight-bold small text-uppercase text-muted d-block mb-2">Contact Page</label>
                        <select name="site_contact" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Select Page --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_contact', $settings['site_contact'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                {{-- About Page --}}
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="form-group mb-0 p-3 bg-white rounded shadow-xs border">
                        <label for="site_about" class="font-weight-bold small text-uppercase text-muted d-block mb-2">About Page</label>
                        <select name="site_about" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Select Page --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_about', $settings['site_about'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                {{-- FAQs Page --}}
                <div class="col-md-4">
                    <div class="form-group mb-0 p-3 bg-white rounded shadow-xs border">
                        <label for="site_faqs" class="font-weight-bold small text-uppercase text-muted d-block mb-2">FAQs Page</label>
                        <select name="site_faqs" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Select Page --</option>
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

    {{-- 2. THEMES TO SEGMENTS --}}
    <div class="card shadow-sm border-0 mb-4 overflow-hidden">
        <div class="card-header bg-white py-3">
            <h5 class="mb-0 font-weight-bold text-dark">
                <i class="fas fa-palette mr-2 text-info"></i>Themes to Segments
            </h5>
        </div>
        <div class="card-body bg-light-gray p-4">
            {{-- Segment Grid --}}
            <div class="row">
                @php
                    $themeSegments = [
                        ['id' => 'theme_unifieds', 'label' => 'Unified Listings', 'key' => 'unifieds', 'icon' => 'fas fa-layer-group', 'color' => 'text-primary'],
                        ['id' => 'theme_properties', 'label' => 'Property Listings', 'key' => 'properties', 'icon' => 'fas fa-home', 'color' => 'text-success'],
                        ['id' => 'theme_autos', 'label' => 'Auto Listings', 'key' => 'autos', 'icon' => 'fas fa-car', 'color' => 'text-warning'],
                        ['id' => 'theme_events', 'label' => 'Event Listings', 'key' => 'events', 'icon' => 'fas fa-calendar-alt', 'color' => 'text-danger'],
                        ['id' => 'theme_jobs', 'label' => 'Job Listings', 'key' => 'jobs', 'icon' => 'fas fa-briefcase', 'color' => 'text-info'],
                        ['id' => 'theme_services', 'label' => 'Service Listings', 'key' => 'services', 'icon' => 'fas fa-tools', 'color' => 'text-secondary'],
                        ['id' => 'theme_classifieds', 'label' => 'Classifieds Theme', 'key' => 'classifieds', 'icon' => 'fas fa-tags', 'color' => 'text-dark'],
                    ];
                @endphp

                @foreach($themeSegments as $segment)
                <div class="col-md-4 mb-4">
                    <div class="card border-0 shadow-xs h-100">
                        <div class="card-body p-3">
                            <label for="{{ $segment['id'] }}" class="font-weight-bold small text-muted">
                                <i class="{{ $segment['icon'] }} {{ $segment['color'] }} mr-1"></i> {{ $segment['label'] }}
                            </label>
                            <select name="{{ $segment['id'] }}" class="form-control border-light-gray mt-1">
                                <option value="">-- Default Theme --</option>
                                @foreach($themes[$segment['key']] as $theme)
                                    <option value="{{ $theme->theme_key }}" {{ old($segment['id'], $settings[$segment['id']] ?? '') == $theme->theme_key ? 'selected' : '' }}>
                                        {{ $theme->title }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- 3. LEGAL PAGES --}}
    <div class="card shadow-sm border-0 mb-4 overflow-hidden">
        <div class="card-header bg-white py-3">
            <h5 class="mb-0 font-weight-bold text-dark">
                <i class="fas fa-balance-scale mr-2 text-secondary"></i>Legal Compliance Pages
            </h5>
        </div>
        <div class="card-body bg-light-gray p-4">
            <div class="row">
                {{-- Terms & Conditions --}}
                <div class="col-md-6 mb-3 mb-md-0">
                    <div class="p-3 bg-white rounded shadow-xs border">
                        <label for="site_terms" class="font-weight-bold small text-uppercase text-muted d-block mb-2">Terms & Conditions</label>
                        <select name="site_terms" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Select Page --</option>
                            @foreach($pages as $page)
                                <option value="{{ $page->id }}" {{ old('site_terms', $settings['site_terms'] ?? '') == $page->id ? 'selected' : '' }}>
                                    {{ $page->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                {{-- Privacy Policy --}}
                <div class="col-md-6">
                    <div class="p-3 bg-white rounded shadow-xs border">
                        <label for="site_privacy" class="font-weight-bold small text-uppercase text-muted d-block mb-2">Privacy Policy</label>
                        <select name="site_privacy" class="form-control custom-select border-0 bg-light">
                            <option value="">-- Select Page --</option>
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

    {{-- SAVE BUTTON --}}
    <div class="text-right pb-5">
        <button type="submit" class="btn btn-primary btn-lg px-5 rounded-pill shadow font-weight-bold">
            <i class="fas fa-save mr-2"></i> Save Page Settings
        </button>
    </div>
</form>

{{-- Minimal Inline Styles for this View --}}
<style>
    .bg-light-gray { background-color: #f4f7f6 !important; }
    .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .border-light-gray { border-color: #e9ecef !important; }
    .italic { font-style: italic; }
    .custom-select:focus { box-shadow: none; border-color: transparent; }
</style>
@endsection
