@props([
    'variant' => 'listing',
    'withAlerts' => true,
])

<div {{ $attributes->merge(['class' => 'listing-page listing-page--' . $variant]) }}>
    <div class="frontend-shell__inner">
        @if($withAlerts)
            @include('frontend._partials._alerts')
        @endif

        {{ $slot }}
    </div>
</div>
