@php
    $publishedAddons = ($addons ?? $product->addons)->sortBy('sort_order');
    $hasOptionalAddons = $publishedAddons->contains(fn ($addon) => ! $addon->is_required);
@endphp

@if($publishedAddons->count() > 0)
    <div class="booking-addons-panel mb-4 pt-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-800 tracking-tight text-dark mb-0">
                <i class="bi bi-stars text-primary me-2"></i>{{ __('Enhance Your Order') }}
            </h6>
            @if($hasOptionalAddons)
                <span class="badge bg-light-primary text-primary rounded-2 px-3 small">{{ __('Optional') }}</span>
            @endif
        </div>

        <div class="row g-2">
            @foreach($publishedAddons as $addon)
                <div class="col-12">
                    <label for="addon_{{ $addon->id }}" class="addon-card position-relative d-block mb-0 @if($addon->is_required) addon-selected @endif"
                           :class="selectedAddons.includes('{{ $addon->id }}') ? 'addon-selected' : ''">
                        @if($addon->is_required)
                            <div class="addon-check-badge">
                                <i class="bi bi-check-lg text-white"></i>
                            </div>
                        @else
                            <template x-if="selectedAddons.includes('{{ $addon->id }}')">
                                <div class="addon-check-badge">
                                    <i class="bi bi-check-lg text-white"></i>
                                </div>
                            </template>
                        @endif

                        <div class="d-flex align-items-center p-3">
                            <div class="addon-icon-box booking-addon-icon shadow-sm rounded-3 d-flex align-items-center justify-content-center bg-white">
                                <i class="{{ $addon->icon ?? 'bi-box' }} fs-5 text-primary"></i>
                            </div>

                            <div class="flex-grow-1 ms-3 min-w-0">
                                <div class="d-flex align-items-center gap-2 flex-wrap">
                                    <span class="fw-800 text-dark small">{{ $addon->title }}</span>
                                    @if($addon->is_popular)
                                        <span class="badge booking-addon-popular bg-light-primary text-primary">
                                            <i class="bi bi-fire me-1"></i>{{ __('POPULAR') }}
                                        </span>
                                    @endif
                                    @if($addon->is_required)
                                        <span class="badge bg-secondary text-white x-small">{{ __('Required') }}</span>
                                    @endif
                                </div>
                                @if($addon->description)
                                    <p class="small text-muted mb-0 addon-card__meta">{{ $addon->description }}</p>
                                @endif
                                <div class="fw-800 text-primary small">
                                    +{{ format_currency($addon->price) }}
                                    @if($addon->pricing_type === 'per_unit')
                                        <span class="text-muted fw-normal">/ {{ __('unit') }}</span>
                                    @endif
                                </div>
                            </div>

                            <input class="form-check-input flex-shrink-0 ms-2"
                                   type="checkbox"
                                   value="{{ $addon->id }}"
                                   id="addon_{{ $addon->id }}"
                                   @unless($addon->is_required)
                                       name="addon_ids[]"
                                       @change="updatePrice()"
                                       x-model="selectedAddons"
                                   @else
                                       checked disabled
                                   @endunless>
                        </div>
                    </label>

                    @if($addon->is_required)
                        <input type="hidden" name="addon_ids[]" value="{{ $addon->id }}" data-required-addon>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif
