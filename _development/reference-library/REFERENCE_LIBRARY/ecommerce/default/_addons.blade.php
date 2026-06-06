@if($product->addons->count() > 0)
    <div class="mb-4 pt-2">
        <label class="filter-label mb-2 small fw-bold text-uppercase" style="letter-spacing: 0.5px;">
            {{ __('Enhance your order') }}
        </label>
        
        <div class="list-group rounded-4 overflow-hidden border-color-light">
            @foreach($product->addons->sortBy('sort_order') as $addon)
                <label class="list-group-item d-flex align-items-center p-3 transition-all border-color-light shadow-hover-inner" 
                       style="cursor: pointer;"
                       :class="selectedAddons.includes('{{ $addon->id }}') ? 'bg-primary bg-opacity-5' : 'bg-transparent'">
                    
                    <div class="form-check mb-0 flex-grow-1">
                        <input class="form-check-input me-3" 
                               type="checkbox" 
                               name="addon_ids[]" 
                               value="{{ $addon->id }}" 
                               id="addon_{{ $addon->id }}"
                               @change="updatePrice()"
                               x-model="selectedAddons"
                               {{ $addon->is_required ? 'checked disabled' : '' }}>
                        
                        <div class="d-inline-block align-middle">
                            <span class="d-block fw-bold small">
                                <i class="{{ $addon->icon }} text-muted me-1"></i> {{ $addon->title }}
                                @if($addon->is_popular)
                                    <span class="badge bg-warning text-dark x-small ms-1 fw-bold">{{ __('POPULAR') }}</span>
                                @endif
                            </span>
                            @if($addon->description)
                                <span class="d-block x-small text-muted">{{ $addon->description }}</span>
                            @endif
                        </div>
                    </div>

                    <div class="text-end ms-2">
                        <span class="fw-800 text-dark small">+${{ number_format($addon->price, 2) }}</span>
                        @if($addon->pricing_type === 'per_unit')
                            <div class="x-small text-muted" style="font-size: 0.6rem;">{{ __('per unit') }}</div>
                        @endif
                    </div>
                </label>
            @endforeach
        </div>
    </div>
@endif