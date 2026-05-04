@extends('adminlte::page')

@section('title', 'Theme Manager')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-palette mr-2 text-primary"></i> Theme Customization Engine
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
<div class="container-fluid">
    @include('admin.alert')

    {{-- Theme Engine Greeting --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden" style="border-radius: 24px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-indigo d-flex align-items-center justify-content-center shadow-premium-lg" style="width: 100px; height: 100px; min-width: 100px; border-radius: 20px; opacity: 0.9;">
                    <i class="fas fa-magic text-white fa-2x"></i>
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
        <div class="section-title-modern">
            <span class="badge badge-primary-light text-primary px-3 py-2 mb-2 rounded-pill font-weight-bold smallest">CURRENTLY ACTIVE</span>
            <h4 class="font-weight-bold text-dark">Active Storefront Identity</h4>
        </div>
        <div class="card card-premium active-theme-hero overflow-hidden">
            <div class="row no-gutters">
                <div class="col-md-5">
                    <div class="position-relative h-100">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="img-fluid h-100 w-100" style="object-fit: cover;" alt="{{ $activeTheme->title }}">
                        <div class="active-status-overlay">
                            <i class="fas fa-check-circle mr-1"></i> LIVE NOW
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card-body p-4 d-flex flex-column h-100">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h2 class="font-weight-bold text-dark mb-1">{{ $activeTheme->title }}</h2>
                                <span class="badge badge-light border px-3 text-uppercase small font-weight-bold">
                                    {{ $activeTheme->vertical ?? 'Unified / General' }}
                                </span>
                            </div>
                            <code class="bg-dark text-white px-3 py-1 rounded shadow-sm">{{ $activeTheme->theme_key }}</code>
                        </div>
                        
                        <p class="text-muted flex-grow-1" style="font-size: 1.1rem; line-height: 1.6;">
                            {{ $activeTheme->description ?? 'This theme is driving your storefront. It utilizes a ' . ($activeTheme->vertical ?? 'unified') . ' layout system with specialized components for ' . ($activeTheme->vertical ?? 'all business operations') . '.' }}
                        </p>

                        <div class="mt-4 pt-3 border-top d-flex align-items-center">
                            <a href="{{ url('/') }}" target="_blank" class="btn btn-primary px-4 py-2 font-weight-bold mr-3 shadow d-inline-flex align-items-center">
                                <i class="fas fa-external-link-alt mr-2"></i> View Site
                            </a>
                            <a href="{{ route('admin.themes.edit', $activeTheme->id) }}" class="btn btn-primary-soft px-4 py-2 font-weight-bold d-inline-flex align-items-center">
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
        <div class="section-title-modern">
            <h5 class="font-weight-bold text-muted"><i class="fas fa-history mr-2"></i> Recently Used</h5>
        </div>
        <div class="row">
            @foreach($recentThemes as $theme)
            <div class="col-md-3">
                <div class="card theme-card-sm shadow-sm border-0">
                    <div class="position-relative">
                        <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top" style="height: 120px; object-fit: cover;" alt="{{ $theme->title }}">
                        <div class="theme-overlay">
                            <form action="{{ route('admin.themes.activate', $theme->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-light btn-xs font-weight-bold px-3 shadow">
                                    <i class="fas fa-bolt mr-1"></i> Activate
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="card-body p-2 text-center">
                        <h6 class="font-weight-bold mb-0 text-truncate">{{ $theme->title }}</h6>
                        <small class="text-muted text-xs">Used {{ $theme->last_activated_at->diffForHumans() }}</small>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    {{-- SECTION 3: BROWSE BY VERTICAL --}}
    <div class="mb-5">
        <div class="section-title-modern d-flex align-items-center justify-content-between">
            <h5 class="font-weight-bold text-muted small text-uppercase letter-spacing-1"><i class="fas fa-layer-group mr-2"></i> Theme Library</h5>
        </div>

        <div class="card card-premium overflow-hidden">
            <div class="card-body p-0">
                <div class="row no-gutters">
                    <div class="col-md-3 border-right">
                        <div class="nav flex-column nav-pills vertical-theme-nav p-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
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
                                <a class="nav-link mb-2 {{ $first ? 'active' : '' }}" 
                                   id="v-pills-{{ Str::slug($vertical ?: 'general') }}-tab" 
                                   data-toggle="pill" 
                                   href="#v-pills-{{ Str::slug($vertical ?: 'general') }}" 
                                   role="tab">
                                    <div class="d-flex align-items-center">
                                        <i class="fas {{ $iconClass }} mr-2 text-xs"></i>
                                        <span class="text-capitalize">{{ $label }}</span>
                                        <span class="badge badge-light ml-auto">{{ $group->count() }}</span>
                                    </div>
                                </a>
                                @php $first = false; @endphp
                            @endforeach
                        </div>
                    </div>
                    <div class="col-md-9 bg-light rounded-right">
                        <div class="tab-content p-4" id="v-pills-tabContent">
                            @php $first = true; @endphp
                            @foreach($themesByVertical as $vertical => $group)
                                <div class="tab-pane fade {{ $first ? 'show active' : '' }}" 
                                     id="v-pills-{{ Str::slug($vertical ?: 'general') }}" 
                                     role="tabpanel">
                                     
                                     <div class="d-flex align-items-center mb-4">
                                         <h4 class="font-weight-bold mb-0 text-capitalize">{{ $vertical ?: 'Unified Themes' }}</h4>
                                         <div class="ml-3 h-px bg-secondary flex-grow-1 opacity-25"></div>
                                     </div>

                                     <div class="row">
                                         @foreach($group as $theme)
                                             <div class="col-md-4 mb-4">
                                                 <div class="card h-100 theme-card shadow-xs border-0">
                                                     <div class="position-relative overflow-hidden theme-thumbnail-container">
                                                         <img src="{{ asset('frontend/images/preview.png') }}" class="card-img-top" style="height: 160px; object-fit: cover;" alt="{{ $theme->title }}">
                                                         <div class="theme-overlay">
                                                              <a href="{{ route('admin.themes.edit', $theme->id) }}" class="btn btn-light btn-sm font-weight-bold px-3 shadow mr-2">
                                                                 <i class="fas fa-cog"></i>
                                                              </a>
                                                              <form action="{{ route('admin.themes.activate', $theme->id) }}" method="POST">
                                                                  @csrf
                                                                  <button type="submit" class="btn btn-primary btn-sm font-weight-bold px-3 shadow">
                                                                     Activate
                                                                  </button>
                                                              </form>
                                                         </div>
                                                     </div>
                                                     <div class="card-body p-3">
                                                         <h6 class="font-weight-bold text-dark mb-1">{{ $theme->title }}</h6>
                                                         <code class="text-xs mb-2 d-block">{{ $theme->theme_key }}</code>
                                                         <p class="text-muted small mb-0 line-clamp-2">
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

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    .bg-indigo { background-color: #6610f2; }
    .h-px { height: 1px; }
    .opacity-25 { opacity: 0.25; }
    .btn-xs { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    /* Modern Headers */
    .section-title-modern { margin-bottom: 1.5rem; }

    /* Active Theme Hero */
    .active-theme-hero { border-radius: 20px; transition: transform 0.3s ease; }
    .active-theme-hero:hover { transform: translateY(-3px); }
    .active-status-overlay {
        position: absolute;
        top: 20px;
        left: 20px;
        background: #28a745;
        color: #fff;
        padding: 5px 15px;
        border-radius: 30px;
        font-size: 0.75rem;
        font-weight: 800;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }

    /* Small Recent Cards */
    .theme-card-sm { border-radius: 12px; transition: all 0.2s; overflow: hidden; }
    .theme-card-sm:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }

    /* Library Cards */
    .theme-card { border-radius: 15px; transition: all 0.3s; }
    .theme-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important; }
    .theme-thumbnail-container { border-radius: 15px 15px 0 0; }

    /* Navigation */
    .vertical-theme-nav .nav-link {
        border-radius: 14px;
        color: #64748b;
        font-weight: 700;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        padding: 0.8rem 1.2rem;
        margin-bottom: 8px;
    }
    .vertical-theme-nav .nav-link:hover { 
        background: #fff !important;
        color: var(--primary) !important;
        box-shadow: 0 10px 15px -3px rgba(var(--primary-rgb), 0.1), 0 4px 6px -2px rgba(var(--primary-rgb), 0.05) !important;
        border-color: var(--primary-soft) !important;
        transform: translateX(5px);
    }
    .vertical-theme-nav .nav-link.active {
        background: var(--primary-soft) !important;
        color: var(--primary) !important;
        box-shadow: none !important;
        transform: translateX(8px);
    }
    .vertical-theme-nav .nav-link.active i {
        transform: scale(1.2);
    }

    /* Actions Overlay */
    .theme-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .card:hover .theme-overlay { opacity: 1; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        // Ensure active tab is visible if deep-linked (future-proofing)
        var hash = window.location.hash;
        if (hash) {
            $('.nav-pills a[href="' + hash + '"]').tab('show');
        }
    });
</script>
@endsection
