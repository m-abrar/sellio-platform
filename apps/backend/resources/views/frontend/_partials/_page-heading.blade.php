@php
    $total = (int) ($total ?? 0);
    $icon = $icon ?? 'bi-search';
    $desktopLabel = $desktopLabel ?? __('Results Found');
    $mobileLabel = $mobileLabel ?? __('Results');
@endphp

<div class="listing-page-banner mb-4 mb-lg-5">
    <div class="listing-page-banner__icon-wrap flex-shrink-0">
        <i class="bi {{ $icon }}"></i>
    </div>
    <div class="flex-grow-1 min-w-0">
        <h1 class="listing-page-banner__title mb-1">
            @isset($titleHtml)
                {!! $titleHtml !!}
            @else
                @editable($titleKey, $titleDefault)
            @endisset
        </h1>
        <p class="listing-page-banner__subtitle mb-0">
            @isset($subtitleHtml)
                {!! $subtitleHtml !!}
            @else
                @editable($subtitleKey, $subtitleDefault)
            @endisset
        </p>
    </div>
    @if($total > 0)
    <div class="listing-page-banner__count flex-shrink-0 d-none d-sm-flex flex-column align-items-center">
        <span class="listing-page-banner__count-num">{{ number_format($total) }}</span>
        <span class="listing-page-banner__count-label">
            <span class="d-none d-sm-inline">{{ $desktopLabel }}</span>
            <span class="d-inline d-sm-none">{{ $mobileLabel }}</span>
        </span>
    </div>
    @endif
</div>
