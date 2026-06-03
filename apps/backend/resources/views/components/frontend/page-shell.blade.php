@props([
    'variant' => 'page',
    'withAlerts' => true,
    'narrow' => false,
])

<div {{ $attributes->merge(['class' => 'page-shell page-shell--' . $variant . ($narrow ? ' page-shell--narrow' : '')]) }}>
    <div @class([
        'frontend-shell__inner',
        'frontend-shell__inner--narrow' => $narrow,
    ])>
        @if($withAlerts)
            @include('frontend._partials._alerts')
        @endif

        {{ $slot }}
    </div>
</div>
