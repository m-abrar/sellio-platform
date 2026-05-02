<div class="card card-premium sticky-top overflow-hidden" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--primary) !important; background: #1e293b !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
            <i class="fas fa-rocket mr-2 text-primary"></i> {{ __('Protocol & Actions') }}
        </h3>
    </div>
    <div class="card-body">
        {{-- Sidebar Status Toggles --}}
        <div class="mb-3 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="isPublishedSwitch" class="d-none toggle-input" {{ old('is_published', $job->is_published ?? '0') == '1' ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Publishing Status</div>
                        <div class="small toggle-status text-muted">{{ ($job->exists && $job->is_published) ? 'Visible to public' : 'Draft Mode' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>
        
        <div class="mb-3">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_featured" value="0">
                <input type="checkbox" name="is_featured" value="1" id="featSwitch" class="d-none toggle-input" {{ old('is_featured', $job->is_featured ?? '0') == '1' ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Promotions</div>
                        <div class="small toggle-status text-muted">{{ ($job->exists && $job->is_featured) ? 'Featured' : 'Standard' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>
        <hr class="my-3">
        <div class="action-buttons-group">
            <button type="submit" class="btn btn-primary btn-block rounded-pill font-weight-bold shadow-lg py-3 smallest mb-3">
                <i class="fas fa-save mr-2"></i> {{ $job->exists ? __('SYNCHRONIZE RECORD') : __('INITIALIZE LISTING') }}
            </button>

            @if($job->exists)
                <div class="d-flex" style="gap: 8px;">
                    <button type="button" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-muted border">
                        <i class="fas fa-copy mr-1"></i> {{ __('CLONE') }}
                    </button>
                    <button type="button" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold smallest py-2 text-danger border" onclick="triggerDelete()">
                        <i class="fas fa-trash-alt mr-1"></i> {{ __('PURGE') }}
                    </button>
                </div>
            @endif
        </div>
    </div>
</div>
