<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold text-dark">SEO & Meta Tags</h3>
    </div>
    <div class="card-body">
        <div class="form-group mb-3">
            <label for="meta_description">Meta Description</label>
            <textarea name="meta_description" class="form-control" rows="3" placeholder="Brief summary for search engines...">{{ old('meta_description', $page->meta_description ?? '') }}</textarea>
            <small class="text-muted">Recommended: 150-160 characters.</small>
        </div>

        <div class="form-group">
            <label for="meta_keywords">Meta Keywords</label>
            <input type="text" name="meta_keywords" class="form-control" placeholder="keyword1, keyword2, keyword3"
                   value="{{ old('meta_keywords', $page->meta_keywords ?? '') }}">
        </div>
    </div>
</div>
