@php
    // Group variations by name (Size, Color, etc.)
    $variationGroups = $product->attributes->where('is_variation', true)->groupBy('name');
@endphp

@foreach($variationGroups as $name => $options)
    <div class="mb-4">
        <label class="filter-label mb-2 small fw-bold text-uppercase" style="letter-spacing: 0.5px;">
            {{ $name }}
        </label>
        
        <div class="d-flex flex-wrap gap-2">
            @foreach($options as $option)
                <div class="variation-option">
                    <input type="radio" 
                           name="attribute_ids[{{ $loop->parent->index }}]" 
                           id="attr_{{ $option->id }}" 
                           value="{{ $option->id }}"
                           class="btn-check"
                           {{ $option->stock_quantity === 0 ? 'disabled' : '' }}
                           @change="updatePrice()"
                           x-model="selectedAttributes[{{ $loop->parent->index }}]"
                           required>
                    
                    <label class="btn btn-outline-light border-color-light text-dark rounded-3 px-3 py-2 d-flex align-items-center transition-all" 
                           for="attr_{{ $option->id }}">
                        
                        {{-- Visual Color Swatch (from your migration) --}}
                        @if($option->visual_color_code)
                            <span class="rounded-circle me-2 border" 
                                  style="width: 16px; height: 16px; background-color: {{ $option->visual_color_code }};"></span>
                        @endif

                        <span class="small fw-bold">{{ $option->value }}</span>

                        {{-- Price Surcharge Logic --}}
                        @if($option->additional_price > 0)
                            <span class="ms-1 x-small text-primary">(+{{ number_format($option->additional_price, 2) }})</span>
                        @endif
                    </label>
                </div>
            @endforeach
        </div>
        
        {{-- Out of Stock Warning for Variations --}}
        @if($options->every(fn($opt) => $opt->stock_quantity === 0))
            <div class="text-danger x-small mt-1"><i class="bi bi-info-circle me-1"></i>{{ __('All options currently out of stock') }}</div>
        @endif
    </div>
@endforeach
