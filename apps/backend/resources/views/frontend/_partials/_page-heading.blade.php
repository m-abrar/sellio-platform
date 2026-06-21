@php
    $total = (int) ($total ?? 0);
    $icon = $icon ?? 'bi-search';
    $desktopLabel = $desktopLabel ?? __('Results Found');
    $mobileLabel = $mobileLabel ?? __('Results');
@endphp

<div class="page-title-section my-3 mb-lg-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end gap-3 text-center text-md-start">
        <div class="title-content">
            <h1 class="fw-800 mb-2 display-6 text-dark tracking-tight">
                @isset($titleHtml)
                    {!! $titleHtml !!}
                @else
                    @editable($titleKey, $titleDefault)
                @endisset
            </h1>

            <p class="text-muted mb-0 fs-6 fs-md-5 mx-auto mx-md-0 sub-heading">
                @isset($subtitleHtml)
                    {!! $subtitleHtml !!}
                @else
                    @editable($subtitleKey, $subtitleDefault)
                @endisset
            </p>
        </div>

        @if($total > 0)
            <div class="results-count">
                <span class="badge bg-white text-primary border px-4 py-2 rounded-2 fs-6 fw-semibold border-opacity-50">
                    <i class="bi {{ $icon }} me-1 text-primary"></i>
                    <span class="d-inline-block">
                        {{ number_format($total) }}
                        <span class="d-none d-sm-inline">{{ $desktopLabel }}</span>
                        <span class="d-inline d-sm-none">{{ $mobileLabel }}</span>
                    </span>
                </span>
            </div>
        @endif
    </div>
</div>
