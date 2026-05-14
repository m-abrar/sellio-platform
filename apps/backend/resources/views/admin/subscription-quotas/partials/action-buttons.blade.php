{{--
    Administrative Financial Partial: Resource Management Interface
    
    This component provides the primary interaction gateway for 
    subscription quota persistence and usage monitoring. It orchestrates 
    the commitment of resource limit overrides and provides real-time 
    subscriber context, ensuring consistent operational control 
    within the sidebar vertical.
    
    @context Financial Management
    @variables SubscriptionQuota $subscriptionQuota The quota model instance.
--}}
<div class="card shadow-sm border-0 rounded-lg card-actions mb-4">
    <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
            <i class="fas fa-tools text-muted mr-2"></i> {{ __('Subscription Usage') }}
        </h5>
    </div>

    <div class="card-body p-4">

        {{-- Save Box --}}
        <div class="border rounded p-3 mb-4 bg-light d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <button form="subscriptionQuota-form" type="submit" class="btn btn-primary d-flex align-items-center mr-3 btn-hover-premium">
                    <i class="fas fa-save mr-2"></i> {{ __('Update') }}
                </button>
            </div>
            <div class="d-flex align-items-center mt-3 mt-md-0">
                @if($subscriptionQuota->exists && $subscriptionQuota->subscription && $subscriptionQuota->subscription->user)
                    <img src="{{ $subscriptionQuota->user->avatar ?? asset('images/fallbacks/avatar.jpg') }}"
                         alt="Avatar" class="rounded-circle mr-2" width="40" height="40">
                    <div>
                        <div class="small text-muted">{{ __('Subscriber') }}</div>
                        <div class="font-weight-bold">{{ $subscriptionQuota->subscription->user->name }}</div>
                    </div>
                @endif
            </div>
        </div>


        {{-- Meta Info --}}
        @if($subscriptionQuota->exists)
            <div class="border-top pt-3 mt-3 text-muted small">
                <div class="d-flex justify-content-between mb-1">
                    <span class="text-uppercase smallest letter-spacing-1">{{ __('Created') }}:</span>
                    <span class="font-weight-bold text-dark">{{ $subscriptionQuota->created_at->format('d M Y') ?? '-' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-uppercase smallest letter-spacing-1">{{ __('Last Updated') }}:</span>
                    <span class="font-weight-bold text-dark">{{ $subscriptionQuota->updated_at->format('d M Y') ?? '-' }}</span>
                </div>
            </div>
        @endif

    </div>
</div>
