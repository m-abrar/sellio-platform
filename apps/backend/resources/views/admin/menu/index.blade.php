{{-- Administrative menu explorer for theme navigation slots. --}}
@extends('adminlte::page')

@section('title', 'Menu Explorer')

@php
    $totalItems = $menus->sum('items_count');
    $activeFilterLabel = $selectedTheme ?: __('All themes');

    $resolveVertical = function ($themeKey) {
        $text = Str::lower(str_replace(['_', '-'], ' ', $themeKey));

        if (Str::contains($text, ['auto', 'car', 'vehicle'])) {
            return ['key' => 'autos', 'label' => 'Automotive', 'short' => 'Autos', 'icon' => 'fa-car text-orange', 'order' => 10];
        }

        if (Str::contains($text, ['classified'])) {
            return ['key' => 'classifieds', 'label' => 'Classifieds', 'short' => 'Classifieds', 'icon' => 'fa-tags text-muted', 'order' => 20];
        }

        if (Str::contains($text, ['ecommerce', 'commerce', 'shop', 'product'])) {
            return ['key' => 'ecommerce', 'label' => 'Online Shop / Retail', 'short' => 'Ecommerce', 'icon' => 'fa-shopping-cart text-success', 'order' => 30];
        }

        if (Str::contains($text, ['event'])) {
            return ['key' => 'events', 'label' => 'Events & Tickets', 'short' => 'Events', 'icon' => 'fa-calendar-alt text-indigo', 'order' => 40];
        }

        if (Str::contains($text, ['job', 'career'])) {
            return ['key' => 'jobs', 'label' => 'Job Board', 'short' => 'Jobs', 'icon' => 'fa-briefcase text-teal', 'order' => 50];
        }

        if (Str::contains($text, ['property', 'properties', 'real estate', 'rental'])) {
            return ['key' => 'properties', 'label' => 'Real Estate', 'short' => 'Properties', 'icon' => 'fa-home text-primary', 'order' => 60];
        }

        if (Str::contains($text, ['service'])) {
            return ['key' => 'services', 'label' => 'Service Marketplace', 'short' => 'Services', 'icon' => 'fa-tools text-info', 'order' => 70];
        }

        if (Str::contains($text, ['blog', 'article'])) {
            return ['key' => 'blogs', 'label' => 'Publishing / Blogs', 'short' => 'Blogs', 'icon' => 'fa-newspaper text-secondary', 'order' => 80];
        }

        if (Str::contains($text, ['unified', 'marketplace'])) {
            return ['key' => 'marketplace', 'label' => 'Unified / Multi-Purpose', 'short' => 'Marketplace', 'icon' => 'fa-store text-primary', 'order' => 90];
        }

        return ['key' => 'general', 'label' => 'General', 'short' => 'General', 'icon' => 'fa-layer-group text-secondary', 'order' => 100];
    };

    $resolveMenuGroup = function ($menu) {
        $text = Str::lower($menu->title . ' ' . $menu->location_key);

        if (Str::contains($text, ['header', 'nav', 'main', 'primary', 'mega'])) {
            return ['key' => 'header', 'label' => 'Header navigation', 'icon' => 'fas fa-window-maximize'];
        }

        if (Str::contains($text, ['footer', 'bottom'])) {
            return ['key' => 'footer', 'label' => 'Footer navigation', 'icon' => 'fas fa-shoe-prints'];
        }

        if (Str::contains($text, ['mobile', 'drawer', 'offcanvas'])) {
            return ['key' => 'mobile', 'label' => 'Mobile navigation', 'icon' => 'fas fa-mobile-alt'];
        }

        if (Str::contains($text, ['sidebar', 'side', 'account', 'dashboard'])) {
            return ['key' => 'sidebar', 'label' => 'Sidebar navigation', 'icon' => 'fas fa-columns'];
        }

        return ['key' => 'other', 'label' => 'Other menu areas', 'icon' => 'fas fa-compass'];
    };

    $menusByVertical = $menus
        ->groupBy(fn ($menu) => $resolveVertical($menu->theme_key)['key'])
        ->sortBy(fn ($verticalMenus) => $resolveVertical($verticalMenus->first()->theme_key)['order']);

    $activeVerticalKey = $selectedTheme
        ? $resolveVertical($selectedTheme)['key']
        : ($menusByVertical->keys()->first() ?: 'general');
@endphp

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sitemap mr-2 text-primary opacity-50"></i> {{ __('Menu Explorer') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Browse verticals first, choose a theme, then manage its navigation menus.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid menu-explorer pb-5">
    @include('admin.alert')

    <div class="menu-overview mb-4">
        <div class="overview-tile">
            <span>Verticals</span>
            <strong>{{ $menusByVertical->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span>Themes</span>
            <strong>{{ $themeKeys->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span>Menu slots</span>
            <strong>{{ $menus->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span>Links</span>
            <strong>{{ $totalItems }}</strong>
        </div>
    </div>

    <div class="card card-premium overflow-hidden border-0 shadow-premium rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <div>
                <h5 class="card-title font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-route mr-2 text-primary opacity-50"></i> {{ __('Navigation Library') }}
                </h5>
                <p class="text-muted small mb-0">{{ __('Current context: :context', ['context' => $activeFilterLabel]) }}</p>
            </div>
            <div class="input-group input-group-premium explorer-search">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-search text-xs text-muted"></i></span>
                </div>
                <input type="search" id="menu-search" class="form-control" placeholder="{{ __('Search current vertical') }}">
            </div>
        </div>

        <div class="card-body p-0">
            <div class="row no-gutters">
                <div class="col-md-3 border-right bg-light-soft">
                    <div class="nav flex-column nav-pills vertical-menu-nav p-4" id="menu-vertical-tab" role="tablist" aria-orientation="vertical">
                        @foreach ($menusByVertical as $verticalKey => $verticalMenus)
                            @php
                                $verticalMeta = $resolveVertical($verticalMenus->first()->theme_key);
                                $isActiveVertical = $verticalKey === $activeVerticalKey;
                                $verticalThemes = $verticalMenus->groupBy('theme_key');
                            @endphp
                            <a class="nav-link mb-2 {{ $isActiveVertical ? 'active shadow-sm' : '' }} smallest uppercase font-weight-bold letter-spacing-1"
                               id="menu-vertical-{{ Str::slug($verticalKey) }}-tab"
                               data-toggle="pill"
                               href="#menu-vertical-{{ Str::slug($verticalKey) }}"
                               role="tab">
                                <div class="d-flex align-items-center">
                                    <i class="fas {{ $verticalMeta['icon'] }} mr-2 opacity-75"></i>
                                    <span>{{ $verticalMeta['label'] }}</span>
                                    <span class="badge badge-light-soft text-muted ml-auto px-2 py-1 rounded">{{ $verticalThemes->count() }}</span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>

                <div class="col-md-9 bg-white">
                    <div class="tab-content p-4 p-lg-5" id="menu-vertical-tabContent">
                        @forelse ($menusByVertical as $verticalKey => $verticalMenus)
                            @php
                                $verticalMeta = $resolveVertical($verticalMenus->first()->theme_key);
                                $verticalThemes = $verticalMenus->groupBy('theme_key');
                                $isActiveVertical = $verticalKey === $activeVerticalKey;
                            @endphp

                            <div class="tab-pane fade {{ $isActiveVertical ? 'show active' : '' }}"
                                 id="menu-vertical-{{ Str::slug($verticalKey) }}"
                                 role="tabpanel"
                                 data-vertical-panel>
                                <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4">
                                    <div>
                                        <h4 class="font-weight-bold mb-1 text-dark">{{ $verticalMeta['label'] }}</h4>
                                        <p class="text-muted small mb-0">
                                            {{ $verticalThemes->count() }} {{ Str::plural('theme', $verticalThemes->count()) }},
                                            {{ $verticalMenus->count() }} {{ Str::plural('menu slot', $verticalMenus->count()) }},
                                            {{ $verticalMenus->sum('items_count') }} {{ Str::plural('link', $verticalMenus->sum('items_count')) }}
                                        </p>
                                    </div>
                                    <div class="mt-3 mt-lg-0 h-px bg-light flex-grow-1 ml-lg-4"></div>
                                </div>

                                <div class="theme-menu-stack">
                                    @foreach ($verticalThemes as $themeKey => $themeMenus)
                                        @php
                                            $themeId = 'theme-menu-' . Str::slug($verticalKey . '-' . $themeKey);
                                            $isOpenTheme = ($selectedTheme && $isActiveVertical) ? $selectedTheme === $themeKey : $loop->first;
                                            $themeLinks = $themeMenus->sum('items_count');
                                        @endphp

                                        <section class="theme-menu-panel" data-theme-panel data-search="{{ Str::lower($verticalMeta['label'] . ' ' . $themeKey) }}">
                                            <button class="theme-menu-toggle {{ $isOpenTheme ? '' : 'collapsed' }}"
                                                    type="button"
                                                    data-toggle="collapse"
                                                    data-target="#{{ $themeId }}"
                                                    aria-expanded="{{ $isOpenTheme ? 'true' : 'false' }}">
                                                <span class="theme-menu-title">
                                                    <i class="fas fa-palette"></i>
                                                    <span>{{ $themeKey }}</span>
                                                </span>
                                                <span class="theme-menu-meta">
                                                    {{ $themeMenus->count() }} {{ Str::plural('slot', $themeMenus->count()) }} &middot; {{ $themeLinks }} {{ Str::plural('link', $themeLinks) }}
                                                    <i class="fas fa-chevron-down"></i>
                                                </span>
                                            </button>

                                            <div id="{{ $themeId }}" class="collapse {{ $isOpenTheme ? 'show' : '' }}" data-parent="#menu-vertical-{{ Str::slug($verticalKey) }}">
                                                <div class="theme-menu-body">
                                                    @foreach ($themeMenus->groupBy(fn ($menu) => $resolveMenuGroup($menu)['key']) as $groupMenus)
                                                        @php
                                                            $groupMeta = $resolveMenuGroup($groupMenus->first());
                                                            $groupItems = $groupMenus->sum('items_count');
                                                        @endphp

                                                        <div class="menu-purpose-group" data-menu-group>
                                                            <div class="menu-purpose-header">
                                                                <div>
                                                                    <i class="{{ $groupMeta['icon'] }}"></i>
                                                                    <span>{{ $groupMeta['label'] }}</span>
                                                                </div>
                                                                <small>{{ $groupMenus->count() }} {{ Str::plural('slot', $groupMenus->count()) }} &middot; {{ $groupItems }} {{ Str::plural('link', $groupItems) }}</small>
                                                            </div>

                                                            <div class="menu-card-grid">
                                                                @foreach ($groupMenus as $menu)
                                                                    @php($menuGroup = $resolveMenuGroup($menu))
                                                                    <article class="menu-card"
                                                                        data-menu-card
                                                                        data-search="{{ Str::lower($verticalMeta['label'] . ' ' . $themeKey . ' ' . $menu->title . ' ' . $menu->location_key . ' ' . $menuGroup['label']) }}">
                                                                        <div class="menu-card-main">
                                                                            <div class="menu-icon">
                                                                                <i class="{{ $menuGroup['icon'] }}"></i>
                                                                            </div>
                                                                            <div class="min-w-0">
                                                                                <h5>{{ $menu->title }}</h5>
                                                                                <code>{{ $menu->location_key }}</code>
                                                                            </div>
                                                                        </div>

                                                                        <div class="menu-card-meta">
                                                                            <span><i class="fas fa-link"></i>{{ $menu->items_count }} {{ Str::plural('link', $menu->items_count) }}</span>
                                                                            <span><i class="fas fa-level-up-alt"></i>{{ $menu->top_level_items_count }} top level</span>
                                                                            <span><i class="far fa-clock"></i>{{ optional($menu->updated_at)->diffForHumans() ?: __('Never updated') }}</span>
                                                                        </div>

                                                                        <div class="menu-card-footer">
                                                                            <span class="menu-status {{ $menu->status === 'active' ? 'is-active' : '' }}">
                                                                                {{ ucfirst($menu->status ?? 'draft') }}
                                                                            </span>
                                                                            <a href="{{ route('admin.menu.edit', $menu) }}" class="btn btn-primary btn-sm">
                                                                                <i class="fas fa-pen mr-1"></i> Manage links
                                                                            </a>
                                                                        </div>
                                                                    </article>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    @endforeach
                                                </div>
                                            </div>
                                        </section>
                                    @endforeach
                                </div>

                                <div class="empty-explorer d-none" data-panel-empty>
                                    <i class="fas fa-search"></i>
                                    <h5>No menus found in this vertical</h5>
                                    <p>Try another theme, menu name, or location key.</p>
                                </div>
                            </div>
                        @empty
                            <div class="empty-explorer">
                                <i class="fas fa-map-signs"></i>
                                <h5>No menu locations found</h5>
                                <p>Menu slots are created by the active theme configuration.</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    .menu-explorer {
        --surface: #ffffff;
        --surface-soft: #f8fafc;
        --line: #e5e7eb;
        --ink: #111827;
        --muted: #64748b;
        --accent: #2563eb;
        --accent-soft: #eff6ff;
        --success: #15803d;
        --success-soft: #ecfdf5;
    }

    .menu-overview {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
    }

    .overview-tile {
        padding: 18px 20px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
    }

    .overview-tile span {
        display: block;
        color: var(--muted);
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
    }

    .overview-tile strong {
        display: block;
        margin-top: 4px;
        color: var(--ink);
        font-size: 1.45rem;
        line-height: 1.15;
    }

    .explorer-search {
        width: min(360px, 100%);
    }

    .menu-explorer .explorer-search .form-control {
        padding-left: 12px !important;
        text-indent: 0;
    }

    .vertical-menu-nav .nav-link {
        color: #4a5568;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .vertical-menu-nav .nav-link.active {
        color: var(--accent) !important;
        background: #fff !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06) !important;
    }

    .theme-menu-stack {
        display: grid;
        gap: 14px;
    }

    .theme-menu-panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        overflow: hidden;
    }

    .theme-menu-toggle {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 16px 18px;
        border: 0;
        background: #fff;
        color: var(--ink);
        text-align: left;
    }

    .theme-menu-title {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 10px;
        font-size: 0.95rem;
        font-weight: 800;
    }

    .theme-menu-title i {
        color: var(--accent);
    }

    .theme-menu-meta {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 10px;
        color: var(--muted);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .theme-menu-toggle.collapsed .theme-menu-meta .fa-chevron-down {
        transform: rotate(-90deg);
    }

    .theme-menu-body {
        padding: 0 18px 18px;
        border-top: 1px solid var(--line);
        background: #fcfdff;
    }

    .menu-purpose-group {
        padding-top: 16px;
    }

    .menu-purpose-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 10px;
    }

    .menu-purpose-header div {
        display: flex;
        align-items: center;
        gap: 9px;
        color: var(--ink);
        font-size: 0.9rem;
        font-weight: 800;
    }

    .menu-purpose-header i {
        color: var(--accent);
    }

    .menu-purpose-header small {
        color: var(--muted);
        font-size: 0.76rem;
        font-weight: 700;
    }

    .menu-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 14px;
    }

    .menu-card {
        display: flex;
        min-height: 200px;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .menu-card:hover {
        border-color: #bfdbfe;
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.09);
        transform: translateY(-1px);
    }

    .menu-card-main {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }

    .menu-icon {
        display: inline-flex;
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: var(--accent);
        background: var(--accent-soft);
    }

    .menu-card h5 {
        margin: 0 0 7px;
        color: var(--ink);
        font-size: 0.95rem;
        font-weight: 800;
        line-height: 1.3;
    }

    .menu-card code {
        display: inline-block;
        max-width: 100%;
        padding: 4px 7px;
        border-radius: 6px;
        color: #334155;
        background: var(--surface-soft);
        font-size: 0.76rem;
        white-space: normal;
        word-break: break-word;
    }

    .menu-card-meta {
        display: grid;
        gap: 8px;
        margin: 16px 0;
        color: var(--muted);
        font-size: 0.84rem;
    }

    .menu-card-meta span {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .menu-card-meta i {
        width: 16px;
        color: #94a3b8;
        text-align: center;
    }

    .menu-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-top: 14px;
        border-top: 1px solid var(--line);
    }

    .menu-status {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.72rem;
        font-weight: 800;
        background: var(--surface-soft);
        color: #475569;
        text-transform: uppercase;
    }

    .menu-status.is-active {
        color: var(--success);
        background: var(--success-soft);
    }

    .empty-explorer {
        padding: 44px 24px;
        text-align: center;
    }

    .empty-explorer i {
        margin-bottom: 16px;
        color: #cbd5e1;
        font-size: 2.4rem;
    }

    .empty-explorer h5 {
        margin-bottom: 6px;
        color: var(--ink);
        font-weight: 800;
    }

    .empty-explorer p {
        margin-bottom: 0;
        color: var(--muted);
    }

    .min-w-0 {
        min-width: 0;
    }

    @media (max-width: 991.98px) {
        .menu-overview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .explorer-search {
            width: 100%;
            margin-top: 14px;
        }
    }

    @media (max-width: 575.98px) {
        .menu-overview,
        .menu-card-grid {
            grid-template-columns: 1fr;
        }

        .overview-tile {
            padding: 14px;
        }

        .theme-menu-toggle,
        .menu-purpose-header,
        .menu-card-footer {
            align-items: flex-start;
            flex-direction: column;
        }

        .theme-menu-meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
        }

        .menu-card-footer .btn {
            width: 100%;
        }
    }
</style>
@endsection

@section('js')
<script>
    $(function () {
        const searchInput = document.getElementById('menu-search');

        function updateActivePanel() {
            const panel = document.querySelector('.tab-pane.active[data-vertical-panel]');
            if (!panel || !searchInput) {
                return;
            }

            const query = searchInput.value.trim().toLowerCase();
            const cards = Array.from(panel.querySelectorAll('[data-menu-card]'));
            const groups = Array.from(panel.querySelectorAll('[data-menu-group]'));
            const themes = Array.from(panel.querySelectorAll('[data-theme-panel]'));
            const empty = panel.querySelector('[data-panel-empty]');
            let visibleCards = 0;

            cards.forEach(function (card) {
                const isVisible = !query || card.dataset.search.includes(query);
                card.classList.toggle('d-none', !isVisible);
                if (isVisible) {
                    visibleCards += 1;
                }
            });

            groups.forEach(function (group) {
                const hasVisibleCard = group.querySelectorAll('[data-menu-card]:not(.d-none)').length > 0;
                group.classList.toggle('d-none', !hasVisibleCard);
            });

            themes.forEach(function (theme) {
                const themeMatches = !query || theme.dataset.search.includes(query);
                const hasVisibleCard = theme.querySelectorAll('[data-menu-card]:not(.d-none)').length > 0;
                theme.classList.toggle('d-none', !themeMatches && !hasVisibleCard);
            });

            if (empty) {
                empty.classList.toggle('d-none', visibleCards !== 0 || cards.length === 0);
            }
        }

        searchInput?.addEventListener('input', updateActivePanel);
        $('a[data-toggle="pill"]').on('shown.bs.tab', function () {
            if (searchInput) {
                searchInput.value = '';
            }
            updateActivePanel();
        });

        updateActivePanel();
    });
</script>
@endsection
