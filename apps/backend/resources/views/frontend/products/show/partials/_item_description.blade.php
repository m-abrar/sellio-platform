<h4 class="fw-bold mt-4 mb-3">{{ __('Item Description') }}</h4>
{{-- The full description is generally one field, use line breaks to separate paragraphs --}}
<p class="text-muted">{!! nl2br(e($classified->description)) !!}</p>

{{-- Key Details List --}}
<h4 class="fw-bold mt-5 mb-3">{{ __('Key Details') }}</h4>
<ul class="list-group list-group-flush small mb-4">
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Condition:') }}</span>
        {{ $classified->item_condition ?? __('N/A') }} / 10
        ({{ ['Used', 'Fair', 'Good', 'Very Good', 'Excellent', 'Mint'][$classified->item_condition / 2] ?? __('N/A') }})
    </li>
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Category:') }}</span>
        {{ $classified->category->title ?? __('N/A') }}
    </li>
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Brand:') }}</span>
        {{ $classified->brand->title ?? __('Not Specified') }}
    </li>
    @if ($classified->item_year_age)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">{{ __('Year/Age:') }}</span>
            {{ __(':count years old', ['count' => $classified->item_year_age]) }}
        </li>
    @endif
    @if ($classified->item_quantity > 1)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">{{ __('Quantity:') }}</span>
            {{ __(':count available', ['count' => $classified->item_quantity]) }}
        </li>
    @endif
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Shipping:') }}</span>
        {{ $classified->is_shipping ? __('Available (Inquire for details)') : __('Not available; Local Pickup Only') }}
    </li>
</ul>

<hr>

{{-- Safety Tip Alert --}}
<div class="alert alert-info small mt-4" role="alert">
    <i class="bi bi-shield-lock-fill me-2 text-primary"></i>
    {{ __('Safety Tip: Always meet in a public location and inspect the item before finalizing the purchase.') }}
</div>
