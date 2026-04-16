@extends('adminlte::page')

@section('title', 'Payment Gateways')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-wallet mr-2 text-primary"></i> Payment Gateways
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Payment Gateways</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Information Alert for Financial Security --}}
    <div class="card bg-white border-0 shadow-sm mb-4 overflow-hidden" style="border-radius: 10px;">
        <div class="card-body p-0">
            <div class="d-flex">
                <div class="bg-success px-4 d-flex align-items-center">
                    <i class="fas fa-shield-alt text-white fa-2x"></i>
                </div>
                <div class="p-3">
                    <h6 class="mb-1 font-weight-bold text-dark">Transaction Security Protocol</h6>
                    <p class="mb-0 text-muted small">All API keys are encrypted at rest. Switch to <span class="badge badge-success px-2 py-0">Live Mode</span> only after verifying sandbox transactions in the debugger.</p>
                </div>
            </div>
        </div>
    </div>

    

    {{-- Installed Processors Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">Installed Processors</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="gateways-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">Gateway & Integration</th>
                            <th>Identifier</th>
                            <th class="text-center">Environment</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($gateways as $gateway)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square mr-3 bg-light border d-flex align-items-center justify-content-center shadow-xs" style="width:48px; height:48px; border-radius: 12px;">
                                            <i class="fas fa-network-wired text-muted"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $gateway->title ?? 'Unknown Gateway' }}</span>
                                            <small class="text-muted font-monospace opacity-75" style="font-size: 0.7rem;">{{ $gateway->class_name }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <code class="premium-code text-primary">{{ $gateway->slug ?? 'N/A' }}</code>
                                </td>
                                <td class="align-middle text-center">
                                    @if($gateway->mode === 'live')
                                        <span class="badge badge-success-soft border border-success text-success px-3 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-bolt mr-1"></i> Live
                                        </span>
                                    @else
                                        <span class="badge badge-warning-soft border border-warning text-warning px-3 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-flask mr-1"></i> Sandbox
                                        </span>
                                    @endif
                                </td>
                                <td class="align-middle text-center">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="status-{{ $gateway->id }}" {{ $gateway->is_active ? 'checked' : '' }} disabled>
                                        <label class="custom-control-label small font-weight-bold {{ $gateway->is_active ? 'text-success' : 'text-muted' }}" for="status-{{ $gateway->id }}">
                                            {{ $gateway->is_active ? 'Active' : 'Inactive' }}
                                        </label>
                                    </div>
                                </td>
                                <td class="text-right align-middle px-4">
                                    <a href="{{ route('admin.payment-gateways.edit', $gateway->id) }}" 
                                       class="btn btn-primary btn-sm btn-flat shadow-xs px-3 font-weight-bold">
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
        <div class="card-footer bg-light border-0 py-3">
             <div class="d-flex justify-content-between align-items-center">
                 <p class="mb-0 text-muted small"><i class="fas fa-info-circle mr-1"></i> System currently supports <strong>{{ $gateways->count() }}</strong> active integrations.</p>
                 <span class="text-xs text-uppercase font-weight-bold text-muted" style="letter-spacing: 1px;">Security Tier: Level 4</span>
             </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium FinTech UI Accents */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; padding: 1.25rem 1rem; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .font-weight-600 { font-weight: 600 !important; }
    .font-monospace { font-family: 'SFMono-Regular', Consolas, monospace; }

    /* Premium Code styling */
    .premium-code { background-color: #f1f5f9; color: #2563eb !important; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; border: 1px solid #e2e8f0; }

    /* Soft Badges */
    .badge-success-soft { background-color: #f0fdf4; color: #166534; }
    .badge-warning-soft { background-color: #fffbeb; color: #92400e; }
    
    /* Custom Toggles */
    .custom-switch .custom-control-label::before { height: 1.25rem; width: 2.25rem; border-radius: 1rem; }
    .custom-switch .custom-control-label::after { width: calc(1.25rem - 4px); height: calc(1.25rem - 4px); border-radius: 1rem; }
    
    .opacity-75 { opacity: 0.75; }
    .text-xs { font-size: 0.7rem; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#gateways-table tbody tr:not(.empty-state)').length > 0) {
            $('#gateways-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-4 pt-2"<"col-sm-12"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row px-4 pb-3"<"col-sm-12"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter processors...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
    });
</script>
@endsection
