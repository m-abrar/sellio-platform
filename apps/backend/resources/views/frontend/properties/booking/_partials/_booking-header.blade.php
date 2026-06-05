@php
    $step = $step ?? null;
    $subtitle = $subtitle ?? null;
    $subtitleHtml = $subtitleHtml ?? null;
    $property = $property ?? null;
    $backUrl = $backUrl ?? ($property ? route('properties.show', $property->slug) : null);
    $backLabel = $backLabel ?? __('Back to property');
@endphp

<div class="booking-header page-title-section mb-4 mb-lg-5">
    @if($property)
        <div class="booking-header__context glass-surface mb-4">
            <div class="booking-header__property">
                <img src="{{ $property->primary_image_url }}"
                     class="booking-header__thumb"
                     alt="{{ $property->title }}">

                <div class="booking-header__property-copy">
                    <span class="metric-label">{{ __('Reserved Property') }}</span>
                    <h2 class="booking-header__property-title">{{ $property->title }}</h2>
                    <p class="booking-header__property-meta mb-0">
                        <i class="bi bi-geo-alt-fill text-primary-color me-1"></i>
                        {{ $property->location->title ?? $property->city ?? __('Location') }}
                    </p>
                </div>
            </div>

            @if($backUrl)
                <a href="{{ $backUrl }}" class="booking-header__back">
                    <i class="bi bi-arrow-left"></i>
                    <span>{{ $backLabel }}</span>
                </a>
            @endif
        </div>
    @endif

    <div class="text-center">
        <span class="metric-label mx-auto">{{ $eyebrow }}</span>
        <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
            {{ $title }}@if($step !== null)<span class="text-primary-color">: {{ __('Step :step of 3', ['step' => $step]) }}</span>@endif
        </h1>

        @if($subtitleHtml)
            {!! $subtitleHtml !!}
        @elseif($subtitle)
            <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">{{ $subtitle }}</p>
        @endif
    </div>
</div>
