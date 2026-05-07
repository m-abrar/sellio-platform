{{--
    Administrative Financial Partial: Resource Utilization Metrics
    
    This component provides the interface for managing quantitative 
    usage metrics for a specific subscription. It orchestrates the 
    tracking of listing consumption, featured status utilization, and 
    associated administrative notes, ensuring precise moderation of 
    platform resource entitlements.
    
    @context Financial Management
    @variables SubscriptionQuota $subscriptionQuota The quota model instance.
--}}
<div class="card shadow-sm rounded-3 mb-4">
    <div class="card-header border-bottom fw-bold">
        <h3 class="card-title">Quota Information</h3>
    </div>
    <div class="card-body">

        {{-- Quota Details --}}
        <div class="mb-4">
            <div class="row g-3 mb-2">

                <div class="col-md-6">
                    <label for="listings_used" class="form-label">Listings Used</label>
                    <input type="number" name="listings_used" id="listings_used"
                        class="form-control @error('listings_used') is-invalid @enderror"
                        value="{{ old('listings_used', $subscriptionQuota->listings_used ?? 0) }}" min="0">
                    @error('listings_used') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="col-md-6">
                    <label for="featured_used" class="form-label">Featured Listings Used</label>
                    <input type="number" name="featured_used" id="featured_used"
                        class="form-control @error('featured_used') is-invalid @enderror"
                        value="{{ old('featured_used', $subscriptionQuota->featured_used ?? 0) }}" min="0">
                    @error('featured_used') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
                
            </div>

            <div class="row g-3 mb-2">
                <div class="col-12">
                    <label for="notes" class="form-label">Notes</label>
                    <textarea name="notes" id="notes" rows="4"
                        class="form-control @error('notes') is-invalid @enderror"
                        placeholder="Optional notes">{{ old('notes', $subscriptionQuota->notes ?? '') }}</textarea>
                    @error('notes') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>
            </div>

        </div>

    </div>
</div>
