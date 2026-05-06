<div class="card card-premium mt-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-search mr-2 text-primary opacity-50"></i> Meta Optimization
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">Search Description</label>
            <textarea name="meta_description" class="form-control shadow-xs rounded-12" rows="3" placeholder="Brief summary for search engine indexing...">{{ old('meta_description', $page->meta_description ?? '') }}</textarea>
            <small class="text-muted mt-2 d-block">Recommended density: 150-160 characters for optimal visibility.</small>
        </div>

        <div class="form-group mb-0">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">Meta Keywords</label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-key text-primary"></i></span>
                </div>
                <input type="text" name="meta_keywords" class="form-control border-0" placeholder="e.g. real estate, marketplace, listings"
                       value="{{ old('meta_keywords', $page->meta_keywords ?? '') }}">
            </div>
        </div>
    </div>
</div>
