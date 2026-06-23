<section class="hero-section hero-section--dark">
    <div class="container-xl">
        <div class="row align-items-center g-5">

            {{-- ── LEFT: Headline + Search ───────────────────────────── --}}
            <div class="col-lg-6">

                {{-- Eyebrow --}}
                <div class="mb-4" data-aos="fade-up">
                    <div class="hero-eyebrow">
                        <span class="hero-eyebrow__line" aria-hidden="true"></span>
                        @editable('home.hero.badge', __('The All-In-One Marketplace'))
                    </div>
                </div>

                {{-- Headline --}}
                <h1 class="hero-headline mb-4" data-aos="fade-up" data-aos-delay="100">
                    @editableHtml('home.hero.title', 'Find Everything <span class="text-primary">You Need.</span>')
                </h1>

                {{-- Subtitle --}}
                <p class="hero-subtitle mb-5" data-aos="fade-up" data-aos-delay="150">
                    @editable('home.hero.description', __('Buy, sell, and discover properties, vehicles, events, services, and more — all in one marketplace.'))
                </p>

                {{-- Search module --}}
                <div class="hero-search-module" data-hero-search data-aos="fade-up" data-aos-delay="200">

                    {{-- Horizontal tab strip --}}
                    <div class="hero-tabs-scroll-wrap">
                        <button class="hero-tabs-arrow hero-tabs-arrow--left" aria-label="{{ __('Scroll tabs left') }}" hidden>
                            <i class="bi bi-chevron-left" aria-hidden="true"></i>
                        </button>
                        <div class="hero-tabs-strip">
                            <ul class="nav hero-tabs-inline" id="searchTab" role="tablist">
                                @foreach(($publicModules ?? collect())->take(8) as $tab)
                                    <li class="nav-item" role="presentation">
                                        <button type="button"
                                                class="nav-link @if($loop->first) active @endif"
                                                id="{{ $tab['id'] }}-tab"
                                                role="tab"
                                                data-hero-tab
                                                data-hero-target="hero-search-{{ $tab['id'] }}"
                                                aria-controls="hero-search-{{ $tab['id'] }}"
                                                aria-selected="{{ $loop->first ? 'true' : 'false' }}">
                                            <i class="bi {{ $tab['icon'] }}" aria-hidden="true"></i>
                                            <span>{{ $tab['label'] }}</span>
                                        </button>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <button class="hero-tabs-arrow hero-tabs-arrow--right" aria-label="{{ __('Scroll tabs right') }}">
                            <i class="bi bi-chevron-right" aria-hidden="true"></i>
                        </button>
                    </div>{{-- /.hero-tabs-scroll-wrap --}}

                    {{-- White search card --}}
                    <div class="hero-search-card">
                        <div class="tab-content" id="searchTabContent">
                            @include('frontend.unifieds._partials._hero_search_forms')
                        </div>
                    </div>

                </div>{{-- /hero-search-module --}}

                {{-- Stats row --}}
                @if(($totalListingsCount ?? 0) > 0 || ($publicModules ?? collect())->count() > 0)
                <div class="hero-stats-row mt-5" data-aos="fade-up" data-aos-delay="250">
                    @if(($totalListingsCount ?? 0) > 0)
                    <div class="hero-stat">
                        <span class="hero-stat__value">{{ number_format($totalListingsCount) }}+</span>
                        <span class="hero-stat__label">{{ __('Active Listings') }}</span>
                    </div>
                    @if(($publicModules ?? collect())->count() > 0)
                    <div class="hero-stat-divider"></div>
                    @endif
                    @endif
                    @if(($publicModules ?? collect())->count() > 0)
                    <div class="hero-stat">
                        <span class="hero-stat__value">{{ ($publicModules ?? collect())->count() }}</span>
                        <span class="hero-stat__label">{{ __('Categories') }}</span>
                    </div>
                    @endif
                </div>
                @endif

            </div>{{-- /col-lg-6 left --}}

            {{-- ── RIGHT: Image mosaic ──────────────────────────────── --}}
            <div class="col-lg-6 d-none d-lg-flex justify-content-end" data-aos="fade-left" data-aos-delay="100">
                @php
                    $mosaicItems = collect();
                    $mosaicSources = [
                        'propertiesFeatured'  => ['label' => __('Properties'), 'icon' => 'bi-building'],
                        'autosFeatured'       => ['label' => __('Vehicles'),   'icon' => 'bi-car-front-fill'],
                        'eventsFeatured'      => ['label' => __('Events'),     'icon' => 'bi-calendar-event'],
                        'servicesFeatured'    => ['label' => __('Services'),   'icon' => 'bi-tools'],
                        'classifiedsFeatured' => ['label' => __('Classifieds'),'icon' => 'bi-tag'],
                        'jobsFeatured'        => ['label' => __('Jobs'),       'icon' => 'bi-briefcase'],
                    ];
                    foreach ($mosaicSources as $src => $meta) {
                        if (isset($$src) && $$src instanceof \Illuminate\Support\Collection) {
                            foreach ($$src->filter(fn($i) => !empty($i->primary_image_url))->take(2) as $listing) {
                                $mosaicItems->push(['listing' => $listing] + $meta);
                                if ($mosaicItems->count() >= 4) break 2;
                            }
                        }
                    }
                    $mosaicItems = $mosaicItems->values();
                    $mosaicPlaceholders = [
                        ['label' => __('Properties'), 'icon' => 'bi-building'],
                        ['label' => __('Vehicles'),   'icon' => 'bi-car-front-fill'],
                        ['label' => __('Events'),     'icon' => 'bi-calendar-event'],
                        ['label' => __('Services'),   'icon' => 'bi-tools'],
                    ];
                @endphp

                <div class="hero-mosaic hero-mosaic--4up">

                    {{-- Column 1: tall card first, short second --}}
                    <div class="hero-mosaic__col">
                        @foreach([0, 1] as $idx)
                            @php $entry = $mosaicItems[$idx] ?? null; $ph = $mosaicPlaceholders[$idx]; @endphp
                            <div class="hero-mosaic__item {{ $idx === 0 ? 'hero-mosaic__item--lg' : 'hero-mosaic__item--sm' }}">
                                @if($entry)
                                    <img src="{{ $entry['listing']->primary_image_url }}"
                                         alt="{{ $entry['listing']->title ?? '' }}"
                                         class="hero-mosaic__img"
                                         @if($idx === 0) loading="eager" fetchpriority="high" @else loading="lazy" @endif>
                                @else
                                    <div class="hero-mosaic__placeholder"></div>
                                @endif
                            </div>
                        @endforeach
                    </div>

                    {{-- Column 2: short card first, tall second (mirror of col 1) --}}
                    <div class="hero-mosaic__col hero-mosaic__col--offset">
                        @foreach([2, 3] as $idx)
                            @php $entry = $mosaicItems[$idx] ?? null; $ph = $mosaicPlaceholders[$idx]; @endphp
                            <div class="hero-mosaic__item {{ $idx === 2 ? 'hero-mosaic__item--sm' : 'hero-mosaic__item--lg' }}">
                                @if($entry)
                                    <img src="{{ $entry['listing']->primary_image_url }}"
                                         alt="{{ $entry['listing']->title ?? '' }}"
                                         class="hero-mosaic__img"
                                         loading="lazy">
                                @else
                                    <div class="hero-mosaic__placeholder"></div>
                                @endif
                            </div>
                        @endforeach
                    </div>

                </div>

            </div>{{-- /col-lg-6 right --}}

        </div>
    </div>
</section>

@once
    @push('scripts')
        <script>
            (function () {
                function activateHeroTab(root, targetId, trigger) {
                    root.querySelectorAll('[data-hero-tab]').forEach(function (btn) {
                        var isActive = btn === trigger;
                        btn.classList.toggle('active', isActive);
                        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                    });

                    root.querySelectorAll('[data-hero-pane]').forEach(function (pane) {
                        var isActive = pane.id === targetId;
                        pane.classList.toggle('active', isActive);
                        pane.classList.toggle('show', isActive);
                        pane.hidden = !isActive;
                    });
                }

                function initHeroSearchTabs() {
                    var root = document.querySelector('[data-hero-search]');
                    if (!root) return;

                    var tabList = root.querySelector('#searchTab');
                    if (!tabList) return;

                    tabList.addEventListener('click', function (event) {
                        var trigger = event.target.closest('[data-hero-tab]');
                        if (!trigger || !tabList.contains(trigger)) return;
                        event.preventDefault();
                        var targetId = trigger.getAttribute('data-hero-target');
                        if (!targetId) return;
                        activateHeroTab(root, targetId, trigger);
                    });

                    tabList.addEventListener('keydown', function (event) {
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        var trigger = event.target.closest('[data-hero-tab]');
                        if (!trigger) return;
                        event.preventDefault();
                        trigger.click();
                    });

                    // Scroll arrows + edge fades
                    var strip = root.querySelector('.hero-tabs-strip');
                    var scrollWrap = strip && strip.parentElement;
                    var arrowLeft  = scrollWrap && scrollWrap.querySelector('.hero-tabs-arrow--left');
                    var arrowRight = scrollWrap && scrollWrap.querySelector('.hero-tabs-arrow--right');

                    function updateEdges() {
                        if (!strip || !scrollWrap) return;
                        var hasOverflow = strip.scrollWidth > strip.clientWidth + 2;
                        var atStart = strip.scrollLeft <= 4;
                        var atEnd   = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
                        scrollWrap.classList.toggle('no-overflow',     !hasOverflow);
                        scrollWrap.classList.toggle('is-scrolled-end', hasOverflow && atEnd);
                        scrollWrap.classList.toggle('is-scrolled-left', !atStart);
                        if (arrowLeft)  arrowLeft.hidden  = atStart;
                        if (arrowRight) arrowRight.hidden = !hasOverflow || atEnd;
                    }

                    if (arrowLeft) {
                        arrowLeft.addEventListener('click', function () {
                            strip.scrollBy({ left: -200, behavior: 'smooth' });
                        });
                    }
                    if (arrowRight) {
                        arrowRight.addEventListener('click', function () {
                            strip.scrollBy({ left: 200, behavior: 'smooth' });
                        });
                    }
                    if (strip) {
                        strip.addEventListener('scroll', updateEdges, { passive: true });
                        window.addEventListener('resize', updateEdges);
                        updateEdges();
                    }
                }

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initHeroSearchTabs);
                } else {
                    initHeroSearchTabs();
                }
            })();
        </script>
    @endpush
@endonce
