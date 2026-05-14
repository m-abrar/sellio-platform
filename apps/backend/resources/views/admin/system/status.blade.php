{{--
    Administrative Infrastructure Module: System Health Diagnostics
    
    This view provides a comprehensive operational audit of the server 
    environment. It facilitates the verification of PHP extensions, 
    directory write permissions, and global environment integrity, 
    calculating an aggregate health score for platform stability.
    
    @extends adminlte::page
    @context Infrastructure Management
    @variables Array $requirements Array of server requirement status data.
    @variables Array $permissions Array of directory permission status data.
--}}
@extends('adminlte::page')

@section('title', __('System Health & Requirements'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-heartbeat mr-2 text-primary opacity-50"></i> 
                    {{ __('System Health & Requirements') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Diagnostics for platform stability, server requirements, and environment integrity.') }}
                </p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        {{-- Server Requirements --}}
        <div class="col-md-8">
            <div class="card border-0 shadow-premium overflow-hidden mb-4 rounded-24">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                        <i class="fas fa-server mr-2 text-primary opacity-50"></i> {{ __('Server Requirements') }}
                    </h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th class="px-4">{{ __('Requirement') }}</th>
                                    <th>{{ __('Detected Value') }}</th>
                                    <th class="text-right px-4">{{ __('Status') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($requirements as $label => $data)
                                    <tr>
                                        <td class="align-middle px-4">
                                            <span class="font-weight-bold text-dark small text-uppercase letter-spacing-1">{{ $label }}</span>
                                        </td>
                                        <td class="align-middle">
                                            <span class="text-muted smallest font-weight-bold uppercase text-monospace">
                                                {{ $data['value'] ?? ($data['met'] ? __('Installed') : __('Missing')) }}
                                            </span>
                                        </td>
                                        <td class="text-right align-middle px-4">
                                            @if($data['met'])
                                                <span class="badge badge-success-light px-3 py-1 rounded-pill smallest text-uppercase">
                                                    <i class="fas fa-check-circle mr-1"></i> {{ __('Pass') }}
                                                </span>
                                            @else
                                                <span class="badge badge-danger-light px-3 py-1 rounded-pill smallest text-uppercase">
                                                    <i class="fas fa-times-circle mr-1"></i> {{ __('Fail') }}
                                                </span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {{-- Directory Permissions --}}
            <div class="card border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                        <i class="fas fa-folder-open mr-2 text-primary opacity-50"></i> {{ __('Directory Permissions') }}
                    </h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr>
                                    <th class="px-4">{{ __('Directory / File') }}</th>
                                    <th class="text-right px-4">{{ __('Writable Status') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($permissions as $label => $data)
                                    <tr>
                                        <td class="align-middle px-4">
                                            <span class="font-weight-bold text-dark small">{{ $label }}</span>
                                            <div class="smallest text-muted text-monospace mt-1">{{ $data['path'] }}</div>
                                        </td>
                                        <td class="text-right align-middle px-4">
                                            @if($data['met'])
                                                <span class="badge badge-success-light px-3 py-1 rounded-pill smallest text-uppercase">
                                                    <i class="fas fa-lock-open mr-1"></i> {{ __('Writable') }}
                                                </span>
                                            @else
                                                <span class="badge badge-danger-light px-3 py-1 rounded-pill smallest text-uppercase">
                                                    <i class="fas fa-lock mr-1"></i> {{ __('Locked') }}
                                                </span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        {{-- Sidebar Diagnostics --}}
        <div class="col-md-4">
            <div class="card border-0 shadow-premium bg-dark mb-4 overflow-hidden rounded-24">
                <div class="card-body p-4 position-relative z-1">
                    <h5 class="font-weight-bold text-white mb-3 small text-uppercase ls-1-p">
                        <i class="fas fa-stethoscope mr-2 text-warning"></i> {{ __('Platform Intelligence') }}
                    </h5>
                    <p class="smallest text-light mb-4 font-weight-bold uppercase leading-1-6 opacity-75">
                        {{ __('System health reflects the stability of the underlying architecture. Any "Fail" markers should be addressed immediately with your server administrator.') }}
                    </p>
                    
                    <div class="p-4 rounded-20 mb-4 glass-panel-dark">
                        <div class="text-center">
                            @php
                                $totalReqs = count($requirements) + count($permissions);
                                $metReqs = collect($requirements)->where('met', true)->count() + collect($permissions)->where('met', true)->count();
                                $healthScore = round(($metReqs / $totalReqs) * 100);
                                $healthColor = $healthScore >= 90 ? 'text-success' : ($healthScore >= 70 ? 'text-warning' : 'text-danger');
                            @endphp
                            <h2 class="font-weight-bold {{ $healthColor }} mb-0">{{ $healthScore }}%</h2>
                            <span class="smallest text-light uppercase font-weight-bold ls-1-p">{{ __('Aggregate Health Score') }}</span>
                        </div>
                    </div>

                    <a href="{{ route('admin.system.maintenance') }}" class="btn btn-primary btn-block rounded-pill py-2 font-weight-bold small shadow-sm">
                        <i class="fas fa-tools mr-1"></i> {{ __('ACCESS MAINTENANCE') }}
                    </a>
                </div>
            </div>

            <div class="card border-0 shadow-premium overflow-hidden rounded-20">
                <div class="card-body p-4">
                    <h6 class="font-weight-bold text-dark mb-3 small text-uppercase ls-1-p">{{ __('Environment Details') }}</h6>
                    <div class="smallest">
                        <div class="d-flex justify-content-between mb-3 border-bottom pb-2 border-light">
                            <span class="text-muted uppercase font-weight-bold">{{ __('Environment') }}</span>
                            <span class="font-weight-bold text-dark uppercase letter-spacing-1">{{ config('app.env') }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 border-bottom pb-2 border-light">
                            <span class="text-muted uppercase font-weight-bold">{{ __('App Name') }}</span>
                            <span class="font-weight-bold text-dark">{{ config('app.name') }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 border-bottom pb-2 border-light">
                            <span class="text-muted uppercase font-weight-bold">{{ __('Debug Mode') }}</span>
                            <span class="font-weight-bold {{ config('app.debug') ? 'text-danger' : 'text-success' }} uppercase">{{ config('app.debug') ? __('ACTIVE') : __('DISABLED') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection


