@php
    $step = $step ?? null;
    $subtitle = $subtitle ?? null;
    $subtitleHtml = $subtitleHtml ?? null;
    $property = $property ?? null;
    $showContext = $showContext ?? true;
    $showTitle = $showTitle ?? true;
    $backUrl = $backUrl ?? ($property ? route('properties.show', $property->slug) : null);
    $backLabel = $backLabel ?? __('Back to property');
@endphp

<div class="booking-header mb-4 mb-lg-5">

    {{-- ── Dark hero strip ─────────────────────────────────────────────── --}}
    @if($showTitle)
        <div class="booking-hero">
            <div class="text-center position-relative" style="z-index:1">
                <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
                    <i class="bi bi-shield-check me-1"></i>{{ $eyebrow }}
                </p>
                <h1 class="fw-800 tracking-tight mb-1" style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.5rem);color:#fff;letter-spacing:-0.03em">
                    {{ $title }}@if($step !== null)<span style="color:rgba(224,95,44,.8)"> · {{ __('Step :step of 3', ['step' => $step]) }}</span>@endif
                </h1>
                @if($subtitleHtml)
                    {!! $subtitleHtml !!}
                @elseif($subtitle)
                    <p class="booking-hero__subtitle">{{ $subtitle }}</p>
                @endif
            </div>
        </div>
    @endif

    {{-- ── Context card: reserved property ────────────────────────────── --}}
    @if($property && $showContext)
        <div class="booking-header__context mt-4">
            <div class="booking-header__property">
                <img src="{{ $property->primary_image_url }}"
                     class="booking-header__thumb"
                     alt="{{ $property->title }}">

                <div class="booking-header__property-copy">
                    <span class="metric-label">{{ __('Reserved Property') }}</span>
                    <h2 class="booking-header__property-title">{{ $property->title }}</h2>
                    <p class="booking-header__property-meta mb-0">
                        <i class="bi bi-geo-alt-fill me-1" style="color:var(--primary-color)"></i>
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
    @elseif($backUrl)
        <div class="mt-4">
            <a href="{{ $backUrl }}" class="booking-header__back booking-header__back--inline">
                <i class="bi bi-arrow-left"></i>
                <span>{{ $backLabel }}</span>
            </a>
        </div>
    @endif

</div>
