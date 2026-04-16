<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold text-dark">SEO Configuration</h3>
    </div>
    <div class="card-body">
        <div class="form-group mb-3">
            <label for="meta_title">SEO Title</label>
            <input type="text" name="meta_title" class="form-control" value="{{ old('meta_title', $blog->meta_title ?? '') }}" placeholder="Custom browser title...">
        </div>

        <div class="form-group mb-3">
            <label for="meta_description">Search Engine Snippet (Meta Description)</label>
            <textarea name="meta_description" class="form-control" rows="3" placeholder="Brief summary to show in Google search results...">{{ old('meta_description', $blog->meta_description ?? '') }}</textarea>
            <small class="text-muted">Optimal length: 155 characters.</small>
        </div>

        <div class="form-group">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" name="allow_comments" class="custom-control-input" id="allow_comments" value="1" {{ old('allow_comments', $blog->allow_comments ?? true) ? 'checked' : '' }}>
                <label class="custom-control-label text-muted" for="allow_comments">Enable readers to comment on this post</label>
            </div>
        </div>
    </div>
</div>
