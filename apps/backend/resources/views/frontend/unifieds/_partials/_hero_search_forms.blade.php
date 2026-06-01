@php
    $searchConfig = [
        'properties' => ['name' => 'keyword', 'placeholder' => __('Enter an address, city, or ZIP code'), 'button' => __('Search'), 'icon' => 'bi-search'],
        'autos' => ['name' => 'keyword', 'placeholder' => __('Make, model, or year'), 'button' => __('Find Car'), 'icon' => 'bi-search'],
        'products' => ['name' => 'q', 'placeholder' => __('Search products, brands, or categories'), 'button' => __('Shop'), 'icon' => 'bi-bag'],
        'services' => ['name' => 'keyword', 'placeholder' => __('What service do you need?'), 'button' => __('Find Pros'), 'icon' => 'bi-tools'],
        'jobs' => ['name' => 'keyword', 'placeholder' => __('Job title or company'), 'button' => __('Find Jobs'), 'icon' => 'bi-briefcase'],
        'events' => ['name' => 'keyword', 'placeholder' => __('Search events, workshops, or venues'), 'button' => __('Find Events'), 'icon' => 'bi-calendar-event'],
        'classifieds' => ['name' => 'keyword', 'placeholder' => __('Electronics, furniture, cameras...'), 'button' => __('Browse'), 'icon' => 'bi-tag'],
        'blogs' => ['name' => 'q', 'placeholder' => __('Search articles, guides, and updates'), 'button' => __('Read'), 'icon' => 'bi-journal-text'],
    ];
@endphp

@foreach(($publicModules ?? collect())->take(8) as $module)
    @php($config = $searchConfig[$module['id']] ?? $searchConfig['classifieds'])
    <div class="tab-pane fade @if($loop->first) show active @endif" id="{{ $module['id'] }}" role="tabpanel" aria-labelledby="{{ $module['id'] }}-tab">
        <form class="row g-3 align-items-center" method="GET" action="{{ route($module['search_route']) }}">
            <div class="col-lg-{{ $module['id'] === 'jobs' ? '5' : '9' }}">
                <input type="text" name="{{ $config['name'] }}" class="form-control custom-pill-input"
                       placeholder="{{ $config['placeholder'] }}">
            </div>

            @if($module['id'] === 'jobs')
                <div class="col-lg-4">
                    <input type="text" name="location" class="form-control custom-pill-input"
                           placeholder="{{ __('City or remote') }}">
                </div>
            @endif

            <div class="col-lg-3">
                <button type="submit" class="btn btn-search-pill w-100 text-nowrap">
                    <i class="bi {{ $config['icon'] }} me-2"></i> {{ $config['button'] }}
                </button>
            </div>
        </form>
    </div>
@endforeach
