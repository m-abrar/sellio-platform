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
                <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO DASHBOARD
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Financial Security Protocol --}}
    <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 20px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-stretch">
                <div class="bg-success px-4 d-flex align-items-center justify-content-center" style="min-width: 80px; opacity: 0.9;">
                    <i class="fas fa-shield-alt text-white fa-2x shadow-sm"></i>
                </div>
                <div class="p-4">
                    <h6 class="mb-1 font-weight-bold text-dark smallest text-uppercase letter-spacing-1">Transaction Security Protocol</h6>
                    <p class="mb-0 text-muted smallest font-weight-bold uppercase">All API keys are encrypted at rest. Switch to <span class="badge badge-success-light text-success px-2 py-0 font-weight-bold">Live Mode</span> only after verifying sandbox transactions.</p>
                </div>
            </div>
        </div>
    </div>

    

    {{-- Installed Processors Card --}}
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-network-wired mr-1 text-primary opacity-50"></i> Active Integration Ledger
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-plug mr-1"></i> {{ $gateways->count() }} CONNECTED
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="gateways-table" class="table table-hover table-premium mb-0">
                    <thead class="bg-light text-uppercase smallest font-weight-bold">
                        <tr>
                            <th class="py-3 border-0 px-4">Gateway & Integration</th>
                            <th class="py-3 border-0">Technical Identifier</th>
                            <th class="py-3 border-0 text-center">Environment</th>
                            <th class="py-3 border-0 text-center">Lifecycle</th>
                            <th class="py-3 border-0 text-right px-4">Operations</th>
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
                                    @if($gateway->is_active)
                                        <span class="badge badge-success-soft border border-success text-success px-3 py-1" style="border-radius: 20px; font-size: 0.7rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-check-circle mr-1"></i> ACTIVE
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft border border-secondary text-secondary px-3 py-1" style="border-radius: 20px; font-size: 0.7rem; letter-spacing: 0.5px;">
                                            <i class="fas fa-times-circle mr-1"></i> INACTIVE
                                        </span>
                                    @endif
                                </td>
                                <td class="text-right align-middle px-4">
                                    <a href="{{ route('admin.payment-gateways.edit', $gateway->id) }}" 
                                       class="btn btn-primary rounded-pill shadow-premium px-4 font-weight-bold smallest">
                                        <i class="fas fa-cog mr-1"></i> CONFIGURE
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
    .badge-secondary-soft { background-color: #f8fafc; color: #64748b; }
    
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
                "dom": '<"row px-0 pt-2"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-3"l>>t<"row px-0 pb-3"<"col-sm-12"p>>',
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter...",
                    "lengthMenu": "_MENU_ per page",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-xs border').css('max-width', '200px');
            $('.dataTables_length select').addClass('form-control form-control-sm shadow-xs');
        }
    });
</script>
@endsection
