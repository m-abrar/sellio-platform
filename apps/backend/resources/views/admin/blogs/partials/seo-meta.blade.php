{{--
    Administrative Content Partial: SEO & Engagement Protocols
    
    This component manages the visibility and search engine prominence 
    of an article. It orchestrates custom meta titles, search snippets 
    (meta descriptions), and audience engagement toggles (comments), 
    ensuring the content is optimized for both algorithmic crawling 
    and community interaction.
    
    @context Blog Module Management
    @variables Blog $blog The blog model instance.
--}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mt-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">
            {{ __('Meta Configuration') }}
        </h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Custom SEO Title') }}</label>
            <input type="text" name="meta_title" class="form-control form-control-premium" value="{{ old('meta_title', $blog->meta_title ?? '') }}" placeholder="{{ __('Custom browser title...') }}">
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Search Snippet (Description)') }}</label>
            <textarea name="meta_description" class="form-control rounded-12 border-light" rows="3" placeholder="{{ __('Brief summary to show in Google search results...') }}">{{ old('meta_description', $blog->meta_description ?? '') }}</textarea>
            <small class="text-muted mt-2 d-block">{{ __('Optimal length: 155 characters for search engine prominence.') }}</small>
        </div>

        <div class="form-group mb-0">
            <label class="w-100 cursor-pointer mb-0">
                <input type="checkbox" name="allow_comments" value="1" 
                       class="d-none toggle-input" 
                       {{ old('allow_comments', $blog->allow_comments ?? true) ? 'checked' : '' }}>
                
                <div class="d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm px-3 py-3 rounded-12 border-light">
                    <div>
                        <div class="font-weight-bold text-dark small uppercase letter-spacing-1">{{ __('Audience Engagement') }}</div>
                        <div class="smallest text-muted uppercase">{{ __('Enable community comments & discussion') }}</div>
                    </div>
                    <div class="toggle-indicator shadow-sm"></div>
                </div>
            </label>
        </div>
    </div>
</div>
