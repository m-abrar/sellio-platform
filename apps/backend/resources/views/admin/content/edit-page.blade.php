{{--
    Administrative Content: High-Fidelity Page Orchestration
    
    This view serves as the primary engine for configuring dynamic 
    page content across the active platform architecture. It 
    facilitates section-based content grouping, asset deployment 
    (images, color palettes, textual strings), and global content 
    synchronization. It ensures that content updates adhere to the 
    defined theme tokens and layout protocols.
    
    @extends adminlte::page
    @context Content Management Module
    @variables Collection $settings Grouped collection of PageContent models.
    @variables String $theme_key The active architectural theme identifier.
    @variables String $page The specific page context being managed.
--}}
@extends('adminlte::page')

{{-- Professional Title following the Executive Persona --}}
@section('title', 'Content Engine | ' . Str::of($theme_key)->replace('_', ' ')->title())

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary opacity-50"></i> Content Engine: {{ ucfirst($page) }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    <i class="fas fa-palette mr-1 text-primary"></i> Theme Architecture | {{ Str::of($theme_key)->replace('_', ' ')->title() }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button', ['route' => 'admin.content.index', 'label' => 'FLEET MANAGER'])
            </div>
        </div>
    </div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form method="POST" action="{{ route('admin.content.bulk_update') }}" enctype="multipart/form-data">
        @csrf

        <div class="row">
            {{-- MAIN CONFIGURATION AREA --}}
            <div class="col-md-8">
                {{-- Loop through settings grouped by section --}}
                @foreach ($settings as $sectionName => $sectionSettings)
                    <div class="card card-premium border-0 shadow-premium overflow-hidden mb-5">
                        <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark text-uppercase small mb-0" style="letter-spacing: 1px;">
                                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> {{ str_replace('_', ' ', $sectionName) }} Configuration
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover table-premium align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th style="width: 35%" class="border-0 text-uppercase small font-weight-bold text-muted px-4 py-3">Property</th>
                                            <th style="width: 65%" class="border-0 text-uppercase small font-weight-bold text-muted px-4 py-3">Value / Asset</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($sectionSettings as $item)
                                            <tr class="transition-all">
                                                <td class="px-4 py-4 border-0">
                                                    <div class="d-flex align-items-center">
                                                        <div class="icon-square bg-light text-primary mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 10px;">
                                                            <i class="fas {{ $item->input_type === 'textarea' ? 'fa-align-left' : ($item->input_type === 'image' ? 'fa-image' : 'fa-pen-fancy') }}"></i>
                                                        </div>
                                                        <div>
                                                            <span class="d-block font-weight-bold text-dark">
                                                                {{ Str::of($item->content_key)->replace('_', ' ')->title() }}
                                                            </span>
                                                            <small class="text-muted text-uppercase" style="font-size: 10px;">{{ $item->input_type }}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-4 border-0">
                                                    @include('admin.content._partials._editor_input_factory', ['item' => $item])
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- SIDEBAR CONTROL PANEL --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px;">
                    {{-- Deployment Intelligence --}}
                    <div class="card card-premium border-0 shadow-premium overflow-hidden mb-4">
                        <div class="card-header bg-dark py-3 px-4 border-0 d-flex align-items-center" style="background: #0f172a !important; border-bottom: 3px solid var(--primary) !important;">
                            <h3 class="card-title text-white font-weight-bold text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                                <i class="fas fa-rocket mr-2 text-primary"></i> Protocol & Actions
                            </h3>
                        </div>
                        <div class="card-body bg-white py-4 px-4">
                             <div class="mb-4 pb-2 border-bottom">
                                <label class="d-block smallest font-weight-bold text-muted mb-2 text-uppercase letter-spacing-1">Active Architecture</label>
                                <span class="badge badge-primary-light text-primary px-3 py-2 font-weight-bold rounded-pill" style="font-size: 0.7rem;">
                                    <i class="fas fa-palette mr-1"></i> {{ strtoupper(str_replace('_', ' ', $theme_key)) }}
                                </span>
                             </div>

                             <div class="action-buttons-group">
                                <button type="submit" class="btn btn-primary btn-block rounded-pill font-weight-bold py-3 smallest mb-3 uppercase letter-spacing-1">
                                    <i class="fas fa-save mr-2"></i> DEPLOY GLOBAL CONTENT
                                </button>
                                
                                <a href="{{ route('admin.content.index') }}" class="btn btn-light btn-block rounded-pill font-weight-bold smallest py-2 text-muted border uppercase">
                                     <i class="fas fa-times mr-1"></i> Cancel Changes
                                 </a>
                             </div>
                        </div>
                        <div class="card-footer bg-light border-0 text-center py-2">
                            <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                <i class="fas fa-info-circle mr-1 text-info"></i> Protocol: Production Mode
                            </small>
                        </div>
                    </div>

                    {{-- Performance Tip --}}
                    <div class="card border-0 shadow-premium mb-4" style="border-radius: 16px; background: rgba(var(--primary-rgb), 0.03);">
                        <div class="card-body p-4 d-flex align-items-center">
                            <div class="icon-circle bg-white shadow-xs text-primary mr-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; min-width: 44px; border-radius: 12px;">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <p class="mb-0 smallest font-weight-bold text-dark uppercase letter-spacing-1 opacity-75" style="line-height: 1.4;">
                                Assets are automatically optimized upon deployment to ensure peak platform velocity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
