{{--
    Administrative Intelligence Component: Action Header Protocol
    
    This partial provides standardized operational actions for analytical 
    reports. It facilitates report printing (export) and rapid navigation 
    to the system dashboard.
    
    @context Analytical Reporting
    @variables string $exportText The localized label for the export action.
--}}
<div class="col-sm-5 d-flex align-items-center justify-content-end gap-12">
    <div class="btn-group btn-group-premium">
        <button class="btn btn-white" data-action="print-page">
            <i class="fas fa-print mr-2 text-primary opacity-75"></i> {{ $exportText ?? __('Export Report') }}
        </button>
    </div>
    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
        <i class="fas fa-th-large mr-2"></i> {{ __('Dashboard') }}
    </a>
</div>
