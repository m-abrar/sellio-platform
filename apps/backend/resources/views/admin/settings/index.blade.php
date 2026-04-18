@extends('adminlte::page')

@section('title', 'Settings Explorer')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary"></i> System Configuration
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Settings Explorer</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    {{-- Unified Layout Greeting --}}
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card bg-white border-0 shadow-sm overflow-hidden" style="border-radius: 12px;">
                <div class="card-body p-0">
                    <div class="d-flex align-items-stretch">
                        <div class="bg-primary px-4 d-flex align-items-center">
                            <i class="fas fa-microchip text-white fa-2x"></i>
                        </div>
                        <div class="p-3">
                            <h5 class="mb-1 font-weight-bold text-dark">Configuration Control Center</h5>
                            <p class="mb-0 text-muted small">Global system variables and environment parameters are centralized here. Changes take effect across the entire application stack.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        @php
            $settings_groups = [
                ['id' => 'general', 'icon' => 'fa-cog', 'title' => 'General Settings', 'color' => 'text-primary', 'desc' => 'Configure site identity, localization, and core branding assets.'],
                ['id' => 'modules', 'icon' => 'fa-boxes', 'title' => 'Module Activation', 'color' => 'text-success', 'desc' => 'Globally toggle specific engine features and system site sections.'],
                ['id' => 'contact', 'icon' => 'fa-envelope', 'title' => 'Contact & Email', 'color' => 'text-info', 'desc' => 'Manage SMTP protocols, notification triggers, and support channels.'],
                ['id' => 'seo', 'icon' => 'fa-chart-line', 'title' => 'SEO Metadata', 'color' => 'text-warning', 'desc' => 'Optimize search visibility, robot directives, and global indexing.'],
                ['id' => 'social', 'icon' => 'fa-share-alt', 'title' => 'Social Integration', 'color' => 'text-danger', 'desc' => 'Link official social profiles and manage Oauth connectivity.'],
                ['id' => 'pages', 'icon' => 'fa-file-alt', 'title' => 'System Pages', 'color' => 'text-secondary', 'desc' => 'Map system-critical pages for Terms, Privacy, and User Agreements.'],
                ['id' => 'apis', 'icon' => 'fa-code', 'title' => 'APIs & Integration', 'color' => 'text-indigo', 'desc' => 'Third-party service keys, analytics, and header/footer injections.'],
            ];
        @endphp

        @forelse($settings_groups as $group)
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 card-premium shadow-sm border-0 position-relative">
                    <div class="card-body">
                        <div class="d-flex align-items-start mb-3">
                            <div class="icon-square shadow-xs mr-3 {{ $group['color'] }}">
                                <i class="fas {{ $group['icon'] }} fa-lg"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="font-weight-bold text-dark mb-1">{{ $group['title'] }}</h6>
                                <p class="text-muted small mb-0" style="line-height: 1.5;">
                                    {{ $group['desc'] }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light border-0 py-2 px-3 text-right">
                        <a href="{{ route('admin.settings.group', ['section' => $group['id']]) }}" 
                           class="btn btn-link btn-sm font-weight-bold text-decoration-none stretched-link">
                            Edit Configuration <i class="fas fa-arrow-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center py-5">
                <i class="fas fa-layer-group fa-4x text-light mb-3"></i>
                <h5 class="text-muted">No configuration registries found</h5>
            </div>
        @endforelse
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium Settings Dashboard Styles */
    .shadow-xs { box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .font-weight-bold { font-weight: 700 !important; }
    
    .card-premium {
        border-radius: 10px;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        border: 1px solid transparent !important;
    }

    .card-premium:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
        border-color: #e2e8f0 !important;
        background-color: #fcfcfc;
    }

    .icon-square {
        width: 48px;
        height: 48px;
        background: #fff;
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .text-indigo { color: #6610f2; }
    .bg-primary { background-color: #007bff !important; }

    .btn-link { color: #4a5568; }
    .btn-link:hover { color: #007bff; }
    .text-xs { font-size: 0.7rem; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        // Animation sequence for cards
        $('.card-premium').each(function(index) {
            $(this).css({
                'opacity': '0',
                'transform': 'translateY(10px)',
                'transition': 'all 0.4s ease'
            });
            setTimeout(() => {
                $(this).css({'opacity': '1', 'transform': 'translateY(0)'});
            }, index * 100);
        });
    });
</script>
@endsection
