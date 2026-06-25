{{--
    Administrative Financial Module: Payment Provider Configuration
    
    This view serves as the primary Dashboard for individual payment 
    gateway management. It orchestrates environment toggling (live/sandbox), 
    activation status, and complex credential persistence across multiple 
    deployment contexts, ensuring secure and reliable financial handshakes 
    between the platform and third-party processors.
    
    @extends adminlte::page
    @context Financial Management
    @variables PaymentGateway $gateway The payment gateway model instance.
    @variables Array $liveConfig Decrypted production credentials.
    @variables Array $sandboxConfig Decrypted testing credentials.
    @variables Collection $blueprints Schema definitions for gateway inputs.
--}}
@extends('adminlte::page')

@section('title', 'Configure ' . $gateway->title)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-credit-card mr-2 text-primary"></i> 
                    Configure {{ $gateway->title }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Adjusting gateway credentials, operational modes, and security handshakes.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button', ['route' => 'admin.payment-gateways.index', 'label' => 'PROVIDERS'])
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ route('admin.payment-gateways.update', $gateway->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Connection Logic</h3>
                    </div>
                    <div class="card-body p-4">
                        {{-- Global Status Controls --}}
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="font-weight-600 small text-muted text-uppercase mb-2 d-block">Operational Mode</label>
                                <select name="mode" id="mode" class="form-control form-control-lg @error('mode') is-invalid @enderror" style="border-radius: 12px;">
                                    <option value="sandbox" {{ old('mode', $gateway->mode) === 'sandbox' ? 'selected' : '' }}>
                                        Sandbox (Testing Environment)
                                    </option>
                                    <option value="live" {{ old('mode', $gateway->mode) === 'live' ? 'selected' : '' }}>
                                        Live (Production Environment)
                                    </option>
                                </select>
                                @error('mode') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-6 d-flex align-items-center pt-4">
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="activeSwitch" name="is_active" value="1" 
                                           {{ old('is_active', $gateway->is_active) ? 'checked' : '' }} />
                                    <label class="custom-control-label font-weight-bold text-dark" for="activeSwitch">
                                        {{ $gateway->is_active ? 'ENABLED' : 'DISABLED' }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr class="my-4">

                        {{-- Tabbed Configuration Forms (Live vs. Sandbox) --}}
                        <ul class="nav nav-pills mb-4 shadow-xs p-1 bg-light rounded-pill" id="configTabs" role="tablist" style="width: fit-content;">
                            <li class="nav-item">
                                <a class="nav-link active rounded-pill px-4 font-weight-bold small text-uppercase" data-toggle="pill" href="#live-config">
                                    <i class="fas fa-lock mr-2"></i> Live Credentials
                                </a>
                            </li>
                            <li class="nav-item mx-1">
                                <a class="nav-link rounded-pill px-4 font-weight-bold small text-uppercase" data-toggle="pill" href="#sandbox-config">
                                    <i class="fas fa-flask mr-2"></i> Sandbox
                                </a>
                            </li>
                        </ul>

                        <div class="tab-content" id="custom-tabs-content">
                            {{-- Live Tab Content --}}
                            <div class="tab-pane fade show active" id="live-config" role="tabpanel">
                                @include('admin.payment-gateways._config_form', [
                                    'config' => $liveConfig, 
                                    'environment' => 'live',
                                    'blueprints' => $blueprints 
                                ])
                            </div>
                            {{-- Sandbox Tab Content --}}
                            <div class="tab-pane fade" id="sandbox-config" role="tabpanel">
                                @include('admin.payment-gateways._config_form', [
                                    'config' => $sandboxConfig, 
                                    'environment' => 'sandbox',
                                    'blueprints' => $blueprints
                                ])
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0 py-4 px-4 text-right">
                        <button type="submit" class="btn btn-primary rounded-pill px-5 font-weight-bold text-uppercase letter-spacing-1">
                            <i class="fas fa-save mr-2"></i> Commit Provider Configuration
                        </button>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> View Details
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3 pb-3 border-bottom">
                            <label class="smallest text-muted font-weight-bold text-uppercase d-block mb-1">Service Class</label>
                            <code class="text-primary small font-weight-bold">{{ $gateway->class_name }}</code>
                        </div>
                        <div class="mb-0">
                            <label class="smallest text-muted font-weight-bold text-uppercase d-block mb-1">System ID (Slug)</label>
                            <code class="text-dark small font-weight-bold">{{ $gateway->slug }}</code>
                            <p class="text-muted smallest mt-2 mb-0">Use this identifier to reference this provider in custom checkout logic or billing middleware.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('css')
<style>
    .nav-pills .nav-link.active { background-color: var(--primary) !important; color: #fff !important; }
    .nav-pills .nav-link:not(.active) { color: var(--dark-muted); }
</style>
@endpush

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('form[action*="payment-gateways"]');
        const modeSelect = document.getElementById('mode');

        if (!form || !modeSelect) {
            return;
        }

        const syncInactiveEnvironmentInputs = () => {
            const activeEnvironment = modeSelect.value === 'live' ? 'live' : 'sandbox';

            form.querySelectorAll('[data-gateway-config-input]').forEach((input) => {
                const isActive = input.dataset.gatewayEnvironment === activeEnvironment;
                input.disabled = !isActive;
            });
        };

        modeSelect.addEventListener('change', syncInactiveEnvironmentInputs);
        form.addEventListener('submit', syncInactiveEnvironmentInputs);
        syncInactiveEnvironmentInputs();
    });
</script>
@endpush
