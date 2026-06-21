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

                    {{-- White search card --}}
                    <div class="hero-search-card">
                        <div class="tab-content" id="searchTabContent">
                            @include('frontend.unifieds._partials._hero_search_forms')
                        </div>
                    </div>

                </div>{{-- /hero-search-module --}}

                {{-- Stats row --}}
                <div class="hero-stats-row mt-5" data-aos="fade-up" data-aos-delay="250">
                    @if(($totalListingsCount ?? 0) > 0)
                    <div class="hero-stat">
                        <span class="hero-stat__value">{{ number_format($totalListingsCount) }}+</span>
                        <span class="hero-stat__label">{{ __('Active Listings') }}</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    @endif
                    @if(($publicModules ?? collect())->count() > 0)
                    <div class="hero-stat">
                        <span class="hero-stat__value">{{ ($publicModules ?? collect())->count() }}</span>
                        <span class="hero-stat__label">{{ __('Categories') }}</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    @endif
                    <div class="hero-stat">
                        <span class="hero-stat__value">4.8<span class="hero-stat__unit">★</span></span>
                        <span class="hero-stat__label">{{ __('Seller Rating') }}</span>
                    </div>
                </div>

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

                <div class="hero-mosaic hero-mosaic--3up">

                    {{-- Featured column: one tall image --}}
                    @php $e0 = $mosaicItems[0] ?? null; $p0 = $mosaicPlaceholders[0]; @endphp
                    <div class="hero-mosaic__col hero-mosaic__col--featured">
                        <div class="hero-mosaic__item hero-mosaic__item--tall">
                            @if($e0)
                                <img src="{{ $e0['listing']->primary_image_url }}"
                                     alt="{{ $e0['listing']->title ?? '' }}"
                                     class="hero-mosaic__img"
                                     loading="eager" fetchpriority="high">
                            @else
                                <div class="hero-mosaic__placeholder">
                                    <i class="bi {{ $p0['icon'] }} hero-mosaic__placeholder-icon" aria-hidden="true"></i>
                                </div>
                            @endif
                            <div class="hero-mosaic__label">
                                <i class="bi {{ $e0 ? $e0['icon'] : $p0['icon'] }}" aria-hidden="true"></i>
                                {{ $e0 ? $e0['label'] : $p0['label'] }}
                            </div>
                        </div>
                    </div>

                    {{-- Stack column: two images offset down --}}
                    <div class="hero-mosaic__col hero-mosaic__col--stack">
                        @foreach([1, 2] as $idx)
                            @php $entry = $mosaicItems[$idx] ?? null; $ph = $mosaicPlaceholders[$idx]; @endphp
                            <div class="hero-mosaic__item">
                                @if($entry)
                                    <img src="{{ $entry['listing']->primary_image_url }}"
                                         alt="{{ $entry['listing']->title ?? '' }}"
                                         class="hero-mosaic__img"
                                         loading="lazy">
                                @else
                                    <div class="hero-mosaic__placeholder">
                                        <i class="bi {{ $ph['icon'] }} hero-mosaic__placeholder-icon" aria-hidden="true"></i>
                                    </div>
                                @endif
                                <div class="hero-mosaic__label">
                                    <i class="bi {{ $entry ? $entry['icon'] : $ph['icon'] }}" aria-hidden="true"></i>
                                    {{ $entry ? $entry['label'] : $ph['label'] }}
                                </div>
                            </div>
                        @endforeach
                    </div>

                    {{-- Floating live-listings badge --}}
                    <div class="hero-mosaic-badge">
                        <span class="hero-mosaic-badge__dot"></span>
                        @if(($totalListingsCount ?? 0) > 0)
                            {{ number_format($totalListingsCount) }}+&nbsp;{{ __('Active Listings') }}
                        @else
                            {{ __('Live Marketplace') }}
                        @endif
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
