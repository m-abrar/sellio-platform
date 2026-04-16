<div class="card shadow-sm rounded-3 mb-4 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold text-dark">Article Content</h3>
    </div>
    <div class="card-body">
        <div class="form-group mb-4">
            <label for="title">Article Title <span class="text-danger">*</span></label>
            <input type="text" name="title" id="title" class="form-control form-control-lg @error('title') is-invalid @enderror" 
                   value="{{ old('title', $blog->title ?? '') }}" required placeholder="e.g., 10 Tips for Modern Living">
            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label for="slug">URL Slug</label>
            <div class="input-group shadow-sm">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-light border-right-0 small text-muted">/blog/</span>
                </div>
                <input type="text" name="slug" id="slug" class="form-control @error('slug') is-invalid @enderror"
                       value="{{ old('slug', $blog->slug ?? '') }}" placeholder="auto-generated-from-title">
            </div>
            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="category_id">Category <span class="text-danger">*</span></label>
                    <select name="category_id" id="category_id" class="form-control select2" required>
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ old('category_id', $blog->category_id ?? '') == $category->id ? 'selected' : '' }}>
                                {{ $category->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="tags">Tags</label>
                    <select name="tags[]" id="tags" class="form-control select2" multiple data-placeholder="Select tags">
                        @foreach($tags as $tag)
                            <option value="{{ $tag->id }}" {{ in_array($tag->id, old('tags', $selectedTags ?? [])) ? 'selected' : '' }}>
                                {{ $tag->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>

        <div class="form-group mb-0">
            <label for="content">Full Article Content <span class="text-danger">*</span></label>
            <textarea name="content" id="content" class="form-control editor @error('content') is-invalid @enderror" rows="15">{{ old('content', $blog->content ?? '') }}</textarea>
            @error('content') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>
    </div>
</div>
