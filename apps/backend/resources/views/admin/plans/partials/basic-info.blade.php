<div class="card shadow-sm rounded-3 mb-4 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold text-dark">Basic Information</h3>
    </div>
    <div class="card-body">
        <div class="form-group">
            <label><i class="fas fa-heading mr-1 text-primary"></i> Plan Title <span class="text-danger">*</span></label>
            <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" 
                   value="{{ old('title', $plan->title ?? '') }}" required placeholder="e.g., Premium Monthly" list="plan-title-suggestions">
            <datalist id="plan-title-suggestions">
                @foreach(\App\Models\Plan::select('title')->distinct()->limit(20)->pluck('title') as $title)
                    <option value="{{ $title }}">
                @endforeach
            </datalist>
            @error('title')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>

        <div class="form-group">
            <label>Billing Period <span class="text-danger">*</span></label>
            <select name="billing_period" class="form-control @error('billing_period') is-invalid @enderror" required>
                <option value="" disabled {{ !old('billing_period', $plan->billing_period ?? '') ? 'selected' : '' }}>Select Period...</option>
                <option value="monthly" {{ old('billing_period', $plan->billing_period ?? '') == 'monthly' ? 'selected' : '' }}>Monthly</option>
                <option value="annually" {{ old('billing_period', $plan->billing_period ?? '') == 'annually' ? 'selected' : '' }}>Annually</option>
            </select>
            @error('billing_period')<span class="invalid-feedback">{{ $message }}</span>@enderror
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Price ({{ setting('currency_symbol', '$') }})</label>
                    <input type="number" step="0.01" name="price" class="form-control" 
                           value="{{ old('price', $plan->price ?? '') }}" required>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Listing Duration (Days) <span class="text-danger">*</span></label>
                    <input type="number" name="listing_duration" class="form-control @error('listing_duration') is-invalid @enderror" 
                           value="{{ old('listing_duration', $plan->listing_duration ?? 30) }}" required>
                    @error('listing_duration')<span class="invalid-feedback">{{ $message }}</span>@enderror
                </div>
            </div>
        </div>
    </div>
</div>
