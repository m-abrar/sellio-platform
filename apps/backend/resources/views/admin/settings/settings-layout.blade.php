@extends('adminlte::page')

@section('title', 'System Settings')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary"></i> {{ __('System Configuration') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Fine-tune platform engines, security protocols, and branding assets.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('admin.settings.index') }}">Explorer</a></li>
                    <li class="breadcrumb-item active">Management</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        <div class="col-md-3">
            <div class="card glass-card shadow-sm border-0 sticky-top" style="top: 20px; border-radius: 20px;">
                <div class="card-header bg-white border-0 py-3">
                    <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">{{ __('Registry Navigation') }}</h3>
                </div>
                <div class="card-body p-3">
                    <ul class="nav nav-pills flex-column settings-nav">
                        @php $currentSection = collect(request()->segments())->last() ?? 'general'; @endphp
                        
                        @foreach(['general', 'modules', 'contact', 'SEO', 'social', 'pages', 'apis'] as $section)
                        <li class="nav-item mb-2">
                            <a href="{{ route('admin.settings.group', ['section' => $section]) }}" 
                               class="nav-link py-2 px-3 @if($currentSection == $section) active shadow-sm @endif"
                               style="border-radius: 12px; transition: all 0.3s ease;">
                                <i class="fas fa-{{ match(strtolower($section)) { 
                                    'general' => 'cog', 
                                    'modules' => 'boxes', 
                                    'contact' => 'envelope', 
                                    'seo' => 'chart-line', 
                                    'social' => 'share-alt', 
                                    'pages' => 'file-alt', 
                                    'apis' => 'code', 
                                    default => 'circle' 
                                } }} mr-2 {{ $currentSection == $section ? '' : 'text-primary' }}"></i>
                                <span class="font-weight-600">{{ ucwords(str_replace('-', ' ', $section)) }}</span>
                            </a>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        <div class="col-md-9">
            <div class="settings-content-wrapper">
                @yield('setting-form-content')
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<style>
    .settings-nav .nav-link { color: var(--dark-muted); font-weight: 500; }
    .settings-nav .nav-link:hover:not(.active) { background: var(--primary-soft); color: var(--primary); }
    .settings-nav .nav-link.active { background: var(--primary) !important; color: #fff !important; }
    
    .settings-content-wrapper .card {
        border-radius: 24px;
        overflow: hidden;
        border: none;
        box-shadow: var(--premium-shadow);
    }
    .form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
</style>
@endpush
