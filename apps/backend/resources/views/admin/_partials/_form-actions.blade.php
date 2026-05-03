@php
    /**
     * Reusable Form Actions Sidebar Partial
     * 
     * @param $model      Model instance
     * @param $title      Upper-case label (e.g. 'CATEGORY')
     * @param $duplicate  Route name for duplication (optional)
     * @param $back       Route name for cancel (optional)
     */
    $isEdit = $model->exists;
    $label = $title ?? 'RECORD';
@endphp

<div class="card card-premium overflow-hidden shadow-premium">
    <div class="card-header bg-white d-flex align-items-center py-3 px-4 border-0">
        <h3 class="card-title text-dark mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
            <i class="fas fa-rocket mr-2 text-primary opacity-50"></i> Protocol & Actions
        </h3>
    </div>
    
    <div class="card-body bg-white py-4">
        {{-- Publishing Switch --}}
        <div class="mb-4 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="publishedSwitch" class="d-none toggle-input" {{ old('is_published', $model->is_published ?? true) ? 'checked' : '' }}>
                <div class="d-flex justify-content-between align-items-center toggle-card">
                    <div>
                        <div class="fw-bold small text-dark">Publishing Status</div>
                        <div class="small toggle-status text-muted">{{ ($isEdit && $model->is_published) ? 'Visible to public' : 'Draft Mode' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <div class="action-buttons-group">
            <button type="submit" class="btn btn-primary btn-block rounded-pill font-weight-bold py-3 smallest mb-3 uppercase letter-spacing-1">
                <i class="fas fa-save mr-2"></i> {{ $isEdit ? "SYNCHRONIZE $label" : "INITIALIZE $label" }}
            </button>

            <div class="d-flex" style="gap: 8px;">
                @if(isset($back))
                    <a href="{{ route($back) }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-muted border uppercase">
                        <i class="fas fa-times mr-1"></i> Cancel
                    </a>
                @endif
                
                @if($isEdit)
                    @if(isset($duplicate))
                        <a href="{{ route($duplicate, $model->id) }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-muted border uppercase">
                            <i class="fas fa-copy mr-1"></i> Clone
                        </a>
                    @endif
                    <button type="button" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-danger border uppercase" onclick="triggerDelete()">
                        <i class="fas fa-trash-alt mr-1"></i> Purge
                    </button>
                @endif
            </div>
        </div>
    </div>

    @if($isEdit && isset($model->updated_at))
        <div class="card-footer bg-light border-top-0 text-center py-2">
            <small class="text-muted smallest text-uppercase letter-spacing-1">
                <i class="far fa-clock mr-1"></i> 
                Last Sync: {{ $model->updated_at->format('M d, H:i') }}
            </small>
        </div>
    @endif
</div>
