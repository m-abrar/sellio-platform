{{--
    Administrative Services Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for service 
    listing persistence and disposal. It features high-fidelity visual 
    indicators for status transitions (publish/save), and facilitates 
    destructive operations (delete) through a premium, sticky interface 
    designed for rapid administrative workflows.
    
    @context Service Inventory Management
    @variables Service $service The service model instance being managed.
--}}
<div class="card card-premium sticky-top sticky-top-20 shadow-premium overflow-hidden">
    <div class="card-header border-0 bg-white py-3 px-4">
        <h3 class="card-title font-weight-bold text-dark text-uppercase small letter-spacing-1 mb-0">
            <i class="fas fa-bolt mr-2 text-primary"></i> {{ __('Finalize Actions') }}
        </h3>
    </div>
    <div class="card-body p-4 pt-0">
        <p class="text-muted small mb-4">{{ __('Confirm your changes and update the service listing on the platform.') }}</p>
        
        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-submit-premium btn-block py-3 rounded-xl font-weight-bold mb-3 fs-095 ls-0-5">
                <i class="fas fa-check-circle mr-2"></i> 
                {{ $service->exists ? __('SAVE CHANGES') : __('PUBLISH SERVICE') }}
            </button>
            
            <div class="row no-gutters">
                <div class="col-6 pr-1">
                    <a href="{{ route('admin.services.index') }}" class="btn btn-light btn-block py-2 rounded-lg text-muted small font-weight-bold">
                        <i class="fas fa-times mr-1"></i> {{ __('Cancel') }}
                    </a>
                </div>
                <div class="col-6 pl-1">
                    @if($service->exists)
                        <button type="button" class="btn btn-outline-danger btn-block py-2 rounded-lg small font-weight-bold" data-action="delete-trigger" data-form-id="delete-form" data-confirm-title="{{ __('Delete Record?') }}" data-confirm-text="{{ __('This will permanently remove the record from the platform.') }}">
                            <i class="fas fa-trash-alt mr-1"></i> {{ __('Delete') }}
                        </button>
                    @else
                        <button type="button" class="btn btn-light btn-block py-2 rounded-lg text-muted small font-weight-bold opacity-50" disabled>
                            <i class="fas fa-trash-alt mr-1"></i> {{ __('Delete') }}
                        </button>
                    @endif
                </div>
            </div>

            @if($service->exists)
                <div class="mt-3">
                    @if(Route::has('admin.services.duplicate'))
                        <a href="{{ route('admin.services.duplicate', $service->id) }}" class="btn btn-link btn-block text-primary small font-weight-bold p-0">
                            <i class="fas fa-copy mr-1"></i> {{ __('Duplicate this listing') }}
                        </a>
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

@stop
