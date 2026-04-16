<div class="card shadow-sm border-0 rounded-lg card-actions mb-4">
    <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
            <i class="fas fa-tools text-muted mr-2"></i> Subscription Usage
        </h5>
    </div>

    <div class="card-body p-4">

        {{-- Save Box --}}
        <div class="border rounded p-3 mb-4 bg-light d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <button form="subscriptionQuota-form" type="submit" class="btn btn-primary d-flex align-items-center mr-3">
                    <i class="fas fa-save mr-2"></i> Update
                </button>
            </div>
            <div class="d-flex align-items-center mt-3 mt-md-0">
                @if(isset($subscriptionQuota->subscription->user))
                    <img src="{{ $subscriptionQuota->user->avatar ?? 'https://picsum.photos/40' }}"
                         alt="Avatar" class="rounded-circle mr-2" width="40" height="40">
                    <div>
                        <div class="small text-muted">Subscriber</div>
                        <div>{{ $subscriptionQuota->subscription->user->name }}</div>
                    </div>
                @endif
            </div>
        </div>


        {{-- Meta Info --}}
        @if(isset($subscriptionQuota))
            <div class="border-top pt-3 mt-3 text-muted small">
                <div class="d-flex justify-content-between mb-1">
                    <span>Created:</span>
                    <span>{{ $subscriptionQuota->created_at->format('d M Y') ?? '-' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span>Last Updated:</span>
                    <span>{{ $subscriptionQuota->updated_at->format('d M Y') ?? '-' }}</span>
                </div>
            </div>
        @endif

    </div>
</div>

<style>
.card-actions .btn {
    transition: all 0.2s ease;
}
.card-actions .btn:hover,
.card-actions .btn:focus {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
</style>
