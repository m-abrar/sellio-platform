{{--
    Administrative Jobs Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for job 
    listing persistence and disposal. It features high-fidelity visual 
    indicators for status transitions (publish/save), and facilitates 
    destructive operations (delete) through a premium, sticky interface 
    designed for rapid administrative workflows.
    
    @context Job Inventory Management
    @variables JobListing $job The job model instance being managed.
--}}
<div class="card card-premium sticky-top shadow-premium overflow-hidden" style="top: 20px;">
    <div class="card-header border-0 bg-white py-3 px-4">
        <h3 class="card-title font-weight-bold text-dark text-uppercase small letter-spacing-1 mb-0">
            <i class="fas fa-bolt mr-2 text-primary"></i> Finalize Actions
        </h3>
    </div>
    <div class="card-body p-4 pt-0">
        <p class="text-muted small mb-4">Confirm your changes and update the job listing on the platform.</p>
        
        <div class="d-grid gap-2">
            <button type="submit" class="btn btn-submit-premium btn-block py-3 rounded-xl font-weight-bold mb-3" style="font-size: 0.9rem; letter-spacing: 0.5px;">
                <i class="fas fa-check-circle mr-2"></i> 
                {{ $job->exists ? 'SAVE CHANGES' : 'PUBLISH POSITION' }}
            </button>
            
            <div class="row no-gutters">
                <div class="col-6 pr-1">
                    <a href="{{ route('admin.jobs.index') }}" class="btn btn-light btn-block py-2 rounded-lg text-muted small font-weight-bold">
                        <i class="fas fa-times mr-1"></i> Cancel
                    </a>
                </div>
                <div class="col-6 pl-1">
                    @if($job->exists)
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

            @if($job->exists)
                <div class="mt-3">
                    @if(Route::has('admin.jobs.duplicate'))
                        <a href="{{ route('admin.jobs.duplicate', $job->id) }}" class="btn btn-link btn-block text-primary small font-weight-bold p-0">
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
