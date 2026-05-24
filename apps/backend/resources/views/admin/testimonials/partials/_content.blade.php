<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">{{ __('Testimonial Content') }}</h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="row">
            <div class="col-md-6 form-group mb-4">
                <label for="author_name" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Author Name') }} <span class="text-danger">*</span></label>
                <input type="text" name="author_name" id="author_name" class="form-control form-control-hero @error('author_name') is-invalid @enderror" value="{{ old('author_name', $testimonial->author_name) }}" placeholder="{{ __('e.g. Jane Doe') }}" required>
                @error('author_name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
            </div>
            <div class="col-md-6 form-group mb-4">
                <label for="author_title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Author Title / Role') }}</label>
                <input type="text" name="author_title" id="author_title" class="form-control form-control-premium" value="{{ old('author_title', $testimonial->author_title) }}" placeholder="{{ __('e.g. CEO, Homeowner, Client') }}">
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 form-group mb-4">
                <label for="company" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Company') }}</label>
                <input type="text" name="company" id="company" class="form-control form-control-premium" value="{{ old('company', $testimonial->company) }}" placeholder="{{ __('e.g. Global Solutions Inc.') }}">
            </div>
            <div class="col-md-3 form-group mb-4">
                <label for="rating" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Rating') }}</label>
                <input type="number" name="rating" id="rating" min="1" max="5" class="form-control form-control-premium" value="{{ old('rating', $testimonial->rating) }}" placeholder="5">
            </div>
            <div class="col-md-3 form-group mb-4">
                <label for="sort_order" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Global Sort') }}</label>
                <input type="number" name="sort_order" id="sort_order" min="0" class="form-control form-control-premium" value="{{ old('sort_order', $testimonial->sort_order ?? 0) }}">
            </div>
        </div>

        <div class="form-group mb-0">
            <label for="quote" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Quote') }} <span class="text-danger">*</span></label>
            <textarea name="quote" id="quote" rows="6" class="form-control textarea-premium @error('quote') is-invalid @enderror" placeholder="{{ __('Write the customer quote that will appear on the storefront...') }}" required>{{ old('quote', $testimonial->quote) }}</textarea>
            @error('quote') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>
    </div>
</div>
