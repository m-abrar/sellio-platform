@php
    /**
     * Reusable Form Actions Sidebar Partial
     * 
     * @param $model      Model instance
     * @param $title      Upper-case label (e.g. 'CATEGORY')
     * @param $duplicate  Route name for duplication (optional)
     */
    $isEdit = $model->exists;
    $label = $title ?? 'RECORD';
@endphp

<div class="card card-premium sticky-top overflow-hidden" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--primary) !important; background: #1e293b !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
            <i class="fas fa-rocket mr-2 text-primary"></i> Protocol & Actions
        </h3>
    </div>
    
    <div class="card-body bg-white py-4">
        {{-- Publishing Switch --}}
        <div class="mb-4 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="publishedSwitch" class="d-none toggle-input" {{ old('is_published', $model->is_published ?? true) ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Publishing Status</div>
                        <div class="small toggle-status text-muted">{{ ($isEdit && $model->is_published) ? 'Visible to public' : 'Draft Mode' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <div class="action-buttons-group">
            <button type="submit" class="btn btn-submit-premium btn-block rounded-pill font-weight-bold shadow-lg py-3 smallest mb-3 uppercase letter-spacing-1">
                <i class="fas fa-save mr-2"></i> {{ $isEdit ? "SYNCHRONIZE $label" : "INITIALIZE $label" }}
            </button>

            @if($isEdit)
                <div class="d-flex" style="gap: 8px;">
                    @if(isset($duplicate))
                        <a href="{{ route($duplicate, $model->id) }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-muted border uppercase">
                            <i class="fas fa-copy mr-1"></i> CLONE
                        </a>
                    @endif
                    <button type="button" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-danger border uppercase" onclick="triggerDelete()">
                        <i class="fas fa-trash-alt mr-1"></i> PURGE
                    </button>
                </div>
            @endif
        </div>
    </div>

    @if($isEdit && isset($model->updated_at))
        <div class="card-footer bg-light border-top-0 text-center">
            <small class="text-muted">
                <i class="far fa-clock mr-1"></i> 
                Last Sync: {{ $model->updated_at->format('M d, Y H:i') }}
            </small>
        </div>
    @endif
</div>
