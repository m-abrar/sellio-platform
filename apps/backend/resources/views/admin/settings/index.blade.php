@extends('adminlte::page')

@section('title', 'Settings Explorer')

@section('breadcrumbs')
@stop

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary opacity-50"></i> System Architecture
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage global system variables, environment parameters, and platform logic.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                @include('admin._partials._back-button', ['label' => 'DASHBOARD'])
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    {{-- Unified Layout Greeting --}}
    {{-- Global Registry Greeting --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden" style="border-radius: 24px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-primary d-flex align-items-center justify-content-center shadow-premium-lg" style="width: 100px; height: 100px; min-width: 100px; border-radius: 20px; opacity: 0.9;">
                    <i class="fas fa-microchip text-white fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">Configuration Control Center</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">Centralized management for core system engines, branding assets, and security protocols.</p>
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
                <div class="card h-100 border-0 shadow-premium stat-card" style="border-radius: 20px;">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-4">
                            <div class="icon-square-premium bg-{{ $group['color'] }}-soft mr-3" style="color: {{ $group['color'] == 'indigo' ? '#6366f1' : 'var(--' . $group['color'] . ')' }};">
                                <i class="fas {{ $group['icon'] }}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="font-weight-bold text-dark mb-2 small uppercase letter-spacing-1">{{ $group['title'] }}</h6>
                                <p class="text-muted small mb-0" style="line-height: 1.6; font-size: 0.75rem;">
                                    {{ $group['desc'] }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                            <span class="smallest text-muted font-weight-bold uppercase letter-spacing-1">Registry: {{ $group['id'] }}</span>
                            <a href="{{ route('admin.settings.group', ['section' => $group['id']]) }}" 
                               class="btn btn-premium-soft btn-premium-soft-primary stretched-link">
                                Configure <i class="fas fa-chevron-right ml-1 small"></i>
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

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .stat-card:hover { transform: translateY(-8px); box-shadow: 0 15px 45px rgba(0,0,0,0.06) !important; }
</style>
@endpush

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
