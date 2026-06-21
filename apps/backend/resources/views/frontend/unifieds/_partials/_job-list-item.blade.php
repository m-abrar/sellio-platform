@php
    $delay = ($iteration ?? 1) * 50;
@endphp

<div data-aos="fade-right" data-aos-delay="{{ $delay }}">
    <a href="{{ route('jobs.show', $job->slug) }}"
       class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom px-0 transition-all border-0">

        <div class="pe-3 overflow-hidden">
            <h6 class="mb-1 job-item__title text-dark text-truncate">
                {{ $job->title }}
            </h6>
            <div class="small d-flex align-items-center flex-wrap">
                <span class="text-primary fw-semibold">
                    {{ $job->company_name ?? $job->user->company ?? __('Verified Partner') }}
                </span>
                <span class="mx-2 text-muted opacity-50">·</span>
                <span class="text-muted text-truncate" style="max-width: 150px;">
                    <i class="bi bi-geo-alt-fill me-1 lc-geo-icon"></i>
                    {{ $job->location?->title ?? __('Remote') }}
                </span>
            </div>
        </div>

        <div class="ms-3 flex-shrink-0">
            <span class="job-item__badge">{{ $job->category?->title ?? __('Full Time') }}</span>
        </div>
    </a>
</div>
