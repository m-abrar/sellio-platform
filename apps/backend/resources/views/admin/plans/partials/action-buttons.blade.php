{{--
    Administrative Financial Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for 
    subscription plan persistence and status management. It orchestrates 
    activation toggles, primary update/creation operations, and 
    facilitates cloning or destructive disposals through a unified 
    operational control panel in the sidebar vertical.
    
    @context Financial Management
    @variables Plan $plan The plan model instance.
--}}
<div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--brand-primary) !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold">
            <i class="fas fa-cog mr-2 text-primary"></i> Status & Actions
        </h3>
    </div>
    
    <div class="card-body bg-white">
        {{-- Plan Status Toggle --}}
        <div class="mb-3 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_active" value="0">
                <input type="checkbox" name="is_active" value="1" id="isActiveSwitch" class="d-none toggle-input" {{ ($plan->exists && $plan->is_active) || !$plan->exists ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Plan Status</div>
                        <div class="small toggle-status text-muted">{{ ($plan->exists && $plan->is_active) || !$plan->exists ? 'Active' : 'Inactive' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat shadow-sm font-weight-bold mb-2">
            <i class="fas fa-save mr-2"></i> {{ $plan->exists ? 'UPDATE PLAN' : 'CREATE PLAN' }}
        </button>

        @if($plan->exists)
            <div class="row gx-1">
                <div class="col-6">
                    @if(Route::has('admin.plans.duplicate'))
                        <a href="{{ route('admin.plans.duplicate', $plan->id) }}" class="btn btn-default btn-block btn-flat btn-sm text-secondary"><i class="fas fa-copy mr-1"></i> Duplicate</a>
                    @else
                        <button class="btn btn-default btn-block btn-flat btn-sm text-secondary" disabled><i class="fas fa-copy mr-1"></i> Duplicate</button>
                    @endif
                </div>
                <div class="col-6">
                    <button type="button" class="btn btn-default btn-block btn-flat btn-sm text-danger" id="delete-plan-btn"><i class="fas fa-trash-alt mr-1"></i> Delete</button>
                </div>
            </div>
        @endif
    </div>
</div>

@push('js')
<script src="{{ asset('vendor/npm/sweetalert2/sweetalert2.all.min.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const deleteBtn = document.getElementById('delete-plan-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                Swal.fire({
                    title: 'Delete this Plan?',
                    text: "Warning: This action cannot be undone and could disrupt active listing limits for users subscribed to this plan!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it',
                    cancelButtonText: 'Cancel',
                    backdrop: `rgba(0,0,0,0.35)`,
                    customClass: {
                        popup: 'rounded-lg border-0 shadow-lg',
                        confirmButton: 'btn btn-danger px-4 rounded-pill',
                        cancelButton: 'btn btn-outline-secondary px-4 rounded-pill ml-2'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById('delete-plan-form').submit();
                    }
                });
            });
        }
    });
</script>
@endpush
