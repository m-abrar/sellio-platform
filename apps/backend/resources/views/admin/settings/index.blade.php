{{--
    Administrative Infrastructure Module: Global Settings Registry
    
    This view serves as the primary gateway for platform-wide 
    configuration. It facilitates the discovery and orchestration of 
    diverse setting clusters, including identity, SEO, security, and 
    integration protocols, via a centralized management interface.
    
    @extends adminlte::page
    @context Infrastructure Management
    @variables None.
--}}
@extends('adminlte::page')

@section('title', __('Settings Explorer'))

@section('breadcrumbs', '')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary opacity-50"></i> {{ __('System Architecture') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage global system variables, environment parameters, and platform logic.') }}</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-center justify-content-sm-end">
                @include('admin._partials._back-button', ['label' => 'DASHBOARD'])
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    {{-- Unified Layout Greeting --}}
    {{-- Welcome --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden rounded-24">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-primary d-flex align-items-center justify-content-center shadow-premium-lg icon-box-100 rounded-20 opacity-90">
                    <i class="fas fa-microchip text-white fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">{{ __('Configuration Control Center') }}</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">{{ __('Centralized management for core system engines, branding assets, and security protocols.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        @php
            $settings_groups = [
                ['id' => 'general', 'icon' => 'fa-cog', 'title' => __('General Settings'), 'color' => 'primary', 'desc' => __('Configure site identity, localization, and core branding assets.')],
                ['id' => 'modules', 'icon' => 'fa-boxes', 'title' => __('Module Activation'), 'color' => 'success', 'desc' => __('Globally toggle specific engine features and system site sections.')],
                ['id' => 'contact', 'icon' => 'fa-envelope', 'title' => __('Contact & Email'), 'color' => 'info', 'desc' => __('Manage SMTP protocols, notification triggers, and support channels.')],
                ['id' => 'seo', 'icon' => 'fa-chart-line', 'title' => __('SEO Metadata'), 'color' => 'warning', 'desc' => __('Optimize search visibility, robot directives, and global indexing.')],
                ['id' => 'social', 'icon' => 'fa-share-alt', 'title' => __('Social Integration'), 'color' => 'danger', 'desc' => __('Link official social profiles and manage Oauth connectivity.')],
                ['id' => 'pages', 'icon' => 'fa-file-alt', 'title' => __('System Pages'), 'color' => 'secondary', 'desc' => __('Map system-critical pages for Terms, Privacy, and User Agreements.')],
                ['id' => 'apis', 'icon' => 'fa-code', 'title' => __('APIs & Integration'), 'color' => 'indigo', 'desc' => __('Third-party service keys, analytics, and header/footer injections.')],
            ];
        @endphp

        @forelse($settings_groups as $group)
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 border-0 shadow-premium stat-card rounded-20">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-4">
                            <div class="icon-square-premium bg-{{ $group['color'] }}-soft mr-3">
                                <i class="fas {{ $group['icon'] }}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="font-weight-bold text-dark mb-2 small uppercase letter-spacing-1">{{ $group['title'] }}</h6>
                                <p class="text-muted small mb-0 leading-1-6 smallest-0-75">
                                    {{ $group['desc'] }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                            <span class="smallest text-muted font-weight-bold uppercase letter-spacing-1">{{ __('ID') }}: {{ $group['id'] }}</span>
                            <a href="{{ route('admin.settings.group', ['section' => $group['id']]) }}" 
                               class="btn btn-premium-soft btn-premium-soft-primary stretched-link">
                                {{ __('Configure') }} <i class="fas fa-chevron-right ml-1 small"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center py-5">
                <i class="fas fa-layer-group fa-4x text-muted opacity-25 mb-3"></i>
                <h5 class="text-muted">{{ __('No configuration registries found') }}</h5>
            </div>
        @endforelse
    </div>
</div>
@endsection

@section('js')
    <script src="{{ asset('admin-assets/pages/settings-explorer.js') }}"></script>
@endsection
