<nav aria-label="breadcrumb" class="d-flex align-items-center gap-3 py-2">
    <a href="{{ route('events.index') }}" 
       class="btn btn-sm btn-glass-back d-sm-none d-flex align-items-center px-3 rounded-pill shadow-sm transition-all">
        <i class="bi bi-arrow-left-short fs-5 me-1"></i>
        <span class="fw-bold small text-uppercase tracking-wider">{{ __('Home') }}</span>
    </a>

    <ol class="breadcrumb mb-0 d-none d-md-flex align-items-center bg-white px-3 py-2 rounded-3 border border-color-light">
        <li class="breadcrumb-item">
            <a href="{{ route('home') }}" class="text-muted hover-primary transition-all">
                <i class="bi bi-house-door-fill small"></i>
            </a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('events.index') }}" class="text-muted text-decoration-none small fw-500 hover-primary">
                {{ __('Events') }}
            </a>
        </li>

        @if ($event->category)
            <li class="breadcrumb-item">
                <a href="{{ route('events.index', ['category' => $event->category->slug]) }}" 
                   class="text-muted text-decoration-none small fw-500 hover-primary">
                    {{ $event->category->title ?? __('Event Search') }}
                </a>
            </li>
        @endif

        <li class="breadcrumb-item active small fw-800 text-dark tracking-tight" aria-current="page">
            {{ Str::limit($event->title, 40) }}
        </li>
    </ol>
</nav>
