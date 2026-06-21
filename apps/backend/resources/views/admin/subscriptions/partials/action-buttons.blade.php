{{--
    Administrative Financial Partial: Enrollment Action Interface
    
    This component provides the primary interaction gateway for 
    subscription lifecycle management. It orchestrates status 
    transitions (active, trial, cancelled), enrollment persistence, 
    and manual renewal extensions, while providing real-time 
    subscriber context within the sidebar vertical.
    
    @context Financial Management
    @variables Subscription $subscription The subscription model instance.
--}}
<div class="card card-premium shadow-sm overflow-hidden border-0 mb-4">
    <div class="card-header bg-white py-4 px-4 border-0">
        <h3 class="card-title text-dark font-weight-bold mb-0 smallest text-uppercase letter-spacing-1">
            <i class="fas fa-bolt mr-2 text-primary opacity-50"></i> {{ __('Lifecycle Management') }}
        </h3>
    </div>

    <div class="card-body p-4">
        {{-- Status Selector --}}
        <div class="form-group mb-4">
            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">{{ __('Status') }}</label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-traffic-light text-primary"></i></span>
                </div>
                <select name="status" class="form-control border-0 font-weight-bold" required>
                    @foreach(['active' => __('Active Access'), 'on_trial' => __('Trial Period'), 'past_due' => __('Payment Due'), 'cancelled' => __('Cancelled'), 'expired' => __('Terminated')] as $val => $label)
                        <option value="{{ $val }}" {{ old('status', $subscription->status ?? 'active') == $val ? 'selected' : '' }}>
                            {{ $label }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        <button form="subscription-form" type="submit" class="btn btn-primary btn-block py-3 mb-3 shadow-premium rounded-pill font-weight-bold smallest uppercase">
            <i class="fas fa-save mr-2"></i> {{ __('Commit Changes') }}
        </button>

        @if($subscription->exists)
            <div class="renewal-zone p-3 rounded-xl border bg-light mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1">{{ __('Auto-Renewal') }}</span>
                    <span class="badge {{ $subscription->auto_renew ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-1 rounded-pill smallest font-weight-bold">
                        {{ $subscription->auto_renew ? __('ENABLED') : __('DISABLED') }}
                    </span>
                </div>
                <a href="{{ route('admin.subscriptions.renew', $subscription->id) }}" class="btn btn-white btn-block btn-sm rounded-pill font-weight-bold shadow-xs border text-primary">
                    <i class="fas fa-redo-alt mr-1"></i> {{ __('Extend Duration') }}
                </a>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <button type="button" class="btn btn-soft-danger btn-sm d-flex align-items-center justify-content-center shadow-sm icon-box-40" 
                        data-action="delete-trigger"
                        data-form-id="delete-form-{{ $subscription->id }}"
                        data-confirm-title="{{ __('Terminate Enrollment?') }}"
                        data-confirm-text="{{ __('This user will lose access to all subscription benefits immediately.') }}"
                        data-confirm-btn="{{ __('Confirm') }}">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <div class="text-right">
                    <small class="text-muted d-block smallest uppercase font-weight-bold opacity-50">{{ __('Initialized') }}</small>
                    <small class="text-dark font-weight-bold">{{ $subscription->created_at->format('M d, Y') }}</small>
                </div>
            </div>
            
            <form id="delete-form-{{ $subscription->id }}" action="{{ route('admin.subscriptions.destroy', $subscription->id) }}" method="POST" class="d-none">
                @csrf @method('DELETE')
            </form>
        @endif
    </div>
</div>

@if($subscription->exists && $subscription->user)
<div class="card card-premium shadow-sm border-0">
    <div class="card-body p-3">
        <div class="d-flex align-items-center">
            <img src="{{ $subscription->user->avatar_url }}"
                 alt="{{ $subscription->user->name }}"
                 class="rounded-circle shadow-xs mr-3 object-fit-cover"
                 width="52"
                 height="52">
            <div>
                <h6 class="mb-0 font-weight-bold text-dark">{{ $subscription->user->name }}</h6>
                <p class="mb-0 smallest text-muted text-uppercase font-weight-bold letter-spacing-1">{{ __('Verified Customer') }}</p>
            </div>
        </div>
    </div>
</div>
@endif
