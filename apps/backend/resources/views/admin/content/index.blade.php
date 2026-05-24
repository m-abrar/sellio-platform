{{--
    Administrative Content: Global Fragment Ledger
    
    This view provides the authoritative index of all editable page 
    fragments within the platform's content management system. It 
    facilitates theme-specific content orchestration, tracking active 
    skins, modification timelines, and internal page keys. It serves 
    as the primary interaction gateway for launching high-fidelity 
    content orchestration sessions.
    
    @extends adminlte::page
    @context Content Management Module
    @variables Collection $contentPages Collection of distinctive page/theme content entries.
--}}
@extends('adminlte::page')

@section('title', 'Content Management')

@php
    $resolveVertical = function ($themeKey) use ($themes) {
        $theme = $themes[$themeKey] ?? null;
        $vertical = $theme?->vertical;
        $text = Str::lower($vertical ?: str_replace(['_', '-'], ' ', $themeKey));

        if (Str::contains($text, ['auto', 'car', 'vehicle'])) {
            return ['key' => 'autos', 'label' => 'Automotive', 'icon' => 'fa-car text-orange', 'order' => 10];
        }

        if (Str::contains($text, ['classified'])) {
            return ['key' => 'classifieds', 'label' => 'Classifieds', 'icon' => 'fa-tags text-muted', 'order' => 20];
        }

        if (Str::contains($text, ['ecommerce', 'commerce', 'shop', 'product'])) {
            return ['key' => 'ecommerce', 'label' => 'Online Shop / Retail', 'icon' => 'fa-shopping-cart text-success', 'order' => 30];
        }

        if (Str::contains($text, ['event'])) {
            return ['key' => 'events', 'label' => 'Events & Tickets', 'icon' => 'fa-calendar-alt text-indigo', 'order' => 40];
        }

        if (Str::contains($text, ['job', 'career'])) {
            return ['key' => 'jobs', 'label' => 'Job Board', 'icon' => 'fa-briefcase text-teal', 'order' => 50];
        }

        if (Str::contains($text, ['property', 'properties', 'real estate', 'rental'])) {
            return ['key' => 'properties', 'label' => 'Real Estate', 'icon' => 'fa-home text-primary', 'order' => 60];
        }

        if (Str::contains($text, ['service'])) {
            return ['key' => 'services', 'label' => 'Service Marketplace', 'icon' => 'fa-tools text-info', 'order' => 70];
        }

        return ['key' => 'general', 'label' => 'Unified / Multi-Purpose', 'icon' => 'fa-store text-primary', 'order' => 90];
    };

    $contentByVertical = $contentPages
        ->groupBy(fn ($entry) => $resolveVertical($entry->theme_key)['key'])
        ->sortBy(fn ($entries) => $resolveVertical($entries->first()->theme_key)['order']);

    $activeVerticalKey = $contentByVertical->keys()->first() ?: 'general';
    $totalSlots = $contentPages->sum('slots_count');
    $totalPages = $contentPages->pluck('page')->unique()->count();
@endphp

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary opacity-50"></i> Content Studio
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Choose a vertical, then edit the safe storefront slots for each theme.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid content-studio pb-5">
    @include('admin.alert')

    <div class="content-overview mb-4">
        <div class="overview-tile">
            <span>{{ __('Verticals') }}</span>
            <strong>{{ $contentByVertical->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span>{{ __('Themes') }}</span>
            <strong>{{ $themeKeys->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span>{{ __('Pages') }}</span>
            <strong>{{ $totalPages }}</strong>
        </div>
        <div class="overview-tile">
            <span>{{ __('Editable slots') }}</span>
            <strong>{{ $totalSlots }}</strong>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <div>
                <h5 class="card-title font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> {{ __('Theme Content Library') }}
                </h5>
                <p class="text-muted small mb-0">{{ __('Structured fields keep the storefront flexible without letting layout break.') }}</p>
            </div>
            <div class="input-group input-group-premium content-search">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-search text-xs text-muted"></i></span>
                </div>
                <input type="search" id="content-search" class="form-control" placeholder="Search theme or page">
            </div>
        </div>

        <div class="card-body p-0">
            <div class="row no-gutters">
                <div class="col-md-3 border-right bg-light-soft">
                    <div class="nav flex-column nav-pills content-vertical-nav p-4" id="content-vertical-tab" role="tablist" aria-orientation="vertical">
                        @foreach($contentByVertical as $verticalKey => $entries)
                            @php
                                $verticalMeta = $resolveVertical($entries->first()->theme_key);
                                $isActiveVertical = $verticalKey === $activeVerticalKey;
                            @endphp
                            <a class="nav-link mb-2 {{ $isActiveVertical ? 'active shadow-sm' : '' }} smallest uppercase font-weight-bold letter-spacing-1"
                               id="content-vertical-{{ Str::slug($verticalKey) }}-tab"
                               data-toggle="pill"
                               href="#content-vertical-{{ Str::slug($verticalKey) }}"
                               role="tab">
                                <div class="d-flex align-items-center">
                                    <i class="fas {{ $verticalMeta['icon'] }} mr-2 opacity-75"></i>
                                    <span>{{ $verticalMeta['label'] }}</span>
                                    <span class="badge badge-light-soft text-muted ml-auto px-2 py-1 rounded">{{ $entries->pluck('theme_key')->unique()->count() }}</span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>

                <div class="col-md-9 bg-white">
                    <div class="tab-content p-4 p-lg-5" id="content-vertical-tabContent">
                        @forelse($contentByVertical as $verticalKey => $entries)
                            @php
                                $verticalMeta = $resolveVertical($entries->first()->theme_key);
                                $isActiveVertical = $verticalKey === $activeVerticalKey;
                                $themesInVertical = $entries->groupBy('theme_key');
                            @endphp

                            <div class="tab-pane fade {{ $isActiveVertical ? 'show active' : '' }}"
                                 id="content-vertical-{{ Str::slug($verticalKey) }}"
                                 role="tabpanel"
                                 data-vertical-panel>
                                <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4">
                                    <div>
                                        <h4 class="font-weight-bold mb-1 text-dark">{{ $verticalMeta['label'] }}</h4>
                                        <p class="text-muted small mb-0">
                                            {{ $themesInVertical->count() }} {{ Str::plural('theme', $themesInVertical->count()) }},
                                            {{ $entries->count() }} {{ Str::plural('page', $entries->count()) }},
                                            {{ $entries->sum('slots_count') }} {{ Str::plural('slot', $entries->sum('slots_count')) }}
                                        </p>
                                    </div>
                                    <div class="mt-3 mt-lg-0 h-px bg-light flex-grow-1 ml-lg-4"></div>
                                </div>

                                <div class="content-theme-stack">
                                    @foreach($themesInVertical as $themeKey => $themeEntries)
                                        @php
                                            $theme = $themes[$themeKey] ?? null;
                                            $themeTitle = $theme?->title ?: Str::of($themeKey)->replace('_', ' ')->title();
                                        @endphp

                                        <section class="content-theme-panel"
                                                 data-theme-panel
                                                 data-search="{{ Str::lower($verticalMeta['label'] . ' ' . $themeKey . ' ' . $themeTitle . ' ' . $themeEntries->pluck('page')->implode(' ')) }}">
                                            <div class="content-theme-header">
                                                <div>
                                                    <span class="theme-kicker">{{ $themeKey }}</span>
                                                    <h5>{{ $themeTitle }}</h5>
                                                </div>
                                                <a href="{{ config('app.storefront_url') }}/preview/{{ $themeKey }}" target="_blank" class="btn btn-light btn-sm rounded-pill font-weight-bold">
                                                    <i class="fas fa-eye mr-1"></i> {{ __('Preview') }}
                                                </a>
                                            </div>

                                            <div class="content-page-grid">
                                                @foreach($themeEntries as $contentEntry)
                                                    <article class="content-page-card"
                                                             data-content-card
                                                             data-search="{{ Str::lower($verticalMeta['label'] . ' ' . $themeKey . ' ' . $themeTitle . ' ' . $contentEntry->page) }}">
                                                        <div class="content-page-main">
                                                            <div class="content-page-icon">
                                                                <i class="fas fa-file-alt"></i>
                                                            </div>
                                                            <div class="min-w-0">
                                                                <h6>{{ Str::of($contentEntry->page)->replace('_', ' ')->title() }}</h6>
                                                                <code>{{ $contentEntry->page }}</code>
                                                            </div>
                                                        </div>

                                                        <div class="content-page-meta">
                                                            <span><i class="fas fa-cubes"></i>{{ $contentEntry->slots_count }} {{ Str::plural('slot', $contentEntry->slots_count) }}</span>
                                                            <span><i class="far fa-clock"></i>{{ $contentEntry->latest_update ? \Carbon\Carbon::parse($contentEntry->latest_update)->diffForHumans() : __('Never updated') }}</span>
                                                        </div>

                                                        <div class="content-page-footer">
                                                            <span class="content-status">{{ __('Structured') }}</span>
                                                            <a href="{{ route('admin.content.edit', ['page' => $contentEntry->page, 'theme_key' => $contentEntry->theme_key]) }}"
                                                               class="btn btn-primary btn-sm">
                                                                <i class="fas fa-pen mr-1"></i> {{ __('Edit slots') }}
                                                            </a>
                                                        </div>
                                                    </article>
                                                @endforeach
                                            </div>
                                        </section>
                                    @endforeach
                                </div>

                                <div class="empty-content d-none" data-panel-empty>
                                    <i class="fas fa-search"></i>
                                    <h5>{{ __('No content found in this vertical') }}</h5>
                                    <p>{{ __('Try another theme name, page key, or vertical.') }}</p>
                                </div>
                            </div>
                        @empty
                            <div class="empty-content">
                                <i class="fas fa-folder-open"></i>
                                <h5>{{ __('No editable content exists yet') }}</h5>
                                <p>{{ __('Open a theme from Theme Manager to generate safe content slots.') }}</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4">
            <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                <i class="fas fa-shield-alt mr-1 text-info"></i> {{ __('Only approved text and media slots are editable. Layout structure remains protected in code.') }}
            </span>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    .content-studio {
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

    .content-overview {
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

    .content-search {
        width: min(360px, 100%);
    }

    .content-studio .content-search .form-control {
        padding-left: 12px !important;
        text-indent: 0;
    }

    .content-vertical-nav .nav-link {
        color: #4a5568;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .content-vertical-nav .nav-link.active {
        color: var(--accent) !important;
        background: #fff !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06) !important;
    }

    .content-theme-stack {
        display: grid;
        gap: 16px;
    }

    .content-theme-panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        overflow: hidden;
    }

    .content-theme-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 18px;
        border-bottom: 1px solid var(--line);
        background: #fff;
    }

    .theme-kicker {
        display: inline-block;
        margin-bottom: 4px;
        color: var(--accent);
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .content-theme-header h5 {
        margin: 0;
        color: var(--ink);
        font-size: 1rem;
        font-weight: 800;
    }

    .content-page-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 14px;
        padding: 18px;
        background: #fcfdff;
    }

    .content-page-card {
        display: flex;
        min-height: 190px;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .content-page-card:hover {
        border-color: #bfdbfe;
        box-shadow: 0 14px 30px rgba(37, 99, 235, 0.09);
        transform: translateY(-1px);
    }

    .content-page-main {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }

    .content-page-icon {
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

    .content-page-card h6 {
        margin: 0 0 7px;
        color: var(--ink);
        font-size: 0.95rem;
        font-weight: 800;
    }

    .content-page-card code {
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

    .content-page-meta {
        display: grid;
        gap: 8px;
        margin: 16px 0;
        color: var(--muted);
        font-size: 0.84rem;
    }

    .content-page-meta span {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .content-page-meta i {
        width: 16px;
        color: #94a3b8;
        text-align: center;
    }

    .content-page-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-top: 14px;
        border-top: 1px solid var(--line);
    }

    .content-status {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 10px;
        color: var(--success);
        background: var(--success-soft);
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .empty-content {
        padding: 44px 24px;
        text-align: center;
    }

    .empty-content i {
        margin-bottom: 16px;
        color: #cbd5e1;
        font-size: 2.4rem;
    }

    .empty-content h5 {
        margin-bottom: 6px;
        color: var(--ink);
        font-weight: 800;
    }

    .empty-content p {
        margin-bottom: 0;
        color: var(--muted);
    }

    .min-w-0 {
        min-width: 0;
    }

    @media (max-width: 991.98px) {
        .content-overview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .content-search {
            width: 100%;
            margin-top: 14px;
        }
    }

    @media (max-width: 575.98px) {
        .content-overview,
        .content-page-grid {
            grid-template-columns: 1fr;
        }

        .overview-tile {
            padding: 14px;
        }

        .content-theme-header,
        .content-page-footer {
            align-items: flex-start;
            flex-direction: column;
        }

        .content-page-footer .btn,
        .content-theme-header .btn {
            width: 100%;
        }
    }
</style>
@endsection

@section('js')
<script>
    $(function () {
        const searchInput = document.getElementById('content-search');

        function updateActivePanel() {
            const panel = document.querySelector('.tab-pane.active[data-vertical-panel]');
            if (!panel || !searchInput) {
                return;
            }

            const query = searchInput.value.trim().toLowerCase();
            const cards = Array.from(panel.querySelectorAll('[data-content-card]'));
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

            themes.forEach(function (theme) {
                const themeMatches = !query || theme.dataset.search.includes(query);
                const hasVisibleCard = theme.querySelectorAll('[data-content-card]:not(.d-none)').length > 0;
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
