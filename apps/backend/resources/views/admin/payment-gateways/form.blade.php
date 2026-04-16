@extends('adminlte::page')

@section('title', 'Configure ' . $gateway->title)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Configure {{ $gateway->title }} Gateway
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

{{-- NOTE: Action uses the explicit route name defined in routes/admin.php --}}
<form action="{{ route('admin.payment-gateways.update', $gateway->id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="row">
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header border-0 bg-white py-3">
                    <h3 class="card-title">Connection Settings</h3>
                </div>
                <div class="card-body">

                    {{-- 1. Global Status Controls --}}
                    <div class="form-group row">
                        <label class="col-sm-3 col-form-label">Gateway Status</label>
                        <div class="col-sm-9 pt-2">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="activeSwitch" name="is_active" value="1" 
                                       {{ old('is_active', $gateway->is_active) ? 'checked' : '' }} />
                                <label class="custom-control-label" for="activeSwitch">
                                    {{ $gateway->is_active ? 'ENABLED (Transactions are LIVE/Sandbox)' : 'DISABLED' }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="mode" class="col-sm-3 col-form-label">Operational Mode</label>
                        <div class="col-sm-9">
                            <select name="mode" id="mode" class="form-control @error('mode') is-invalid @enderror">
                                <option value="sandbox" {{ old('mode', $gateway->mode) === 'sandbox' ? 'selected' : '' }}>
                                    Sandbox (Testing Mode)
                                </option>
                                <option value="live" {{ old('mode', $gateway->mode) === 'live' ? 'selected' : '' }}>
                                    Live (Production Mode)
                                </option>
                            </select>
                            @error('mode') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <hr>

                    {{-- 2. Tabbed Configuration Forms (Live vs. Sandbox) --}}
                    <ul class="nav nav-tabs" id="configTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-toggle="pill" href="#live-config">
                                <i class="fas fa-lock"></i> Live Credentials
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-toggle="pill" href="#sandbox-config">
                                <i class="fas fa-flask"></i> Sandbox Credentials
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content" id="custom-tabs-content">
                        {{-- Live Tab Content --}}
                        <div class="tab-pane fade show active" id="live-config" role="tabpanel">
                            @include('admin.payment-gateways._config_form', [
                                'config' => $liveConfig, 
                                'environment' => 'live',
                                'blueprints' => $blueprints // Pass the blueprint
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
                <div class="card-footer text-right">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save {{ $gateway->title }} Configuration
                    </button>
                    <a href="{{ route('admin.payment-gateways.index') }}" class="btn btn-default">
                        Cancel
                    </a>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card card-outline card-info">
                <div class="card-header"><h3 class="card-title">Gateway Information</h3></div>
                <div class="card-body">
                    <p><strong>Service Class:</strong> <code>{{ $gateway->class_name }}</code></p>
                    <p><strong>Slug:</strong> <code>{{ $gateway->slug }}</code></p>
                    <p class="text-muted">Use the slug to reference this gateway in your application logic (e.g., when resolving the service).</p>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('css')
    
@endsection
