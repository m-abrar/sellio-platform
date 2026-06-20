{{--
    Administrative Financial Module: Payment Provider Registry
    
    This view provides the authoritative Dashboard for managing 
    platform-wide financial processors and transaction gateways. It 
    aggregates provider identities, operational environments (live/sandbox), 
    and lifecycle statuses, facilitating secure auditing and moderation 
    of the platform's integration ledger.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $gateways Collection of PaymentGateway model instances.
--}}
@extends('adminlte::page')

@section('title', 'Payment Gateways')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-wallet mr-2 text-primary opacity-50"></i> Payment Gateways
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage platform-wide financial processors and secure transaction gateways.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Financial Security Protocol --}}
    <div class="card border-0 shadow-premium mb-4 overflow-hidden rounded-20">
        <div class="card-body p-0">
            <div class="d-flex align-items-center p-3">
                <div class="bg-success d-flex align-items-center justify-content-center shadow-premium-lg icon-box-100 rounded-20 opacity-90">
                    <i class="fas fa-shield-alt text-white fa-2x"></i>
                </div>
                <div class="px-4">
                    <h5 class="mb-1 font-weight-bold text-dark">Transaction Security Protocol</h5>
                    <p class="mb-0 text-muted smallest font-weight-bold text-uppercase letter-spacing-1">All API keys are encrypted at rest. Switch to <span class="text-success font-weight-bold">Live Mode</span> only after verifying sandbox handshakes.</p>
                </div>
            </div>
        </div>
    </div>

    

    {{-- Installed Processors Card --}}
    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-network-wired mr-2 text-primary opacity-50"></i> Active Gateways
            </h5>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-plug mr-1"></i> {{ $gateways->count() }} CONNECTED
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="gateways-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "lengthChange": false, "searching": true, "ordering": true, "info": false, "autoWidth": false, "responsive": true}'>
                    <thead>
                        <tr>
                            <th class="pl-4">Gateway & Integration</th>
                            <th>Technical Identifier</th>
                            <th class="text-center">Environment</th>
                            <th class="text-center">Lifecycle</th>
                            <th class="text-right pr-4">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($gateways as $gateway)
                            <tr>
                                <td class="pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square-premium mr-3">
                                            <i class="fas fa-network-wired text-muted opacity-75"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 uppercase letter-spacing-1">{{ $gateway->title ?? 'Unknown Gateway' }}</span>
                                            <small class="text-muted font-weight-bold text-uppercase opacity-75 smallest-0-65 ls-0-5">{{ $gateway->class_name }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <code class="premium-code text-primary">{{ $gateway->slug ?? 'N/A' }}</code>
                                </td>
                                <td class="align-middle text-center">
                                    @if($gateway->mode === 'live')
                                        <span class="badge badge-success-soft border border-success text-success px-3 py-1 text-uppercase smallest-0-65 ls-0-5">
                                            <i class="fas fa-bolt mr-1"></i> Live
                                        </span>
                                    @else
                                        <span class="badge badge-warning-soft border border-warning text-warning px-3 py-1 text-uppercase smallest-0-65 ls-0-5">
                                            <i class="fas fa-flask mr-1"></i> Sandbox
                                        </span>
                                    @endif
                                </td>
                                <td class="align-middle text-center">
                                    @if($gateway->is_active)
                                        <span class="badge badge-success-soft border border-success text-success px-3 py-1 rounded-20 smallest-0-7 ls-0-5">
                                            <i class="fas fa-check-circle mr-1"></i> ACTIVE
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft border border-secondary text-secondary px-3 py-1 rounded-20 smallest-0-7 ls-0-5">
                                            <i class="fas fa-times-circle mr-1"></i> INACTIVE
                                        </span>
                                    @endif
                                </td>
                                <td class="text-right pr-4">
                                    <a href="{{ route('admin.payment-gateways.edit', $gateway->id) }}" 
                                       class="btn btn-premium-soft btn-premium-soft-primary">
                                        <i class="fas fa-cog mr-1"></i> Configure
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <i class="fas fa-credit-card fa-4x text-light mb-3"></i>
                                    <h5 class="text-muted font-weight-bold">No Processors Detected</h5>
                                    <p class="small text-secondary">Registered gateways will appear here once seeded into the environment.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4">
             <div class="d-flex justify-content-between align-items-center">
                 <p class="mb-0 text-muted smallest font-weight-bold uppercase letter-spacing-1"><i class="fas fa-info-circle mr-1 text-info"></i> SECURE Financial Tier: Level 4 Active</p>
                 <span class="badge badge-light border smallest px-3 py-1 font-weight-bold uppercase">PROCESSORS: {{ $gateways->count() }}</span>
             </div>
        </div>
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
