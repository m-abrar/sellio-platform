<nav aria-label="breadcrumb" class="d-flex align-items-center gap-3 py-2">
    <a href="{{ route('jobs.index') }}"
       class="btn btn-sm border fw-semibold px-3 rounded-2 d-sm-none d-flex align-items-center transition-all">
        <i class="bi bi-arrow-left-short fs-5 me-1"></i>
        <span class="small">{{ __('Jobs search') }}</span>
    </a>

    <ol class="breadcrumb mb-0 d-none d-md-flex align-items-center bg-white px-3 py-2 rounded-4 border border-color-light">
        <li class="breadcrumb-item">
            <a href="{{ route('home') }}" class="text-muted hover-primary transition-all">
                <i class="bi bi-house-door-fill small"></i>
            </a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('jobs.index') }}" class="text-muted text-decoration-none small fw-500 hover-primary">
                {{ __('Inventory') }}
            </a>
        </li>

        @if ($job->category)
            <li class="breadcrumb-item">
                <a href="{{ route('jobs.index', ['category' => $job->category->slug]) }}" 
                   class="text-muted text-decoration-none small fw-500 hover-primary">
                    {{ $job->category->title }}
                </a>
            </li>
        @endif

        <li class="breadcrumb-item active small fw-800 text-dark tracking-tight" aria-current="page">
            {{ $job->title }}
        </li>
    </ol>
</nav>
