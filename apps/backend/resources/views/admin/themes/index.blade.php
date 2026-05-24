{{--
    Administrative Aesthetic Module: Global Theme Architecture
    
    This view serves as the primary orchestration layer for the platform's 
    visual identities. It facilitates the discovery, configuration, and 
    deployment of vertical-specific skins (liquid templates) while 
    maintaining a historical registry of recently utilized storefront 
    architectures.
    
    @extends adminlte::page
    @context Aesthetic Management
    @variables Theme|null $activeTheme The currently live theme instance.
    @variables Collection $recentThemes Collection of recently activated themes.
    @variables Collection $themesByVertical Grouped collection of available themes.
--}}
@extends('adminlte::page')

@section('title', __('Theme Manager'))

@section('css')
<style>
    .rounded-24 { border-radius: 24px !important; }
    .rounded-20 { border-radius: 20px !important; }
    .rounded-16 { border-radius: 16px !important; }
    .shadow-premium { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important; }
    .shadow-premium-lg { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08) !important; }
    
    .theme-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .theme-card:hover, .theme-card-sm:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
    }
    
    .theme-thumbnail-container {
        position: relative;
        background: #f8f9fa;
    }
    
    .theme-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(30, 77, 78, 0.85); /* Use primary color with alpha */
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        z-index: 10;
    }
    
    .theme-card:hover .theme-overlay, 
    .theme-card-sm:hover .theme-overlay {
        opacity: 1;
        visibility: visible;
    }

    .h-140-p { height: 140px; }
    .h-180-p { height: 180px; }
    .object-fit-cover { object-fit: cover; }
    
    .vertical-theme-nav .nav-link {
        color: #4a5568;
        padding: 12px 20px;
        border-radius: 12px;
        transition: all 0.2s ease;
    }
    .vertical-theme-nav .nav-link.active {
        background: #fff !important;
        color: #1e4d4e !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
    }
    
    .gap-15 { gap: 15px; }
    .gap-10 { gap: 10px; }
    .gap-5 { gap: 5px; }
    
    .btn-xs {
        padding: 0.125rem 0.5rem;
        font-size: 0.75rem;
        line-height: 1.5;
        border-radius: 0.2rem;
    }

    .btn-preview-premium {
        background: #1e4d4e;
        color: white !important;
        border: none;
        transition: all 0.2s ease;
    }
    .btn-preview-premium:hover {
        background: #2a6b6c;
        transform: scale(1.05);
    }

    .btn-settings-premium {
        background: #edf2f7;
        color: #2d3748 !important;
        border: none;
        transition: all 0.2s ease;
    }
    .btn-settings-premium:hover {
        background: #e2e8f0;
        transform: scale(1.05);
    }
</style>
@endsection

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-palette mr-2 text-primary opacity-50"></i> {{ __('Theme Customization Engine') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage storefront identities and vertical-specific visual architectures.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Theme Engine Greeting --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden rounded-24">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-indigo-light d-flex align-items-center justify-content-center shadow-premium-lg icon-box-100 rounded-20">
                    <i class="fas fa-magic text-indigo fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">{{ __('Visual Identity Engine') }}</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">{{ __('Manage vertical-specific storefront architectures, liquid templates, and multi-tenant skins.') }}</p>
                </div>
            </div>
        </div>
    </div>

    {{-- SECTION 1: ACTIVE THEME --}}
    @if($activeTheme)
    <div class="mb-5">
        <div class="section-title-modern mb-3">
            <span class="badge badge-primary-light text-primary px-3 py-2 mb-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">{{ __('CURRENTLY ACTIVE') }}</span>
            <h5 class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1">{{ __('Active Storefront Identity') }}</h5>
        </div>
        <div class="card card-premium active-theme-hero overflow-hidden border-0 shadow-premium rounded-24">
            <div class="row no-gutters">
                <div class="col-md-5">
                    <div class="position-relative h-100 bg-light">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="img-fluid h-100 w-100 object-fit-cover" alt="{{ $activeTheme->title }}">
                        <div class="active-status-overlay">
                            <i class="fas fa-check-circle mr-1"></i> {{ __('LIVE NOW') }}
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card-body p-5 d-flex flex-column h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 class="font-weight-bold text-dark mb-1 h3">{{ $activeTheme->title }}</h2>
                                <span class="badge badge-primary-light text-primary px-3 py-1 text-uppercase smallest font-weight-bold rounded-pill">
                                    <i class="fas fa-layer-group mr-1 opacity-50"></i> {{ __($activeTheme->vertical ?: 'Unified / General') }}
                                </span>
                            </div>
                            <code class="bg-dark text-white px-3 py-1 rounded-pill smallest font-weight-bold shadow-sm">{{ $activeTheme->theme_key }}</code>
                        </div>
                        
                        <p class="text-muted flex-grow-1 font-1-1 leading-1-7">
                            {{ $activeTheme->description ?: __('This theme is driving your storefront. It utilizes a unified layout system with specialized components for all business operations.') }}
                        </p>

                        <div class="mt-4 pt-4 border-top d-flex align-items-center gap-15">
                            <a href="{{ config('app.storefront_url') }}" target="_blank" class="btn btn-primary px-4 rounded-pill font-weight-bold shadow-premium smallest">
                                <i class="fas fa-external-link-alt mr-2"></i> {{ __('View Site') }}
                            </a>
                            <a href="{{ route('admin.themes.edit', $activeTheme->id) }}" class="btn btn-default shadow-xs border px-4 rounded-pill font-weight-bold smallest">
                                <i class="fas fa-cog mr-2"></i> {{ __('Theme Settings') }}
                            </a>
                            <a href="{{ route('admin.content.edit', ['page' => 'home', 'theme_key' => $activeTheme->theme_key]) }}" class="btn btn-default shadow-xs border px-4 rounded-pill font-weight-bold smallest">
                                <i class="fas fa-edit mr-2"></i> {{ __('Customize Content') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif

    {{-- SECTION 2: RECENTLY USED --}}
    @if($recentThemes->count() > 0)
    <div class="mb-5">
        <div class="section-title-modern mb-3">
            <h5 class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1"><i class="fas fa-history mr-2 text-primary opacity-50"></i> {{ __('Recently Used') }}</h5>
        </div>
        <div class="row">
            @foreach($recentThemes as $theme)
            <div class="col-md-3">
                <div class="card theme-card-sm shadow-premium border-0 overflow-hidden rounded-16">
                    <div class="position-relative">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top h-140-p object-fit-cover" alt="{{ $theme->title }}">
                        @include('admin.themes.partials._overlay')
                    </div>
                    <div class="card-body p-3 text-center bg-white border-top">
                        <h6 class="font-weight-bold mb-1 text-dark text-truncate">{{ $theme->title }}</h6>
                        <small class="text-muted smallest uppercase font-weight-bold opacity-75">{{ __('Used') }} {{ $theme->last_activated_at->diffForHumans() }}</small>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    {{-- SECTION 3: BROWSE BY VERTICAL --}}
    <div class="mb-5">
        <div class="card card-premium overflow-hidden border-0 shadow-premium rounded-24">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> {{ __('Global Theme Library Explorer') }}
                </h5>
                <div class="card-tools ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase shadow-xs">
                        <i class="fas fa-palette mr-1"></i> {{ $themesByVertical->flatten()->count() }} {{ __('TOTAL SKINS') }}
                    </span>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="row no-gutters">
                    <div class="col-md-3 border-right bg-light-soft">
                        <div class="nav flex-column nav-pills vertical-theme-nav p-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            @php $first = true; @endphp
                            @foreach($themesByVertical as $vertical => $group)
                                @php
                                    $iconClass = match($vertical) {
                                        'ecommerce' => 'fa-shopping-cart text-success',
                                        'properties' => 'fa-home text-primary',
                                        'autos' => 'fa-car text-orange',
                                        'events' => 'fa-calendar-alt text-indigo',
                                        'jobs' => 'fa-briefcase text-teal',
                                        'services' => 'fa-tools text-info',
                                        'classifieds' => 'fa-tags text-muted',
                                        default => 'fa-circle text-secondary'
                                    };
                                    $label = match($vertical) {
                                        'ecommerce' => __('Online Shop / Retail'),
                                        'properties' => __('Real Estate'),
                                        'autos' => __('Automotive'),
                                        'events' => __('Events & Tickets'),
                                        'jobs' => __('Job Board'),
                                        'services' => __('Service Marketplace'),
                                        'classifieds' => __('Classifieds'),
                                        null, '' => __('Unified / Multi-Purpose'),
                                        default => ucfirst(__($vertical))
                                    };
                                @endphp
                                <a class="nav-link mb-2 {{ $first ? 'active shadow-sm' : '' }} smallest uppercase font-weight-bold letter-spacing-1" 
                                   id="v-pills-{{ Str::slug($vertical ?: 'general') }}-tab" 
                                   data-toggle="pill" 
                                   href="#v-pills-{{ Str::slug($vertical ?: 'general') }}" 
                                   role="tab">
                                    <div class="d-flex align-items-center">
                                        <i class="fas {{ $iconClass }} mr-2 opacity-75"></i>
                                        <span>{{ $label }}</span>
                                        <span class="badge badge-light-soft text-muted ml-auto px-2 py-1 rounded">{{ $group->count() }}</span>
                                    </div>
                                </a>
                                @php $first = false; @endphp
                            @endforeach
                        </div>
                    </div>
                    <div class="col-md-9 bg-white">
                        <div class="tab-content p-5" id="v-pills-tabContent">
                            @php $first = true; @endphp
                            @foreach($themesByVertical as $vertical => $group)
                                <div class="tab-pane fade {{ $first ? 'show active' : '' }}" 
                                     id="v-pills-{{ Str::slug($vertical ?: 'general') }}" 
                                     role="tabpanel">
                                     
                                     <div class="d-flex align-items-center mb-5">
                                         <h4 class="font-weight-bold mb-0 text-dark smallest text-uppercase letter-spacing-1">{{ __($vertical ?: 'Unified Themes') }} {{ __('Architecture') }}</h4>
                                         <div class="ml-4 h-px bg-light flex-grow-1"></div>
                                     </div>

                                     <div class="row">
                                         @foreach($group as $theme)
                                             <div class="col-md-4 mb-4">
                                                 <div class="card h-100 theme-card shadow-xs border-0 overflow-hidden rounded-20">
                                                     <div class="position-relative overflow-hidden theme-thumbnail-container h-180-p">
                                                         <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top w-100 h-100 object-fit-cover" alt="{{ $theme->title }}">
                                                          @include('admin.themes.partials._overlay')
                                                     </div>
                                                     <div class="card-body p-4 bg-white border-top">
                                                         <h6 class="font-weight-bold text-dark mb-1">{{ $theme->title }}</h6>
                                                         <code class="text-xs text-primary mb-3 d-inline-block font-weight-bold">{{ $theme->theme_key }}</code>
                                                         <p class="text-muted small mb-0 line-clamp-2 min-h-40-p">
                                                             {{ $theme->description ?: __('optimized layout components.') }}
                                                         </p>
                                                     </div>
                                                 </div>
                                             </div>
                                         @endforeach
                                     </div>
                                </div>
                                @php $first = false; @endphp
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
    <script src="{{ asset('admin-assets/pages/themes-index.js') }}"></script>
@endsection
