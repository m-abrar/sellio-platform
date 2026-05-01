<div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-0">
    <div class="card-header bg-dark py-3" style="border-bottom: 3px solid #007bff !important;">
        <h3 class="card-title text-white font-weight-bold">
            <i class="fas fa-rocket mr-2 text-primary"></i> Publishing
        </h3>
    </div>
    <div class="card-body bg-white p-4">
        
        {{-- Published Status Toggle --}}
        <div class="mb-4">
            <label class="w-100 cursor-pointer">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" 
                       class="d-none toggle-input" 
                       {{ ($blog->exists && $blog->is_published) || !$blog->exists ? 'checked' : '' }}>
                
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Article Visibility</div>
                            {{ ($blog->exists && $blog->is_published) || !$blog->exists ? 'Published' : 'Draft' }}
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        {{-- Featured Toggle --}}
        <div class="mb-4">
            <div class="custom-control custom-switch">
                <input type="checkbox" name="is_featured" class="custom-control-input" id="is_featured" value="1" {{ old('is_featured', $blog->is_featured ?? false) ? 'checked' : '' }}>
                <label class="custom-control-label font-weight-normal text-muted" for="is_featured">Mark as Featured Post</label>
            </div>
        </div>

        <button form="blog-form" type="submit" class="btn btn-primary btn-block py-2 mb-3 shadow-sm rounded-pill">
            <i class="fas fa-save mr-2"></i> <strong>{{ $blog->exists ? 'Update Post' : 'Publish Article' }}</strong>
        </button>

        @if($blog->exists)
            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                <a href="{{ url('blog/' . $blog->slug) }}" target="_blank" class="btn btn-link btn-sm text-primary p-0 font-weight-bold">
                    <i class="fas fa-external-link-alt mr-1"></i> View Live
                </a>
                
                <form action="{{ route('admin.blogs.destroy', $blog->id) }}" method="POST" onsubmit="return confirm('Delete this article permanently?');">
                    @csrf @method('DELETE')
                    <button type="submit" class="btn btn-outline-danger btn-sm rounded-circle shadow-sm" style="width: 35px; height: 35px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </form>
            </div>
        @endif
    </div>
</div>
