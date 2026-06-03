<section class="hero-section text-center">
    <div class="container-xl">
        {{-- Text Content --}}
        <div class="row pt-2 pt-md-5 pb-2 pb-md-4" data-aos="fade-up">
            <div class="col-12 text-center">
                <span class="badge bg-primary-light border border-primary border-opacity-25 text-primary rounded-pill px-4 py-2 fw-800 mb-3 tracking-wider">
                    {!! page_content('home.hero.badge', __('THE ALL-IN-ONE MARKETPLACE')) !!}
                </span>

                <h1 class="fw-800 display-3 mb-3 tracking-tight text-dark">
                    {!! page_content('home.hero.title', 'Find Everything <span class="text-primary">Extraordinary.</span>') !!}
                </h1>

                <p class="fs-5 text-muted mx-auto mb-5 hero-text-max">
                    {{ page_content('home.hero.description', __('The ultimate destination to buy, sell, and discover premium properties, verified vehicles, and top-tier careers.')) }}
                </p>
            </div>
        </div>

        {{-- Search: tabs sit in their own layer above the panel (no overlap blocking clicks) --}}
        <div class="search-container-wrapper mx-auto hero-search-max" data-hero-search>
            <div class="hero-search-stack">
                <div class="hero-search-tabs-wrap">
                    <ul class="nav nav-pills hero-search-tabs justify-content-center" id="searchTab" role="tablist">
                        @foreach(($publicModules ?? collect())->take(8) as $tab)
                            <li class="nav-item" role="presentation">
                                <div class="pill-group">
                                    <button type="button"
                                            class="nav-link @if($loop->first) active @endif"
                                            id="{{ $tab['id'] }}-tab"
                                            role="tab"
                                            data-hero-tab
                                            data-hero-target="hero-search-{{ $tab['id'] }}"
                                            aria-controls="hero-search-{{ $tab['id'] }}"
                                            aria-selected="{{ $loop->first ? 'true' : 'false' }}">
                                        <i class="bi {{ $tab['icon'] }}" aria-hidden="true"></i>
                                        <span class="visually-hidden">{{ $tab['label'] }}</span>
                                    </button>
                                    <div class="label-text" aria-hidden="true">{{ $tab['label'] }}</div>
                                </div>
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="glass-hero-panel">
                    <div class="tab-content" id="searchTabContent">
                        @include('frontend.unifieds._partials._hero_search_forms')
                    </div>
                </div>
            </div>
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
                    if (!root) {
                        return;
                    }

                    var tabList = root.querySelector('#searchTab');
                    if (!tabList) {
                        return;
                    }

                    tabList.addEventListener('click', function (event) {
                        var trigger = event.target.closest('[data-hero-tab]');
                        if (!trigger || !tabList.contains(trigger)) {
                            return;
                        }

                        event.preventDefault();

                        var targetId = trigger.getAttribute('data-hero-target');
                        if (!targetId) {
                            return;
                        }

                        activateHeroTab(root, targetId, trigger);
                    });

                    tabList.addEventListener('keydown', function (event) {
                        if (event.key !== 'Enter' && event.key !== ' ') {
                            return;
                        }

                        var trigger = event.target.closest('[data-hero-tab]');
                        if (!trigger) {
                            return;
                        }

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
