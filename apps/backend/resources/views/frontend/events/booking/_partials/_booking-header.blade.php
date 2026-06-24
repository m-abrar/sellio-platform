@php
    $step = $step ?? null;
    $totalSteps = $totalSteps ?? 3;
    $subtitle = $subtitle ?? null;
    $event = $event ?? null;
    $showContext = $showContext ?? true;
    $showTitle = $showTitle ?? true;
    $backUrl = $backUrl ?? ($event ? route('events.show', $event->slug) : null);
    $backLabel = $backLabel ?? __('Back to event');
@endphp

<div class="booking-header mb-4 mb-lg-5">

    {{-- ── Dark hero strip ─────────────────────────────────────────────── --}}
    @if($showTitle)
        <div class="booking-hero">
            <div class="text-center position-relative" style="z-index:1">
                <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
                    <i class="bi bi-ticket-perforated me-1"></i>{{ $eyebrow }}
                </p>
                <h1 class="fw-800 tracking-tight mb-1" style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.5rem);color:#fff;letter-spacing:-0.03em">
                    {{ $title }}@if($step !== null)<span style="color:rgba(224,95,44,.8)"> · {{ __('Step :step of :total', ['step' => $step, 'total' => $totalSteps]) }}</span>@endif
                </h1>
                @if($subtitle)
                    <p class="booking-hero__subtitle">{{ $subtitle }}</p>
                @endif
            </div>
        </div>
    @endif

    {{-- ── Context card: reserved event ───────────────────────────────── --}}
    @if($event && $showContext)
        <div class="booking-header__context mt-4">
            <div class="booking-header__property">
                <img src="{{ $event->primary_image_url }}"
                     class="booking-header__thumb"
                     alt="{{ $event->title }}">

                <div class="booking-header__property-copy">
                    <span class="metric-label">{{ __('Reserved Event') }}</span>
                    <h2 class="booking-header__property-title">{{ $event->title }}</h2>
                    <p class="booking-header__property-meta mb-0">
                        <i class="bi bi-calendar-event me-1" style="color:var(--primary-color)"></i>
                        {{ $event->start_date_time?->format('M j, Y') ?? __('Date TBD') }}
                        @if($event->location?->title)
                            <span class="mx-1">·</span>
                            <i class="bi bi-geo-alt-fill me-1" style="color:var(--primary-color)"></i>{{ $event->location->title }}
                        @endif
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
