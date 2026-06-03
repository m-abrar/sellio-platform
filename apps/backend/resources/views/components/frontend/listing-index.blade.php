@props([
    'variant' => 'listing',
    'paginator' => null,
    'total' => 0,
    'titleKey' => null,
    'titleDefault' => '',
    'subtitleKey' => null,
    'subtitleDefault' => '',
    'titleHtml' => null,
    'subtitleHtml' => null,
    'icon' => 'bi-search',
    'desktopLabel' => null,
    'mobileLabel' => null,
    'filterTitle' => null,
    'grid' => 'cards-3',
    'filterActive' => false,
    'filterActiveCount' => null,
    'mobileFilterLabel' => null,
])

@php
    $filterTitle = $filterTitle ?? __('Filters');
    $desktopLabel = $desktopLabel ?? __('Results Found');
    $mobileFilterLabel = $mobileFilterLabel ?? __('Filters');
@endphp

<x-frontend.listing-shell :variant="$variant" x-data="{ isFilterOpen: false }" {{ $attributes }}>
    @php
        $heading = [
            'total' => (int) $total,
            'icon' => $icon,
            'desktopLabel' => $desktopLabel,
        ];

        if ($mobileLabel) {
            $heading['mobileLabel'] = $mobileLabel;
        }

        if ($titleHtml) {
            $heading['titleHtml'] = $titleHtml;

            if ($subtitleHtml) {
                $heading['subtitleHtml'] = $subtitleHtml;
            }
        } else {
            $heading['titleKey'] = $titleKey;
            $heading['titleDefault'] = $titleDefault;
            $heading['subtitleKey'] = $subtitleKey;
            $heading['subtitleDefault'] = $subtitleDefault;
        }
    @endphp

    @include('frontend._partials._page-heading', $heading)

    <div class="row g-4 listing-layout">
        @isset($filters)
            @component('frontend._partials._filter-shell', ['title' => $filterTitle])
                {{ $filters }}
            @endcomponent
        @endisset

        <div class="col-12 col-lg-9 listing-results">
            @isset($toolbar)
                <div class="listing-toolbar mb-4">
                    {{ $toolbar }}
                </div>
            @endisset

            <div @class([
                'row listing-grid',
                'g-3 row-cols-2 row-cols-md-2 row-cols-xl-3' => $grid === 'cards-3',
                'g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-2' => $grid === 'cards-2',
                'g-3 g-lg-4 row-cols-1' => $grid === 'list',
            ])>
                {{ $slot }}
            </div>

            @if($paginator)
                @include('frontend._partials._listing-pagination', ['paginator' => $paginator])
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'label' => $mobileFilterLabel,
        'active' => (bool) $filterActive,
        'activeCount' => $filterActiveCount,
    ])
</x-frontend.listing-shell>
