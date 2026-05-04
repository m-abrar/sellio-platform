<div class="card card-premium mb-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Core Information
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Plan Designation <span class="text-danger">*</span></label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-heading text-primary"></i></span>
                </div>
                <input type="text" name="title" class="form-control border-0 @error('title') is-invalid @enderror" 
                       value="{{ old('title', $plan->title ?? '') }}" required placeholder="e.g., Premium Monthly" list="plan-title-suggestions">
            </div>
            <datalist id="plan-title-suggestions">
                @foreach(\App\Models\Plan::select('title')->distinct()->limit(20)->pluck('title') as $title)
                    <option value="{{ $title }}">
                @endforeach
            </datalist>
            @error('title')<span class="invalid-feedback d-block">{{ $message }}</span>@enderror
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Billing Cycle <span class="text-danger">*</span></label>
            <select name="billing_period" class="form-control custom-select shadow-xs @error('billing_period') is-invalid @enderror" style="border-radius: 10px;" required>
                <option value="" disabled {{ !old('billing_period', $plan->billing_period ?? '') ? 'selected' : '' }}>Select Cycle...</option>
                <option value="monthly" {{ old('billing_period', $plan->billing_period ?? '') == 'monthly' ? 'selected' : '' }}>Monthly Billing</option>
                <option value="annually" {{ old('billing_period', $plan->billing_period ?? '') == 'annually' ? 'selected' : '' }}>Annual Billing</option>
            </select>
            @error('billing_period')<span class="invalid-feedback d-block">{{ $message }}</span>@enderror
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Price ({{ setting('currency_symbol', '$') }})</label>
                    <div class="input-group border rounded p-1 shadow-xs bg-white">
                        <div class="input-group-prepend border-0">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-tag text-success"></i></span>
                        </div>
                        <input type="number" step="0.01" name="price" class="form-control border-0" 
                               value="{{ old('price', $plan->price ?? '') }}" required placeholder="0.00">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Validity (Days) <span class="text-danger">*</span></label>
                    <div class="input-group border rounded p-1 shadow-xs bg-white">
                        <div class="input-group-prepend border-0">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-day text-primary"></i></span>
                        </div>
                        <input type="number" name="listing_duration" class="form-control border-0 @error('listing_duration') is-invalid @enderror" 
                               value="{{ old('listing_duration', $plan->listing_duration ?? 30) }}" required>
                    </div>
                    @error('listing_duration')<span class="invalid-feedback d-block">{{ $message }}</span>@enderror
                </div>
            </div>
        </div>
    </div>
</div>
