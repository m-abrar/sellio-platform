@extends('adminlte::page')

@section('title', 'Settings Explorer')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary"></i> System Configuration
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage global system variables, environment parameters, and platform logic.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Settings Explorer</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    {{-- Unified Layout Greeting --}}
    <div class="card glass-card shadow-premium mb-5 border-0 overflow-hidden" style="border-radius: 24px; background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%); backdrop-filter: blur(15px);">
        <div class="card-body p-0">
            <div class="d-flex align-items-stretch">
                <div class="bg-primary px-5 d-flex align-items-center justify-content-center" style="min-width: 120px;">
                    <i class="fas fa-microchip text-white fa-2x shadow-sm"></i>
                </div>
                <div class="p-4">
                    <h5 class="mb-1 font-weight-bold text-dark">Configuration Control Center</h5>
                    <p class="mb-0 text-muted small letter-spacing-1">Centralized management for core system engines, branding assets, and security protocols.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        @php
            $settings_groups = [
                ['id' => 'general', 'icon' => 'fa-cog', 'title' => 'General Settings', 'color' => 'primary', 'desc' => 'Configure site identity, localization, and core branding assets.'],
                ['id' => 'modules', 'icon' => 'fa-boxes', 'title' => 'Module Activation', 'color' => 'success', 'desc' => 'Globally toggle specific engine features and system site sections.'],
                ['id' => 'contact', 'icon' => 'fa-envelope', 'title' => 'Contact & Email', 'color' => 'info', 'desc' => 'Manage SMTP protocols, notification triggers, and support channels.'],
                ['id' => 'seo', 'icon' => 'fa-chart-line', 'title' => 'SEO Metadata', 'color' => 'warning', 'desc' => 'Optimize search visibility, robot directives, and global indexing.'],
                ['id' => 'social', 'icon' => 'fa-share-alt', 'title' => 'Social Integration', 'color' => 'danger', 'desc' => 'Link official social profiles and manage Oauth connectivity.'],
                ['id' => 'pages', 'icon' => 'fa-file-alt', 'title' => 'System Pages', 'color' => 'secondary', 'desc' => 'Map system-critical pages for Terms, Privacy, and User Agreements.'],
                ['id' => 'apis', 'icon' => 'fa-code', 'title' => 'APIs & Integration', 'color' => 'indigo', 'desc' => 'Third-party service keys, analytics, and header/footer injections.'],
            ];
        @endphp

        @forelse($settings_groups as $group)
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 glass-card shadow-sm border-0 stat-card" style="border-radius: 20px; transition: all 0.3s ease;">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-4">
                            <div class="icon-circle bg-{{ $group['color'] }}-soft text-{{ $group['color'] == 'indigo' ? 'purple' : $group['color'] }} mr-3 shadow-xs" style="width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                                <i class="fas {{ $group['icon'] }}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="font-weight-bold text-dark mb-2 text-uppercase letter-spacing-1" style="font-size: 0.85rem;">{{ $group['title'] }}</h6>
                                <p class="text-muted small mb-0" style="line-height: 1.6; font-size: 0.75rem;">
                                    {{ $group['desc'] }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                            <span class="small text-muted font-weight-bold text-uppercase" style="font-size: 0.6rem; letter-spacing: 0.5px;">REGISTRY: {{ strtoupper($group['id']) }}</span>
                            <a href="{{ route('admin.settings.group', ['section' => $group['id']]) }}" 
                               class="btn btn-sm btn-primary-soft rounded-pill px-3 font-weight-bold stretched-link" style="font-size: 0.7rem;">
                                CONFIGURE <i class="fas fa-chevron-right ml-1 small"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center py-5">
                <i class="fas fa-layer-group fa-4x text-muted opacity-25 mb-3"></i>
                <h5 class="text-muted">No configuration registries found</h5>
            </div>
        @endforelse
    </div>
</div>
@endsection

@section('css')
<style>
    .stat-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-premium) !important; border-color: rgba(70, 165, 172, 0.2); }
    .text-purple { color: #6366f1; }
    .bg-indigo-soft { background: rgba(99, 102, 241, 0.1); }
</style>
@stop

@section('js')
<script>
    $(function () {
        // Animation sequence for cards
        $('.stat-card').each(function(index) {
            $(this).css({
                'opacity': '0',
                'transform': 'translateY(15px)',
                'transition': 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            });
            setTimeout(() => {
                $(this).css({'opacity': '1', 'transform': 'translateY(0)'});
            }, index * 80);
        });
    });
</script>
@endsection
