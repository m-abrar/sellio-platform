<div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--brand-primary) !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold">
            <i class="fas fa-cog mr-2 text-primary"></i> Operations
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
                        <div class="fw-bold small text-dark">Publishing Status</div>
                        <div class="small toggle-status text-muted">{{ ($tag->exists && $tag->is_published) ? 'Visible to public' : 'Draft Mode' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <div class="action-buttons-group">
            @if($tag->exists)
                <div class="row no-gutters shadow-sm rounded overflow-hidden" style="border: 1px solid #dee2e6;">
                    <div class="col-7">
                        <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat font-weight-bold h-100">
                            <i class="fas fa-save mr-1"></i> UPDATE
                        </button>
                    </div>
                    <div class="col-2-5 col-2" style="flex: 0 0 20.833%; max-width: 20.833%;">
                        @if(Route::has('admin.tags.duplicate'))
                            <a href="{{ route('admin.tags.duplicate', $tag->id) }}" 
                               class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-secondary"
                               data-toggle="tooltip" title="Duplicate">
                                <i class="fas fa-copy"></i>
                            </a>
                        @else
                             <button class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-muted" disabled>
                                <i class="fas fa-copy"></i>
                            </button>
                        @endif
                    </div>
                    <div class="col-2-5 col-3" style="flex: 0 0 20.833%; max-width: 20.833%;">
                        <button type="button" 
                                class="btn btn-default btn-block btn-flat h-100 d-flex align-items-center justify-content-center text-danger"
                                onclick="triggerDelete()"
                                data-toggle="tooltip" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            @else
                <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat shadow-sm font-weight-bold">
                    <i class="fas fa-save mr-2"></i> CREATE TAG
                </button>
            @endif
        </div>
    </div>
</div>
