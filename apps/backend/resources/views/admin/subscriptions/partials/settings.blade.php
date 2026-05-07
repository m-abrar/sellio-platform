{{--
    Administrative Financial Component: Enrollment Feature Entitlements
    
    This component provides the interface for managing subscription-level 
    operational flags. It orchestrates the configuration of auto-renewal 
    systems, trial period designations, and termination behaviors 
    (cancel at period end), ensuring precise administrative control 
    over user membership logic.
    
    @context Financial Management
    @variables Subscription $subscription The subscription model instance.
--}}
<div class="card card-premium shadow-sm border-0">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-toggle-on mr-2 text-primary opacity-50"></i> Feature Entitlements
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="row">
            @php
                $toggles = [
                    ['name' => 'auto_renew', 'label' => 'Auto-Renew System', 'checked' => $subscription->auto_renew ?? false, 'desc' => 'Allow recurring billing'],
                    ['name' => 'is_trial', 'label' => 'Trial Period', 'checked' => $subscription->is_trial ?? false, 'desc' => 'Mark as temporary trial'],
                    ['name' => 'cancel_at_period_end', 'label' => 'Cancel at End', 'checked' => $subscription->cancel_at_period_end ?? false, 'desc' => 'Do not renew after expiry'],
                ];
            @endphp

            @foreach ($toggles as $toggle)
                <div class="col-md-4 mb-3">
                    <label class="w-100 cursor-pointer mb-0">
                        <input type="hidden" name="{{ $toggle['name'] }}" value="0"> 
                        <input type="checkbox" name="{{ $toggle['name'] }}" value="1" class="d-none toggle-input" {{ $toggle['checked'] ? 'checked' : '' }}>

                        <div class="border rounded-xl px-4 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-xs">
                            <div>
                                <div class="font-weight-bold text-dark smallest uppercase letter-spacing-1 mb-1">{{ $toggle['label'] }}</div>
                                <div class="smallest toggle-status text-muted uppercase font-weight-bold">{{ $toggle['checked'] ? 'Active' : 'Disabled' }}</div>
                            </div>
                            <div class="toggle-indicator"></div>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
    </div>
</div>
