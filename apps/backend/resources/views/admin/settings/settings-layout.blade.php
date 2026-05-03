@extends('adminlte::page')

@section('title', 'Platform Logic | Master Configuration')

@section('breadcrumbs')
@stop

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
            <h1 class="font-weight-bold text-dark mb-0">
                <i class="fas fa-microchip mr-2 text-primary"></i> Master Configuration
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                Adjusting foundational platform engines and security protocols.
            </p>
        </div>
        <div class="text-right">
            <a href="{{ route('admin.settings.index') }}" class="btn btn-back shadow-sm px-4">
                <i class="fas fa-arrow-left mr-1"></i> BACK TO EXPLORER
            </a>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        <div class="col-md-3">
            <div class="card border-0 shadow-premium sticky-top" style="top: 100px; border-radius: 24px; background: rgba(255,255,255,0.9); backdrop-filter: blur(15px);">
                <div class="card-header bg-dark border-0 py-3 px-4" style="border-top-left-radius: 24px; border-top-right-radius: 24px; border-bottom: 4px solid var(--primary) !important;">
                    <h3 class="card-title font-weight-bold text-white smallest text-uppercase letter-spacing-1 mb-0">{{ __('Management Streams') }}</h3>
                </div>
                <div class="card-body p-3">
                    <ul class="nav nav-pills flex-column settings-nav">
                        @php $currentSection = collect(request()->segments())->last() ?? 'general'; @endphp
                        
                        @foreach(['general', 'modules', 'contact', 'SEO', 'social', 'pages', 'apis'] as $section)
                        <li class="nav-item mb-2">
                            <a href="{{ route('admin.settings.group', ['section' => $section]) }}" 
                               class="nav-link py-3 px-3 d-flex align-items-center @if(strtolower($currentSection) == strtolower($section)) active shadow-lg @endif"
                               style="border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                                <div class="icon-box-soft {{ strtolower($currentSection) == strtolower($section) ? 'bg-white bg-opacity-20' : 'bg-primary-soft' }} rounded-circle mr-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; min-width: 32px;">
                                    <i class="fas fa-{{ match(strtolower($section)) { 
                                        'general' => 'cog', 
                                        'modules' => 'boxes', 
                                        'contact' => 'envelope', 
                                        'seo' => 'chart-line', 
                                        'social' => 'share-alt', 
                                        'pages' => 'file-alt', 
                                        'apis' => 'code', 
                                        default => 'circle' 
                                    } }} {{ strtolower($currentSection) == strtolower($section) ? 'text-white' : 'text-primary' }} smallest"></i>
                                </div>
                                <span class="font-weight-bold text-uppercase smallest letter-spacing-1">{{ str_replace('-', ' ', $section) }}</span>
                                @if(strtolower($currentSection) == strtolower($section))
                                    <i class="fas fa-chevron-right ml-auto smallest opacity-50"></i>
                                @endif
                            </a>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        <div class="col-md-9">
            <div class="settings-content-wrapper animate__animated animate__fadeIn">
                @yield('setting-form-content')
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<style>
    .settings-nav .nav-link { color: var(--dark-muted); }
    .settings-nav .nav-link:hover:not(.active) { background: var(--primary-soft); color: var(--primary); transform: translateX(5px); }
    .settings-nav .nav-link.active { background: var(--primary) !important; color: #fff !important; }
    
    .settings-content-wrapper .card {
        border-radius: 24px;
        overflow: hidden;
        border: none;
        box-shadow: var(--premium-shadow);
        background: rgba(255,255,255,0.8);
        backdrop-filter: blur(10px);
    }
    
    .bg-opacity-20 { background: rgba(255,255,255,0.2) !important; }
</style>
@endpush
