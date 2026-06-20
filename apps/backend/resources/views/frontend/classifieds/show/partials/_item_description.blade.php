<p class="text-muted">{!! nl2br(e($classified->description)) !!}</p>

<h4 class="fw-bold mt-5 mb-3">{{ __('Key Details') }}</h4>
<ul class="list-group list-group-flush small mb-4">
    {{-- Condition: Using the new model accessor and badge class --}}
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Condition') }}:</span> 
        <span class="badge {{ $classified->condition_badge_class }}">
            {{ $classified->condition_label }}
        </span>
        <span class="text-muted ms-1">({{ $classified->item_condition }}/10)</span>
    </li>

    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Category') }}:</span> 
        {{ $classified->category->title ?? __('N/A') }}
    </li>

    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Brand') }}:</span> 
        {{ $classified->brand->title ?? __('Not Specified') }}
    </li>

    @if ($classified->item_year_age)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">{{ __('Year/Age') }}:</span> 
            {{ trans_choice('{1} :count year old|[2,*] :count years old', $classified->item_year_age) }}
        </li>
    @endif

    @if ($classified->item_quantity > 1)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">{{ __('Quantity') }}:</span> 
            {{ $classified->item_quantity }} {{ __('available') }}
        </li>
    @endif

    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">{{ __('Shipping') }}:</span> 
        {{ $classified->is_shipping ? __('Available (Inquire for details)') : __('Local Pickup Only') }}
    </li>
</ul>

<hr>

{{-- Safety Tip Alert --}}
<div class="alert alert-info small mt-4" alert-primary-theme" role="alert">
    <i class="bi bi-shield-lock-fill me-2 text-primary-color"></i>
    <strong>{{ __('Safety Tip') }}:</strong> 
    {{ __('Always meet in a public location and inspect the item before finalizing the purchase.') }}
</div>
