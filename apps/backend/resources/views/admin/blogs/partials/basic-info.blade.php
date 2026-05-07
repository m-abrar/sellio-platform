{{--
    Administrative Content Partial: Core Editorial Parameters
    
    This component encapsulates the foundational attributes of an 
    article, including title orchestration, permalink generation, 
    taxonomy association (categories and tags), and the primary 
    content payload. It ensures data consistency and structural 
    integrity for the editorial suite.
    
    @context Blog Module Management
    @variables Blog $blog The blog model instance.
    @variables Collection $categories Editorial categories.
    @variables Collection $tags Editorial tags.
    @variables Array $selectedTags Currently associated tags.
--}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">
            Editorial Content
        </h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Article Title <span class="text-danger">*</span></label>
            <input type="text" name="title" id="title" class="form-control form-control-hero @error('title') is-invalid @enderror" 
                   value="{{ old('title', $blog->title ?? '') }}" required placeholder="e.g., 10 Tips for Modern Living" list="blog-title-suggestions">
            <datalist id="blog-title-suggestions">
                @foreach(\App\Models\Blog::select('title')->distinct()->limit(20)->pluck('title') as $title)
                    <option value="{{ $title }}">
                @endforeach
            </datalist>
            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Permanent Link (Slug)</label>
            <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small @error('slug') is-invalid @enderror"
                   value="{{ old('slug', $blog->slug ?? '') }}" placeholder="auto-generated-slug">
            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Editorial Category <span class="text-danger">*</span></label>
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
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Metadata Tags</label>
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
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Full Article Content <span class="text-danger">*</span></label>
            <textarea name="content" id="content" class="form-control editor @error('content') is-invalid @enderror" rows="15">{{ old('content', $blog->content ?? '') }}</textarea>
            @error('content') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>
    </div>
</div>
