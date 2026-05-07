{{--
    Administrative Real Estate Partial: Listing Lifecycle Actions
    
    This component provides the primary interaction suite for property 
    persistence. It facilitates listing publication, credential updates, 
    asset cloning, and secure deletion protocols within a sticky sidebar 
    architecture for optimized accessibility.
    
    @context Property Configuration Interface
    @variables Property $property The active property model instance.
--}}
<div class="card card-premium sticky-top shadow-premium overflow-hidden" style="top: 20px;">
    <div class="card-header border-0 bg-white py-3 px-4">
        <h3 class="card-title font-weight-bold text-dark text-uppercase small letter-spacing-1 mb-0">
            <i class="fas fa-bolt mr-2 text-primary"></i> Finalize Actions
        </h3>
    </div>
    <div class="card-body p-4 pt-0">
        <p class="text-muted small mb-4">Confirm your changes and update the property listing on the platform.</p>
        
        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-submit-premium btn-block py-3 rounded-xl font-weight-bold mb-3" style="font-size: 0.9rem; letter-spacing: 0.5px;">
                <i class="fas fa-check-circle mr-2"></i> 
                {{ $property->exists ? 'SAVE CHANGES' : 'PUBLISH ASSET' }}
            </button>
            
            <div class="row no-gutters">
                <div class="col-6 pr-1">
                    <a href="{{ route('admin.properties.index') }}" class="btn btn-light btn-block py-2 rounded-lg text-muted small font-weight-bold">
                        <i class="fas fa-times mr-1"></i> Cancel
                    </a>
                </div>
                <div class="col-6 pl-1">
                    @if($property->exists)
                        <button type="button" class="btn btn-outline-danger btn-block py-2 rounded-lg small font-weight-bold" onclick="triggerDelete()">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    @else
                        <button type="button" class="btn btn-light btn-block py-2 rounded-lg text-muted small font-weight-bold opacity-50" disabled>
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    @endif
                </div>
            </div>

            @if($property->exists)
                <div class="mt-3">
                    @if(Route::has('admin.properties.duplicate'))
                        <a href="{{ route('admin.properties.duplicate', $property->id) }}" class="btn btn-link btn-block text-primary small font-weight-bold p-0">
                            <i class="fas fa-copy mr-1"></i> Duplicate this listing
                        </a>
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

<style>
    .rounded-xl { border-radius: 16px !important; }
    .rounded-lg { border-radius: 12px !important; }
    .letter-spacing-1 { letter-spacing: 1px !important; }
</style>
