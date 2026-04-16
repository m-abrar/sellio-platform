<div class="card shadow-sm border-0 rounded-lg overflow-hidden">
    <div class="card-header bg-dark py-3" style="border-bottom: 3px solid var(--primary) !important;">
        <h3 class="card-title text-white font-weight-bold">
            <i class="fas fa-bolt mr-2 text-primary"></i> Publishing
        </h3>
    </div>

    <div class="card-body bg-white p-4">
        {{-- Status Dropdown moved to sidebar --}}
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-uppercase text-muted">Subscription Status</label>
            <select name="status" class="form-control form-control-lg border-primary shadow-sm" style="border-width: 2px;" required>
                @foreach(['active', 'on_trial', 'past_due', 'cancelled', 'expired'] as $status)
                    <option value="{{ $status }}" {{ old('status', $subscription->status ?? 'active') == $status ? 'selected' : '' }}>
                        {{ ucfirst(str_replace('_', ' ', $status)) }}
                    </option>
                @endforeach
            </select>
        </div>

        <button form="subscription-form" type="submit" class="btn btn-primary btn-block py-2 mb-3 shadow-sm rounded-pill">
            <i class="fas fa-save mr-2"></i> <strong>Save Subscription</strong>
        </button>

        @if(isset($subscription))
            <hr>
            {{-- Renewal Quick Action --}}
            <div class="p-3 border rounded bg-light mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small font-weight-bold text-muted">AUTO-RENEW</span>
                    <span class="badge {{ $subscription->auto_renew ? 'badge-success' : 'badge-secondary' }}">
                        {{ $subscription->auto_renew ? 'ON' : 'OFF' }}
                    </span>
                </div>
                <a href="{{ route('admin.subscriptions.renew', $subscription->id) }}" class="btn btn-sm btn-outline-success btn-block mt-2">
                    <i class="fas fa-redo-alt mr-1"></i> Extend Duration
                </a>
            </div>

            <div class="d-flex justify-content-between align-items-center">
                <form action="{{ route('admin.subscriptions.destroy', $subscription->id) }}" method="POST" onsubmit="return confirm('Delete permanently?');">
                    @csrf @method('DELETE')
                    <button type="submit" class="btn btn-outline-danger btn-sm rounded-circle shadow-sm" style="width: 35px; height: 35px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </form>
                <div class="text-right">
                    <small class="text-muted d-block">Created: {{ $subscription->created_at->format('M d, Y') }}</small>
                </div>
            </div>
        @endif
    </div>
</div>

@if(isset($subscription) && $subscription->user)
<div class="card shadow-sm border-0 mt-4 rounded-3 overflow-hidden">
    <div class="card-body p-3">
        <div class="d-flex align-items-center">
            <img src="{{ $subscription->user->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($subscription->user->name) }}"
                 class="rounded-circle mr-3 border" width="45" height="45">
            <div>
                <h6 class="mb-0 font-weight-bold text-dark">{{ $subscription->user->name }}</h6>
                <p class="mb-0 small text-muted">Customer Account</p>
            </div>
        </div>
    </div>
</div>
@endif
