<div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid transparent !important; border-image: linear-gradient(to right, #FF3366, #ff6a00) 1 !important;">
        <h3 class="card-title text-white mb-0 font-weight-bold">

            <i class="fas fa-cog mr-2 text-primary"></i> Status & Actions
        </h3>
    </div>
    <div class="card-body bg-white">
        {{-- Sidebar Status Toggles --}}
        <div class="mb-3 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="pubSwitch" class="d-none toggle-input" {{ old('is_published', $product->is_published ?? '0') == '1' ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Publishing Status</div>
                        <div class="small toggle-status text-muted">{{ (isset($product) && $product->is_published) ? 'Visible to public' : 'Draft Mode' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>
        
        <div class="mb-3">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_featured" value="0">
                <input type="checkbox" name="is_featured" value="1" id="featSwitch" class="d-none toggle-input" {{ old('is_featured', $product->is_featured ?? '0') == '1' ? 'checked' : '' }}>
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Promotions</div>
                        <div class="small toggle-status text-muted">{{ (isset($product) && $product->is_featured) ? 'Featured' : 'Standard' }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>
        <hr class="my-3">
        <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat shadow-sm font-weight-bold mb-2">
            <i class="fas fa-save mr-2"></i> {{ isset($product) ? 'UPDATE PRODUCT' : 'CREATE PRODUCT' }}
        </button>

        @if(isset($product))
            <div class="row gx-1">
                <div class="col-6">
                    @if(Route::has('admin.products.duplicate'))
                        <a href="{{ route('admin.products.duplicate', $product->id) }}" class="btn btn-default btn-block btn-flat btn-sm text-secondary"><i class="fas fa-copy mr-1"></i> Duplicate</a>
                    @else
                        <button class="btn btn-default btn-block btn-flat btn-sm text-secondary" disabled><i class="fas fa-copy mr-1"></i> Duplicate</button>
                    @endif
                </div>
                <div class="col-6">
                    <button type="button" class="btn btn-default btn-block btn-flat btn-sm text-danger" onclick="triggerDelete()"><i class="fas fa-trash-alt mr-1"></i> Delete</button>
                </div>
            </div>
        @endif
    </div>
</div>
