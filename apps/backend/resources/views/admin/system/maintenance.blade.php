@extends('adminlte::page')

@section('title', 'System Maintenance | Admin Ops')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tools mr-2 text-primary opacity-50"></i> 
                    System Maintenance
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Optimize engines, purge system buffers, and synchronize platform assets.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-chevron-left"></i> Dashboard
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        {{-- Main Operations Column --}}
        <div class="col-md-8">
            <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        <i class="fas fa-cogs mr-1 text-primary opacity-50"></i> Foundational Optimization
                    </h3>
                </div>
                <div class="card-body p-4">
                    <div class="d-flex align-items-start mb-4 p-3 rounded-xl" style="background: rgba(70, 165, 172, 0.05); border: 1px solid rgba(70, 165, 172, 0.1);">
                        <div class="icon-box-soft bg-white text-primary mr-3 shadow-xs" style="min-width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <div>
                            <p class="text-dark small mb-0" style="line-height: 1.6;">
                                Running optimization will clear all existing caches and regenerate configuration, route, and view caches for maximum performance. Recommended after environment updates.
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap align-items-center">
                        <form action="{{ route('admin.system.optimize') }}" method="POST" class="mr-3 mb-2">
                            @csrf
                            <button type="submit" class="btn btn-primary rounded-pill px-4 font-weight-bold">
                                <i class="fas fa-bolt mr-2"></i> OPTIMIZE & CACHE ALL
                            </button>
                        </form>
                        <form action="{{ route('admin.system.storage.link') }}" method="POST" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-outline-dark rounded-pill px-4 font-weight-bold">
                                <i class="fas fa-link mr-2"></i> FIX STORAGE LINK
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="row">
                @php
                    $cacheItems = [
                        ['id' => 'cache', 'icon' => 'fa-database', 'title' => 'App Cache', 'color' => 'primary', 'desc' => 'General data cache.'],
                        ['id' => 'config', 'icon' => 'fa-cog', 'title' => 'Config Cache', 'color' => 'info', 'desc' => 'Environment variables.'],
                        ['id' => 'route', 'icon' => 'fa-route', 'title' => 'Route Cache', 'color' => 'success', 'desc' => 'URL definitions.'],
                        ['id' => 'view', 'icon' => 'fa-file-code', 'title' => 'View Cache', 'color' => 'warning', 'desc' => 'Compiled templates.'],
                    ];
                @endphp

                @foreach($cacheItems as $item)
                <div class="col-md-6 mb-4">
                    <div class="card h-100 border-0 shadow-premium" style="border-radius: 20px;">
                        <div class="card-body p-4 text-center">
                            <div class="icon-circle bg-{{ $item['color'] }}-soft text-{{ $item['color'] }} mx-auto mb-3 shadow-xs" style="width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                <i class="fas {{ $item['icon'] }}"></i>
                            </div>
                            <h5 class="font-weight-bold text-dark mb-1">{{ $item['title'] }}</h5>
                            <p class="smallest text-muted mb-3">{{ $item['desc'] }}</p>
                            <form action="{{ route('admin.system.' . $item['id'] . '.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-{{ $item['color'] }}-soft btn-block rounded-pill py-2 font-weight-bold smallest">
                                    PURGE {{ strtoupper($item['id']) }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                @endforeach

                <div class="col-md-12">
                    <div class="card border-0 shadow-premium mb-4" style="border-radius: 24px; border: 1px dashed rgba(70, 165, 172, 0.2) !important;">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <div class="icon-circle bg-primary-soft text-primary mx-auto mb-3 mb-md-0 shadow-xs" style="width: 70px; height: 70px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
                                        <i class="fas fa-images"></i>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <h5 class="font-weight-bold text-dark mb-1">Image Conversions</h5>
                                    <p class="text-muted smallest mb-0">
                                        Regenerate missing thumbnails and responsive versions. This operation executes in the background via the <strong>async queue worker</strong>.
                                    </p>
                                </div>
                                <div class="col-md-3 text-right">
                                    <form action="{{ route('admin.system.media.regenerate') }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn btn-primary rounded-pill px-4 font-weight-bold smallest">
                                            REGENERATE
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Sidebar Insights --}}
        <div class="col-md-4">
            <div class="card border-0 shadow-premium bg-dark mb-4 overflow-hidden" style="border-radius: 24px;">
                <div class="card-body p-4 position-relative" style="z-index: 1;">
                    <div class="position-absolute" style="top: -20px; right: -20px; opacity: 0.05; font-size: 8rem; transform: rotate(-15deg);">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h5 class="font-weight-bold text-white mb-3 smallest text-uppercase letter-spacing-1">
                        <i class="fas fa-info-circle mr-2 text-warning"></i> Operational Guide
                    </h5>
                    <p class="smallest text-white-50 mb-3 font-weight-bold uppercase" style="line-height: 1.6;">
                        These tools manage the platform's foundational buffers. Use them to resolve:
                    </p>
                    <ul class="smallest text-white-50 pl-3 mb-4 font-weight-bold uppercase" style="list-style: none;">
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> Environment (.env) sync issues</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> Broken media or symlinks</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> Routing conflicts or missing keys</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> Compiled template legacy issues</li>
                    </ul>
                    <div class="p-3 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-10 smallest">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-white-50 uppercase font-weight-bold">Environment</span>
                            <span class="font-weight-bold text-warning text-uppercase letter-spacing-1">{{ config('app.env') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-white-50 uppercase font-weight-bold">Timezone</span>
                            <span class="font-weight-bold text-white uppercase">{{ config('app.timezone') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                <div class="card-body p-4 d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-shield-alt fa-2x text-primary opacity-25"></i>
                    </div>
                    <div>
                        <h6 class="font-weight-bold text-dark mb-1">Atomic Operations</h6>
                        <p class="smallest text-muted mb-0">Cleaning buffers is safe and does not modify database records.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<style>
    .bg-white.bg-opacity-10 { background: rgba(255,255,255,0.05) !important; }
    .border-white.border-opacity-10 { border-color: rgba(255,255,255,0.1) !important; }
</style>
@endpush

@section('css')
    <style>
        .card { transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .bg-dark-light { background: rgba(255,255,255,0.05); }
        .opacity-75 { opacity: 0.75; }
    </style>
@stop
