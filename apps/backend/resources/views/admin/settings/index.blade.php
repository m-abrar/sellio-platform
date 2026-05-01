@extends('adminlte::page')

@section('title', 'Settings Explorer')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary"></i> System Configuration
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1">Manage global system variables and environment parameters.</p>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right bg-transparent p-0">
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
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-body p-0">
            <div class="d-flex align-items-stretch">
                <div class="bg-primary px-5 d-flex align-items-center justify-content-center">
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
                <div class="card h-100 glass-card shadow-sm border-0 stat-card">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-4">
                            <div class="icon-circle bg-{{ $group['color'] }}-soft text-{{ $group['color'] == 'indigo' ? 'purple' : $group['color'] }} mr-3 shadow-sm">
                                <i class="fas {{ $group['icon'] }}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="font-weight-bold text-dark mb-2 text-uppercase letter-spacing-1">{{ $group['title'] }}</h6>
                                <p class="text-muted small mb-0" style="line-height: 1.6;">
                                    {{ $group['desc'] }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                            <span class="small text-muted font-weight-bold text-uppercase" style="font-size: 0.65rem;">Registry: {{ strtoupper($group['id']) }}</span>
                            <a href="{{ route('admin.settings.group', ['section' => $group['id']]) }}" 
                               class="btn btn-sm btn-primary-soft rounded-pill px-3 font-weight-bold stretched-link">
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
    :root {
        --primary: #46a5ac;
        --primary-soft: rgba(70, 165, 172, 0.1);
        --success-soft: rgba(16, 185, 129, 0.1);
        --info-soft: rgba(14, 165, 233, 0.1);
        --warning-soft: rgba(245, 158, 11, 0.1);
        --danger-soft: rgba(239, 68, 68, 0.1);
        --secondary-soft: rgba(100, 116, 139, 0.1);
        --indigo-soft: rgba(99, 102, 241, 0.1);
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
        border-radius: 20px;
    }

    .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .stat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }

    .bg-primary-soft { background: var(--primary-soft); }
    .bg-success-soft { background: var(--success-soft); }
    .bg-info-soft { background: var(--info-soft); }
    .bg-warning-soft { background: var(--warning-soft); }
    .bg-danger-soft { background: var(--danger-soft); }
    .bg-secondary-soft { background: var(--secondary-soft); }
    .bg-indigo-soft { background: var(--indigo-soft); }
    
    .text-purple { color: #6366f1; }

    .icon-circle { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    
    .btn-primary-soft { background: var(--primary-soft); color: var(--primary); border: none; transition: all 0.3s ease; }
    .btn-primary-soft:hover { background: var(--primary); color: #fff; }

    .letter-spacing-1 { letter-spacing: 1px; }
    .opacity-25 { opacity: 0.25; }
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
