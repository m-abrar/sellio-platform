@extends('adminlte::page')

@section('title', 'System Maintenance | Admin Ops')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="text-dark font-weight-bold">
            <i class="fas fa-tools mr-2 text-danger"></i> 
            System Maintenance
            <small class="lead d-block d-md-inline-block ml-md-3 text-muted">Optimize and purge system buffers</small>
        </h1>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row">
        {{-- Row 1: Quick Actions & Optimization --}}
        <div class="col-md-8">
            <div class="card card-outline card-danger shadow-sm mb-4" style="border-radius: 12px;">
                <div class="card-header bg-white py-3">
                    <h3 class="card-title font-weight-bold">
                        <i class="fas fa-rocket mr-2 text-orange"></i>
                        Application Optimization
                    </h3>
                </div>
                <div class="card-body">
                    <p class="text-muted mb-4">
                        Running optimization will clear all existing caches and regenerate configuration, route, and view caches for maximum performance. Use this after changing environment files or code.
                    </p>
                    <div class="d-flex flex-wrap align-items-center">
                        <form action="{{ route('admin.system.optimize') }}" method="POST" class="mr-3 mb-2">
                            @csrf
                            <button type="submit" class="btn btn-danger btn-lg px-4 shadow-sm font-weight-bold" style="border-radius: 8px;">
                                <i class="fas fa-bolt mr-2"></i> Optimize & Cache All
                            </button>
                        </form>
                        <form action="{{ route('admin.system.storage.link') }}" method="POST" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-outline-dark btn-lg px-4 font-weight-bold" style="border-radius: 8px;">
                                <i class="fas fa-link mr-2"></i> Fix Storage Link
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="row">
                {{-- Cache Sections --}}
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 12px;">
                        <div class="card-body p-4 text-center">
                            <i class="fas fa-database fa-3x text-primary mb-3"></i>
                            <h4 class="font-weight-bold">App Cache</h4>
                            <p class="small text-muted">Clear the general application data cache.</p>
                            <form action="{{ route('admin.system.cache.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-primary btn-block py-2 font-weight-bold" style="border-radius: 8px;">
                                    Clear Cache
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 12px;">
                        <div class="card-body p-4 text-center">
                            <i class="fas fa-cog fa-3x text-info mb-3"></i>
                            <h4 class="font-weight-bold">Config Cache</h4>
                            <p class="small text-muted">Reload configuration files from .env and config/.</p>
                            <form action="{{ route('admin.system.config.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-info text-white btn-block py-2 font-weight-bold" style="border-radius: 8px;">
                                    Clear Config
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 12px;">
                        <div class="card-body p-4 text-center">
                            <i class="fas fa-route fa-3x text-success mb-3"></i>
                            <h4 class="font-weight-bold">Route Cache</h4>
                            <p class="small text-muted">Clear the cached route definitions.</p>
                            <form action="{{ route('admin.system.route.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-success btn-block py-2 font-weight-bold" style="border-radius: 8px;">
                                    Clear Routes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 12px;">
                        <div class="card-body p-4 text-center">
                            <i class="fas fa-file-code fa-3x text-warning mb-3"></i>
                            <h4 class="font-weight-bold">View Cache</h4>
                            <p class="small text-muted">Clear the compiled Blade templates.</p>
                            <form action="{{ route('admin.system.view.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-warning text-white btn-block py-2 font-weight-bold" style="border-radius: 8px;">
                                    Clear Views
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {{-- Media Regeneration --}}
                <div class="col-md-12">
                    <div class="card shadow-sm border-0 mb-4 bg-light" style="border-radius: 12px; border: 1px dashed #ced4da !important;">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <i class="fas fa-images fa-4x text-indigo opacity-75"></i>
                                </div>
                                <div class="col-md-7">
                                    <h4 class="font-weight-bold mb-1">Image Conversions</h4>
                                    <p class="text-muted small mb-0">
                                        Regenerate missing thumbnails and responsive versions for all 250+ images. 
                                        This runs in the <strong>background</strong> via your queue worker.
                                    </p>
                                </div>
                                <div class="col-md-3 text-right">
                                    <form action="{{ route('admin.system.media.regenerate') }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn btn-indigo px-4 py-2 font-weight-bold" style="border-radius: 8px;">
                                            Regenerate Now
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Sidebar Info --}}
        <div class="col-md-4">
            <div class="card bg-gradient-dark shadow-sm border-0" style="border-radius: 12px;">
                <div class="card-body p-4">
                    <h5 class="font-weight-bold mb-3"><i class="fas fa-info-circle mr-2 text-warning"></i> Maintenance Guide</h5>
                    <p class="small opacity-75">
                        These tools allow you to manage the core buffers of your Laravel application. Use them when you encounter:
                    </p>
                    <ul class="small pl-3 opacity-75">
                        <li class="mb-2">Changes in <code>.env</code> not reflecting on the site.</li>
                        <li class="mb-2">Broken images (Missing <code>storage</code> link).</li>
                        <li class="mb-2">New routes returning 404 errors.</li>
                        <li class="mb-2">UI changes in Blade files not appearing.</li>
                    </ul>
                    <hr class="border-secondary">
                    <div class="p-3 bg-dark-light rounded small">
                        <i class="fas fa-terminal mr-2"></i> Environment: <strong>{{ strtoupper(config('app.env')) }}</strong><br>
                        <i class="fas fa-clock mr-2"></i> Timezone: <strong>{{ config('app.timezone') }}</strong>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-light border mt-4 shadow-sm" style="border-radius: 12px;">
                <h6 class="font-weight-bold mb-2"><i class="fas fa-shield-alt mr-2 text-primary"></i> Safe Mode</h6>
                <p class="small mb-0 text-muted">
                    Cleaning caches is safe and will not affect your database data. It may temporarily slow down initial page loads while buffers are rebuilt.
                </p>
            </div>
        </div>
    </div>
@stop

@section('css')
    <style>
        .card { transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .bg-dark-light { background: rgba(255,255,255,0.05); }
        .opacity-75 { opacity: 0.75; }
    </style>
@stop
