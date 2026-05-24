{{-- Administrative menu explorer for theme navigation slots. --}}
@extends('adminlte::page')

@section('title', 'Menu Explorer')

@php
    $menusByTheme = $menus->groupBy('theme_key');
    $totalItems = $menus->sum('items_count');
    $activeFilterLabel = $selectedTheme ?: __('All themes');
@endphp

@section('content_header')
    <div class="container-fluid pt-4 menu-explorer">
        <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between mb-4">
            <div>
                <div class="text-muted small font-weight-bold text-uppercase mb-2">Navigation</div>
                <h1 class="m-0 text-dark font-weight-bold">Menu Explorer</h1>
                <p class="text-muted mt-2 mb-0">Find a theme, inspect its menu areas, and jump straight into link editing.</p>
            </div>
            <div class="mt-3 mt-lg-0">
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
            <span class="overview-label">Menu slots</span>
            <strong>{{ $menus->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span class="overview-label">Themes</span>
            <strong>{{ $themeKeys->count() }}</strong>
        </div>
        <div class="overview-tile">
            <span class="overview-label">Links</span>
            <strong>{{ $totalItems }}</strong>
        </div>
        <div class="overview-tile overview-tile-wide">
            <span class="overview-label">Viewing</span>
            <strong>{{ $activeFilterLabel }}</strong>
        </div>
    </div>

    <div class="explorer-toolbar mb-4">
        <div class="explorer-search">
            <i class="fas fa-search"></i>
            <input type="search" id="menu-search" class="form-control" placeholder="Search menus, themes, or locations">
        </div>
        <div class="theme-filter">
            <a href="{{ route('admin.menu.index') }}" class="theme-chip {{ empty($selectedTheme) ? 'active' : '' }}">
                All
            </a>
            @foreach ($themeKeys as $themeKey)
                <a href="{{ route('admin.menu.index', ['theme' => $themeKey]) }}" class="theme-chip {{ $selectedTheme === $themeKey ? 'active' : '' }}">
                    {{ $themeKey }}
                </a>
            @endforeach
        </div>
    </div>

    @forelse ($menusByTheme as $themeKey => $themeMenus)
        <section class="theme-section mb-4" data-theme-section>
            <div class="theme-section-header">
                <div>
                    <span class="theme-kicker">Theme</span>
                    <h2>{{ $themeKey }}</h2>
                </div>
                <span class="theme-count">{{ $themeMenus->count() }} {{ Str::plural('slot', $themeMenus->count()) }}</span>
            </div>

            <div class="menu-card-grid">
                @foreach ($themeMenus as $menu)
                    <article class="menu-card"
                        data-menu-card
                        data-search="{{ Str::lower($menu->title . ' ' . $menu->theme_key . ' ' . $menu->location_key) }}">
                        <div class="menu-card-main">
                            <div class="menu-icon">
                                <i class="fas fa-route"></i>
                            </div>
                            <div class="min-w-0">
                                <h3>{{ $menu->title }}</h3>
                                <code>{{ $menu->location_key }}</code>
                            </div>
                        </div>

                        <div class="menu-card-meta">
                            <span>
                                <i class="fas fa-link"></i>
                                {{ $menu->items_count }} {{ Str::plural('link', $menu->items_count) }}
                            </span>
                            <span>
                                <i class="fas fa-level-up-alt"></i>
                                {{ $menu->top_level_items_count }} top level
                            </span>
                            <span>
                                <i class="far fa-clock"></i>
                                {{ optional($menu->updated_at)->diffForHumans() ?: __('Never updated') }}
                            </span>
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
        </section>
    @empty
        <div class="empty-explorer">
            <i class="fas fa-map-signs"></i>
            <h3>No menu locations found</h3>
            <p>Menu slots are created by the active theme configuration.</p>
        </div>
    @endforelse

    <div id="menu-no-results" class="empty-explorer d-none">
        <i class="fas fa-search"></i>
        <h3>No matching menus</h3>
        <p>Try another theme, title, or location key.</p>
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

    .overview-tile,
    .explorer-toolbar,
    .empty-explorer {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
    }

    .overview-tile {
        padding: 18px 20px;
    }

    .overview-label,
    .theme-kicker {
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

    .explorer-toolbar {
        display: flex;
        gap: 14px;
        align-items: center;
        justify-content: space-between;
        padding: 14px;
    }

    .explorer-search {
        position: relative;
        flex: 1 1 320px;
    }

    .explorer-search i {
        position: absolute;
        top: 50%;
        left: 14px;
        color: var(--muted);
        transform: translateY(-50%);
    }

    .explorer-search .form-control {
        height: 42px;
        padding-left: 40px;
        border-radius: 8px;
        border-color: var(--line);
        box-shadow: none;
    }

    .theme-filter {
        display: flex;
        flex: 1 1 auto;
        gap: 8px;
        justify-content: flex-end;
        overflow-x: auto;
        padding-bottom: 2px;
    }

    .theme-chip {
        display: inline-flex;
        align-items: center;
        min-height: 36px;
        padding: 0 14px;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: #334155;
        background: var(--surface-soft);
        font-size: 0.82rem;
        font-weight: 700;
        white-space: nowrap;
    }

    .theme-chip:hover,
    .theme-chip.active {
        color: var(--accent);
        border-color: #bfdbfe;
        background: var(--accent-soft);
        text-decoration: none;
    }

    .theme-section {
        padding: 8px 0 4px;
    }

    .theme-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
    }

    .theme-section-header h2 {
        margin: 2px 0 0;
        color: var(--ink);
        font-size: 1.15rem;
        font-weight: 800;
    }

    .theme-count,
    .menu-status {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.74rem;
        font-weight: 800;
        background: var(--surface-soft);
        color: #475569;
        text-transform: uppercase;
    }

    .menu-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 14px;
    }

    .menu-card {
        display: flex;
        min-height: 210px;
        flex-direction: column;
        justify-content: space-between;
        padding: 18px;
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
        gap: 14px;
        align-items: flex-start;
    }

    .menu-icon {
        display: inline-flex;
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: var(--accent);
        background: var(--accent-soft);
    }

    .menu-card h3 {
        margin: 0 0 7px;
        color: var(--ink);
        font-size: 1rem;
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
        font-size: 0.78rem;
        white-space: normal;
        word-break: break-word;
    }

    .menu-card-meta {
        display: grid;
        gap: 8px;
        margin: 18px 0;
        color: var(--muted);
        font-size: 0.86rem;
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

    .menu-status.is-active {
        color: var(--success);
        background: var(--success-soft);
    }

    .empty-explorer {
        padding: 48px 24px;
        text-align: center;
    }

    .empty-explorer i {
        margin-bottom: 16px;
        color: #cbd5e1;
        font-size: 2.5rem;
    }

    .empty-explorer h3 {
        margin-bottom: 6px;
        color: var(--ink);
        font-size: 1.1rem;
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

        .explorer-toolbar {
            align-items: stretch;
            flex-direction: column;
        }

        .theme-filter {
            justify-content: flex-start;
        }
    }

    @media (max-width: 575.98px) {
        .menu-overview,
        .menu-card-grid {
            grid-template-columns: 1fr;
        }

        .theme-section,
        .overview-tile,
        .explorer-toolbar {
            padding: 14px;
        }

        .theme-section {
            padding-right: 0;
            padding-left: 0;
        }

        .menu-card-footer {
            align-items: stretch;
            flex-direction: column;
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
        const cards = Array.from(document.querySelectorAll('[data-menu-card]'));
        const sections = Array.from(document.querySelectorAll('[data-theme-section]'));
        const noResults = document.getElementById('menu-no-results');

        function updateExplorer() {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCards = 0;

            cards.forEach(function (card) {
                const isVisible = !query || card.dataset.search.includes(query);
                card.classList.toggle('d-none', !isVisible);
                if (isVisible) {
                    visibleCards += 1;
                }
            });

            sections.forEach(function (section) {
                const hasVisibleCard = section.querySelectorAll('[data-menu-card]:not(.d-none)').length > 0;
                section.classList.toggle('d-none', !hasVisibleCard);
            });

            noResults.classList.toggle('d-none', visibleCards !== 0 || cards.length === 0);
        }

        searchInput.addEventListener('input', updateExplorer);
    });
</script>
@endsection
