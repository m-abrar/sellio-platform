<article class="jbl-listing-card bg-white border rounded-4 d-flex align-items-stretch overflow-hidden transition-all hover-up">

    {{-- Company logo mark ------------------------------------------------ --}}
    <div class="jbl-company-mark flex-shrink-0 d-flex align-items-center justify-content-center">
        <div class="jbl-company-logo-wrap">
            <img src="{{ $job->employer->avatar_url }}"
                 alt="{{ $job->employer->name }}"
                 class="jbl-company-logo">
        </div>
    </div>

    {{-- Main content ----------------------------------------------------- --}}
    <div class="jbl-card-body flex-grow-1 min-w-0 py-4 pe-3">
        <div class="d-flex align-items-start gap-2 mb-1">
            <div class="min-w-0 flex-grow-1">
                <a href="{{ route('jobs.show', $job->slug) }}"
                   class="text-decoration-none d-block">
                    <h5 class="jbl-job-title mb-0 line-clamp-1">{{ $job->title }}</h5>
                </a>
                <p class="jbl-company-name mb-0">
                    <i class="bi bi-building me-1"></i>{{ $job->employer->name }}
                </p>
            </div>
            @if($job->is_featured)
                <span class="badge bg-danger fw-semibold flex-shrink-0" style="font-size:.7rem;white-space:nowrap">
                    <i class="bi bi-patch-check-fill me-1"></i>{{ __('Featured') }}
                </span>
            @endif
        </div>

        <div class="jbl-meta-row mt-2">
            <span class="jbl-meta-chip">
                <i class="bi bi-geo-alt-fill"></i>
                {{ $job->location->title ?? $job->city ?? __('Global') }}
            </span>
            <span class="jbl-meta-chip">
                <i class="bi bi-clock-fill"></i>
                {{ $job->type->title ?? __('Full-Time') }}
            </span>
            <span class="jbl-meta-chip">
                <i class="bi bi-laptop-fill"></i>
                {{ $job->workplace_label }}
            </span>
            @isset($job->category)
                <span class="jbl-meta-chip jbl-meta-chip--category">
                    {{ $job->category->title }}
                </span>
            @endisset
        </div>
    </div>

    {{-- Right rail -------------------------------------------------------- --}}
    <div class="jbl-card-side flex-shrink-0 d-none d-md-flex flex-column align-items-end justify-content-between py-4 ps-3 pe-4">
        <div class="text-end">
            @if($job->salary_range_formatted)
                <div class="jbl-salary">{{ $job->salary_range_formatted }}</div>
            @endif
            <div class="jbl-posted-time mt-1">
                {{ $job->created_at->diffForHumans(null, true) }} {{ __('ago') }}
            </div>
        </div>
        <a href="{{ route('jobs.show', $job->slug) }}"
           class="btn btn-sm btn-outline-primary fw-semibold px-3 mt-3">
            {{ __('View Job') }} <i class="bi bi-arrow-right ms-1"></i>
        </a>
    </div>

</article>
