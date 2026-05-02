<div class="card card-premium sticky-top overflow-hidden" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--primary) !important; background: #1e293b !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
            <i class="fas fa-rocket mr-2 text-primary"></i> {{ __('Protocol & Actions') }}
        </h3>
    </div>
    <div class="card-body bg-white p-4">
        {{-- Status Registry --}}
        <div class="mb-4">
            <label class="smallest text-uppercase font-weight-bold text-muted mb-3 d-block">{{ __('State Management') }}</label>
            
            <div class="mb-3">
                <label class="w-100 cursor-pointer mb-0">
                    <input type="hidden" name="is_published" value="0">
                    <input type="checkbox" name="is_published" value="1" id="isPublishedSwitch" class="d-none toggle-input" {{ old('is_published', $event->is_published ?? '0') == '1' ? 'checked' : '' }}>
                    <div class="border rounded-xl px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-xs">
                        <div>
                            <div class="font-weight-bold smallest text-dark">{{ __('Public Visibility') }}</div>
                            <div class="smallest toggle-status text-muted">{{ ($event->exists && $event->is_published) ? __('LIVE') : __('DRAFT') }}</div>
                        </div>
                        <div class="toggle-indicator"></div>
                    </div>
                </label>
            </div>
            
            <div class="mb-0">
                <label class="w-100 cursor-pointer mb-0">
                    <input type="hidden" name="is_featured" value="0">
                    <input type="checkbox" name="is_featured" value="1" id="featSwitch" class="d-none toggle-input" {{ old('is_featured', $event->is_featured ?? '0') == '1' ? 'checked' : '' }}>
                    <div class="border rounded-xl px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-xs">
                        <div>
                            <div class="font-weight-bold smallest text-dark">{{ __('Featured Asset') }}</div>
                            <div class="smallest toggle-status text-muted">{{ ($event->exists && $event->is_featured) ? __('PROMOTED') : __('STANDARD') }}</div>
                        </div>
                        <div class="toggle-indicator"></div>
                    </div>
                </label>
            </div>
        </div>

        <hr class="my-4 border-light">

        <button type="submit" class="btn btn-primary btn-block rounded-pill font-weight-bold shadow-lg py-3 smallest mb-3">
            <i class="fas fa-save mr-2"></i> {{ $event->exists ? __('SYNCHRONIZE RECORD') : __('INITIALIZE LISTING') }}
        </button>

        @if($event->exists)
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
