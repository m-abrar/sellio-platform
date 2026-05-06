@extends('adminlte::page')

@section('title', 'Theme Manager')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-palette mr-2 text-primary opacity-50"></i> Theme Customization Engine
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Manage storefront identities and vertical-specific visual architectures.
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
                    <h5 class="mb-1 font-weight-bold text-dark">Visual Identity Engine</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">Manage vertical-specific storefront architectures, liquid templates, and multi-tenant skins.</p>
                </div>
            </div>
        </div>
    </div>

    {{-- SECTION 1: ACTIVE THEME --}}
    @if($activeTheme)
    <div class="mb-5">
        <div class="section-title-modern mb-3">
            <span class="badge badge-primary-light text-primary px-3 py-2 mb-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">CURRENTLY ACTIVE</span>
            <h5 class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1">Active Storefront Identity</h5>
        </div>
        <div class="card card-premium active-theme-hero overflow-hidden border-0 shadow-premium rounded-24">
            <div class="row no-gutters">
                <div class="col-md-5">
                    <div class="position-relative h-100 bg-light">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="img-fluid h-100 w-100 object-fit-cover" alt="{{ $activeTheme->title }}">
                        <div class="active-status-overlay">
                            <i class="fas fa-check-circle mr-1"></i> LIVE NOW
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card-body p-5 d-flex flex-column h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 class="font-weight-bold text-dark mb-1 h3">{{ $activeTheme->title }}</h2>
                                <span class="badge badge-primary-light text-primary px-3 py-1 text-uppercase smallest font-weight-bold rounded-pill">
                                    <i class="fas fa-layer-group mr-1 opacity-50"></i> {{ $activeTheme->vertical ?? 'Unified / General' }}
                                </span>
                            </div>
                            <code class="bg-dark text-white px-3 py-1 rounded-pill smallest font-weight-bold shadow-sm">{{ $activeTheme->theme_key }}</code>
                        </div>
                        
                        <p class="text-muted flex-grow-1 font-1-1 leading-1-7">
                            {{ $activeTheme->description ?? 'This theme is driving your storefront. It utilizes a ' . ($activeTheme->vertical ?? 'unified') . ' layout system with specialized components for ' . ($activeTheme->vertical ?? 'all business operations') . '.' }}
                        </p>

                        <div class="mt-4 pt-4 border-top d-flex align-items-center gap-15">
                            <a href="{{ url('/') }}" target="_blank" class="btn btn-primary px-4 rounded-pill font-weight-bold shadow-premium smallest">
                                <i class="fas fa-external-link-alt mr-2"></i> View Site
                            </a>
                            <a href="{{ route('admin.themes.edit', $activeTheme->id) }}" class="btn btn-default shadow-xs border px-4 rounded-pill font-weight-bold smallest">
                                <i class="fas fa-cog mr-2"></i> Theme Settings
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
            <h5 class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1"><i class="fas fa-history mr-2 text-primary opacity-50"></i> Recently Used</h5>
        </div>
        <div class="row">
            @foreach($recentThemes as $theme)
            <div class="col-md-3">
                <div class="card theme-card-sm shadow-premium border-0 overflow-hidden rounded-16">
                    <div class="position-relative">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top h-140-p object-fit-cover" alt="{{ $theme->title }}">
                        <div class="theme-overlay">
                            <form action="{{ route('admin.themes.activate', $theme->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-white btn-sm font-weight-bold px-4 rounded-pill shadow smallest">
                                    <i class="fas fa-bolt mr-1 text-primary"></i> Activate
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="card-body p-3 text-center bg-white border-top">
                        <h6 class="font-weight-bold mb-1 text-dark text-truncate">{{ $theme->title }}</h6>
                        <small class="text-muted smallest uppercase font-weight-bold opacity-75">Used {{ $theme->last_activated_at->diffForHumans() }}</small>
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
                    <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> Global Theme Library Explorer
                </h5>
                <div class="card-tools ml-auto">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase shadow-xs">
                        <i class="fas fa-palette mr-1"></i> {{ $themesByVertical->flatten()->count() }} TOTAL SKINS
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
                                        'ecommerce' => 'Online Shop / Retail',
                                        'properties' => 'Real Estate',
                                        'autos' => 'Automotive',
                                        'events' => 'Events & Tickets',
                                        'jobs' => 'Job Board',
                                        'services' => 'Service Marketplace',
                                        'classifieds' => 'Classifieds',
                                        null, '' => 'Unified / Multi-Purpose',
                                        default => ucfirst($vertical)
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
                                         <h4 class="font-weight-bold mb-0 text-dark smallest text-uppercase letter-spacing-1">{{ $vertical ?: 'Unified Themes' }} Architecture</h4>
                                         <div class="ml-4 h-px bg-light flex-grow-1"></div>
                                     </div>

                                     <div class="row">
                                         @foreach($group as $theme)
                                             <div class="col-md-4 mb-4">
                                                 <div class="card h-100 theme-card shadow-xs border-0 overflow-hidden rounded-20">
                                                     <div class="position-relative overflow-hidden theme-thumbnail-container h-180-p">
                                                         <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top w-100 h-100 object-fit-cover" alt="{{ $theme->title }}">
                                                         <div class="theme-overlay">
                                                              <a href="{{ route('admin.themes.edit', $theme->id) }}" class="btn btn-white btn-sm font-weight-bold px-3 shadow mr-2 rounded-pill">
                                                                 <i class="fas fa-cog text-info"></i>
                                                              </a>
                                                            <form action="{{ route('admin.themes.activate', $theme->id) }}" method="POST">
                                                                @csrf
                                                                <button type="submit" class="btn btn-primary btn-sm font-weight-bold px-4 shadow rounded-pill smallest">
                                                                   Activate
                                                                </button>
                                                            </form>
                                                         </div>
                                                     </div>
                                                     <div class="card-body p-4 bg-white border-top">
                                                         <h6 class="font-weight-bold text-dark mb-1">{{ $theme->title }}</h6>
                                                         <code class="text-xs text-primary mb-3 d-inline-block font-weight-bold">{{ $theme->theme_key }}</code>
                                                         <p class="text-muted small mb-0 line-clamp-2 min-h-40-p">
                                                             {{ $theme->description ?? 'optimized ' . ($theme->vertical ?: 'unified') . ' layout components.' }}
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

@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        var hash = window.location.hash;
        if (hash) {
            $('.nav-pills a[href="' + hash + '"]').tab('show');
        }
    });
</script>
@endsection
