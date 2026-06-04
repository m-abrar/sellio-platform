@php
    $step = $step ?? null;
    $subtitle = $subtitle ?? null;
    $subtitleHtml = $subtitleHtml ?? null;
@endphp

<div class="page-title-section mb-4 mb-lg-5 text-center">
    <span class="metric-label mx-auto">{{ $eyebrow }}</span>
    <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
        {{ $title }}@if($step !== null)<span class="text-primary-color">: {{ __('Step :step of 3', ['step' => $step]) }}</span>@endif
    </h1>

    @if($subtitleHtml)
        {!! $subtitleHtml !!}
    @elseif($subtitle)
        <p class="text-muted mb-0 fs-6 mx-auto" style="max-width: 600px;">{{ $subtitle }}</p>
    @endif
</div>
