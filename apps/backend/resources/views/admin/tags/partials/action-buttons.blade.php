{{--
    Administrative Taxonomy Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for tag 
    persistence and status management. It orchestrates publication 
    toggles, primary update/creation operations, and facilitates 
    cloning or destructive disposals through a unified operational 
    control panel.
    
    @context Taxonomy Management
    @variables Tag $tag The tag model instance.
--}}
<div class="card shadow-sm border-0 sticky-top-20">
    <div class="card-header bg-dark d-flex align-items-center py-3 border-bottom-accent">
        <h3 class="card-title text-white mb-0 font-weight-bold">
            <i class="fas fa-cog mr-2 text-primary"></i> {{ __('Operations') }}
        </h3>
    </div>
    <div class="card-body">
        {{-- Status Switch --}}
        <div class="mb-4 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="isPublishedSwitch" class="d-none toggle-input" {{ old('is_published', $tag->is_published ?? true) ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">{{ __('Publishing Status') }}</div>
                        <div class="small toggle-status text-muted">{{ ($tag->exists && $tag->is_published) ? __('Visible to public') : __('Draft Mode') }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <div class="action-buttons-group">
            @if($tag->exists)
                <div class="row no-gutters shadow-sm rounded overflow-hidden border-light-gray">
                    <div class="col-7">
                        <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat font-weight-bold h-100 uppercase letter-spacing-1">
                            <i class="fas fa-save mr-1"></i> {{ __('UPDATE') }}
                        </button>
                    </div>
                    <div class="col-2 col-fraction-20">
                        @if(Route::has('admin.tags.duplicate'))
                            <a href="{{ route('admin.tags.duplicate', $tag->id) }}" 
                               class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-secondary"
                               data-toggle="tooltip" title="{{ __('Duplicate') }}">
                                <i class="fas fa-copy"></i>
                            </a>
                        @else
                             <button class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-muted" disabled>
                                <i class="fas fa-copy"></i>
                            </button>
                        @endif
                    </div>
                    <div class="col-3 col-fraction-20">
                        <button type="button" 
                                class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-danger"
                                data-action="delete-trigger"
                                data-form-id="delete-form"
                                data-confirm-title="{{ __('Delete Tag?') }}"
                                data-confirm-text="{{ __('This action will permanently remove this taxonomy tag.') }}"
                                data-toggle="tooltip" title="{{ __('Delete') }}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            @else
                <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat shadow-sm font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-save mr-2"></i> {{ __('CREATE TAG') }}
                </button>
            @endif
        </div>
    </div>
</div>
