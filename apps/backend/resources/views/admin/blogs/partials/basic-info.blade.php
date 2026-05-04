<div class="card card-premium mb-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-edit mr-2 text-primary opacity-50"></i> Editorial Content
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Article Title <span class="text-danger">*</span></label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-heading text-primary"></i></span>
                </div>
                <input type="text" name="title" id="title" class="form-control border-0 @error('title') is-invalid @enderror" 
                       value="{{ old('title', $blog->title ?? '') }}" required placeholder="e.g., 10 Tips for Modern Living" list="blog-title-suggestions">
            </div>
            <datalist id="blog-title-suggestions">
                @foreach(\App\Models\Blog::select('title')->distinct()->limit(20)->pluck('title') as $title)
                    <option value="{{ $title }}">
                @endforeach
            </datalist>
            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Permanent Link (Slug)</label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0 text-muted smallest font-weight-bold uppercase">/blog/</span>
                </div>
                <input type="text" name="slug" id="slug" class="form-control border-0 @error('slug') is-invalid @enderror"
                       value="{{ old('slug', $blog->slug ?? '') }}" placeholder="auto-generated-slug">
            </div>
            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Editorial Category <span class="text-danger">*</span></label>
                    <select name="category_id" id="category_id" class="form-control select2 custom-select" required>
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
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Metadata Tags</label>
                    <select name="tags[]" id="tags" class="form-control select2" multiple data-placeholder="Select identifiers">
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
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Full Article Content <span class="text-danger">*</span></label>
            <textarea name="content" id="content" class="form-control editor @error('content') is-invalid @enderror" rows="15">{{ old('content', $blog->content ?? '') }}</textarea>
            @error('content') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>
    </div>
</div>
