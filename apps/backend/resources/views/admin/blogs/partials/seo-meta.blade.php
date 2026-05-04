<div class="card card-premium mt-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-search mr-2 text-primary opacity-50"></i> Meta Configuration
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Custom SEO Title</label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-globe text-primary"></i></span>
                </div>
                <input type="text" name="meta_title" class="form-control border-0" value="{{ old('meta_title', $blog->meta_title ?? '') }}" placeholder="Custom browser title...">
            </div>
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Search Snippet (Description)</label>
            <textarea name="meta_description" class="form-control shadow-xs" rows="3" style="border-radius: 12px;" placeholder="Brief summary to show in Google search results...">{{ old('meta_description', $blog->meta_description ?? '') }}</textarea>
            <small class="text-muted mt-2 d-block">Optimal length: 155 characters for search engine prominence.</small>
        </div>

        <div class="form-group mb-0">
            <label class="w-100 cursor-pointer mb-0">
                <input type="checkbox" name="allow_comments" value="1" 
                       class="d-none toggle-input" 
                       {{ old('allow_comments', $blog->allow_comments ?? true) ? 'checked' : '' }}>
                
                <div class="d-flex justify-content-between align-items-center toggle-card">
                    <div>
                        <div class="fw-bold small text-dark uppercase letter-spacing-1">Audience Engagement</div>
                        <div class="smallest text-muted uppercase">Enable community comments & discussion</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>
    </div>
</div>
