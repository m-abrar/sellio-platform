{{--
    Administrative Infrastructure Module: System Maintenance Interface
    
    This view serves as the primary orchestration layer for low-level 
    platform optimizations. It facilitates the purging of application, 
    configuration, route, and view caches, while providing tools for 
    storage link verification and media conversion regeneration.
    
    @extends adminlte::page
    @context Infrastructure Management
    @variables None.
--}}
@extends('adminlte::page')

@section('title', 'System Maintenance | Admin Ops')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tools mr-2 text-primary opacity-50"></i> 
                    {{ __('System Maintenance') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Optimize engines, purge system buffers, and synchronize platform assets.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- System Maintenance Greeting --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden rounded-24">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-primary d-flex align-items-center justify-content-center shadow-premium-lg icon-box-100 rounded-20 opacity-90">
                    <i class="fas fa-terminal text-white fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">{{ __('Core Infrastructure Maintenance') }}</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">{{ __('Execute foundational optimizations, atomic cache purging, and platform integrity checks.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        {{-- Main Operations Column --}}
        <div class="col-md-8">
            <div class="card border-0 shadow-premium overflow-hidden mb-4 rounded-24">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                    <h3 class="card-title-main">
                        <i class="fas fa-cogs mr-1 text-primary opacity-50"></i> {{ __('Foundational Optimization') }}
                    </h3>
                </div>
                <div class="card-body p-4">
                    <div class="d-flex align-items-start mb-4 p-3 rounded-xl bg-primary-soft border border-primary-soft">
                        <div class="icon-box-soft bg-white text-primary mr-3 shadow-xs icon-box-52 rounded-14 d-flex align-items-center justify-content-center font-1-2">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <div>
                            <p class="text-dark small mb-0 leading-1-6">
                                {{ __('Running optimization will clear all existing caches and regenerate configuration, route, and view caches for maximum performance. Recommended after environment updates.') }}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap align-items-center">
                        <form action="{{ route('admin.system.optimize') }}" method="POST" class="mr-3 mb-2">
                            @csrf
                            <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 font-weight-bold small min-w-220 h-48-p">
                                <i class="fas fa-bolt mr-2"></i> {{ __('Optimize & Cache All') }}
                            </button>
                        </form>
                        <form action="{{ route('admin.system.storage.link') }}" method="POST" class="mb-2">
                            @csrf
                            <button type="submit" class="btn btn-outline-dark rounded-pill px-5 py-2 font-weight-bold small min-w-220 h-48-p">
                                <i class="fas fa-link mr-2"></i> {{ __('Fix Storage Link') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="row">
                @php
                    $cacheItems = [
                        ['id' => 'cache', 'icon' => 'fa-database', 'title' => __('App Cache'), 'color' => 'primary', 'desc' => __('General data cache.')],
                        ['id' => 'config', 'icon' => 'fa-cog', 'title' => __('Config Cache'), 'color' => 'info', 'desc' => __('Environment variables.')],
                        ['id' => 'route', 'icon' => 'fa-route', 'title' => __('Route Cache'), 'color' => 'success', 'desc' => __('URL definitions.')],
                        ['id' => 'view', 'icon' => 'fa-file-code', 'title' => __('View Cache'), 'color' => 'warning', 'desc' => __('Compiled templates.')],
                    ];
                @endphp

                @foreach($cacheItems as $item)
                <div class="col-md-6 mb-4">
                    <div class="card h-100 border-0 shadow-premium overflow-hidden rounded-20">
                        <div class="card-body p-4 text-center">
                            <div class="icon-circle bg-{{ $item['color'] }}-soft text-{{ $item['color'] }} mx-auto mb-3 shadow-xs icon-box-60 rounded-18 d-flex align-items-center justify-content-center font-1-5">
                                <i class="fas {{ $item['icon'] }}"></i>
                            </div>
                            <h5 class="font-weight-bold text-dark mb-1">{{ $item['title'] }}</h5>
                            <p class="smallest text-muted mb-3">{{ $item['desc'] }}</p>
                            <form action="{{ route('admin.system.' . $item['id'] . '.clear') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-{{ $item['color'] }}-soft btn-purge rounded-pill px-5 font-weight-bold small h-44-p min-w-160">
                                    <i class="fas fa-trash-alt mr-1"></i> {{ __('Purge') }} {{ strtoupper($item['id']) }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                @endforeach

                <div class="col-md-12">
                    <div class="card border-0 shadow-premium mb-4 rounded-24 border-dashed-primary">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <div class="icon-circle bg-primary-soft text-primary mx-auto mb-3 mb-md-0 shadow-xs icon-box-70 rounded-20 d-flex align-items-center justify-content-center font-1-8">
                                        <i class="fas fa-images"></i>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <h5 class="font-weight-bold text-dark mb-1">{{ __('Image Conversions') }}</h5>
                                    <p class="text-muted smallest mb-0">
                                        {{ __('Regenerate missing thumbnails and responsive versions. This operation executes in the background via the') }} <strong>{{ __('async queue worker') }}</strong>.
                                    </p>
                                </div>
                                <div class="col-md-3 text-right">
                                    <form action="{{ route('admin.system.media.regenerate') }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 font-weight-bold small h-48-p min-w-180">
                                            <i class="fas fa-sync-alt mr-1"></i> {{ __('Regenerate') }}
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
            <div class="card border-0 shadow-premium bg-dark mb-4 overflow-hidden rounded-24">
                <div class="card-body p-4 position-relative z-1">
                    <div class="guide-bg-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h5 class="font-weight-bold text-white mb-3 small text-uppercase ls-1-p">
                        <i class="fas fa-info-circle mr-2 text-warning"></i> {{ __('Operational Guide') }}
                    </h5>
                    <p class="smallest text-light mb-3 font-weight-bold uppercase leading-1-6 opacity-75">
                        {{ __('These tools manage the platform\'s foundational buffers. Use them to resolve:') }}
                    </p>
                    <ul class="smallest text-light pl-3 mb-4 font-weight-bold uppercase leading-1-6 list-none opacity-75">
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> {{ __('Environment (.env) sync issues') }}</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> {{ __('Broken media or symlinks') }}</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> {{ __('Routing conflicts or missing keys') }}</li>
                        <li class="mb-2"><i class="fas fa-check-circle mr-2 text-success"></i> {{ __('Compiled template legacy issues') }}</li>
                    </ul>
                    <div class="p-3 rounded-xl smallest" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-light opacity-75 uppercase font-weight-bold">{{ __('Environment') }}</span>
                            <span class="font-weight-bold text-warning text-uppercase letter-spacing-1 ls-1-p">{{ config('app.env') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-light opacity-75 uppercase font-weight-bold">{{ __('Timezone') }}</span>
                            <span class="font-weight-bold text-white uppercase">{{ config('app.timezone') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-premium overflow-hidden rounded-20">
                <div class="card-body p-4 d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-shield-alt fa-2x text-primary opacity-25"></i>
                    </div>
                    <div>
                        <h6 class="font-weight-bold text-dark mb-1">{{ __('Atomic Operations') }}</h6>
                        <p class="smallest text-muted mb-0">{{ __('Cleaning buffers is safe and does not modify database records.') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
    <script>
        $(function() {
            // Premium Swal Configuration
            const premiumSwal = {
                backdrop: `rgba(15, 23, 42, 0.2)`,
                borderRadius: '32px',
                buttonsStyling: false,
                customClass: {
                    popup: 'border-0',
                    title: 'swal2-title',
                    htmlContainer: 'text-muted small uppercase letter-spacing-1 font-weight-bold opacity-75 mt-3',
                    confirmButton: 'btn btn-primary rounded-pill px-5 py-3 mx-2 swal2-confirm',
                    cancelButton: 'btn btn-light rounded-pill px-5 py-3 mx-2 swal2-cancel'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                }
            };

            // Success Alerts
            @if(session('success'))
                Swal.fire({
                    ...premiumSwal,
                    icon: 'success',
                    title: 'SYSTEM INTELLIGENCE',
                    text: "{{ session('success') }}",
                    iconColor: '#46a5ac',
                });
            @endif

            // Error Alerts
            @if(session('error'))
                Swal.fire({
                    ...premiumSwal,
                    icon: 'error',
                    title: 'MISSION INTERRUPTED',
                    text: "{{ session('error') }}",
                    iconColor: '#ef4444',
                });
            @endif

            // AJAX Execution for Maintenance Tasks
            $('.btn-purge, button[type="submit"]').on('click', function(e) {
                const $button = $(this);
                const $form = $button.closest('form');
                const actionName = $button.text().trim();
                const url = $form.attr('action');
                const method = $form.attr('method') || 'POST';
                
                if ($button.hasClass('btn-back')) return;

                e.preventDefault();

                Swal.fire({
                    ...premiumSwal,
                    title: "{{ __('AUTHORIZE OPERATION?') }}",
                    text: `{{ __('SYSTEM WILL EXECUTE:') }} ${actionName}. {{ __('PROCEED WITH CAUTION.') }}`,
                    icon: 'warning',
                    iconColor: '#f59e0b',
                    showCancelButton: true,
                    confirmButtonText: "{{ __('Execute Action') }}",
                    cancelButtonText: "{{ __('Abort Mission') }}",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Show Loading State
                        Swal.fire({
                            ...premiumSwal,
                            title: "{{ __('EXECUTING...') }}",
                            text: "{{ __('Please wait while the system optimizes foundational buffers.') }}",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        $.ajax({
                            url: url,
                            type: method,
                            data: $form.serialize(),
                            success: function(response) {
                                Swal.fire({
                                    ...premiumSwal,
                                    icon: 'success',
                                    title: "{{ __('SYSTEM INTELLIGENCE') }}",
                                    text: "{{ __('OPERATION COMPLETED SUCCESSFULLY.') }}",
                                    iconColor: '#46a5ac',
                                });
                            },
                            error: function(xhr) {
                                const errorMsg = xhr.responseJSON?.message || 'AN UNKNOWN ERROR OCCURRED DURING EXECUTION.';
                                Swal.fire({
                                    ...premiumSwal,
                                    icon: 'error',
                                    title: "{{ __('MISSION INTERRUPTED') }}",
                                    text: errorMsg.toUpperCase(),
                                    iconColor: '#ef4444',
                                });
                            }
                        });
                    }
                });
            });
        });
    </script>
@stop
