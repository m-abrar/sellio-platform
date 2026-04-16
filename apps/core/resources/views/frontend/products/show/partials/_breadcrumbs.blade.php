<nav aria-label="breadcrumb" class="d-flex align-items-center gap-3 py-2">

    <!-- Mobile Back Button -->
    <a href="{{ route('classifieds.index', ['category' => $categorySlug ?? null]) }}"
       class="btn btn-sm btn-glass-back d-sm-none d-flex align-items-center px-3 rounded-pill shadow-sm transition-all">
        <i class="bi bi-arrow-left-short fs-5 me-1"></i>
        <span class="fw-bold small text-uppercase tracking-wider">
            {{ __('Classifieds') }}
        </span>
    </a>

    <!-- Desktop Breadcrumb -->
    <ol class="breadcrumb mb-0 d-none d-md-flex align-items-center bg-glass-light px-3 py-2 rounded-pill border border-color-light shadow-sm">

        <!-- Home -->
        <li class="breadcrumb-item">
            <a href="{{ route('home') }}" class="text-muted hover-primary transition-all">
                <i class="bi bi-house-door-fill small"></i>
            </a>
        </li>

        <!-- Classifieds Index -->
        <li class="breadcrumb-item">
            <a href="{{ route('classifieds.index') }}"
               class="text-muted text-decoration-none small fw-500 hover-primary">
                {{ __('Classifieds') }}
            </a>
        </li>

        <!-- Category (Optional) -->
        @if (!empty($categorySlug))
            <li class="breadcrumb-item">
                <a href="{{ route('classifieds.index', ['category' => $categorySlug]) }}"
                   class="text-muted text-decoration-none small fw-500 hover-primary">
                    {{ $categoryName }}
                </a>
            </li>
        @endif

        <!-- Title -->
        <li class="breadcrumb-item active small fw-800 text-dark tracking-tight" aria-current="page">
            {{ $pageTitle }}
        </li>

    </ol>
</nav>

<style>
    /* Premium Nav Styling */
    .btn-glass-back {
        background: white;
        border: 1px solid var(--border-color);
        color: var(--text-dark);
    }
    .btn-glass-back:hover {
        background: var(--primary-color);
        color: white !important;
        border-color: var(--primary-color);
        transform: translateX(-3px);
    }
    .breadcrumb-item + .breadcrumb-item::before {
        content: "›";
        font-size: 1.2rem;
        line-height: 1;
        vertical-align: middle;
        color: var(--text-muted);
        opacity: 0.5;
    }
    .hover-primary:hover { color: var(--primary-color) !important; }
</style>
