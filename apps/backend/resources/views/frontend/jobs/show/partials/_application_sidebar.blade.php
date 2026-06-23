{{-- Assumes $job is passed from the controller --}}
<div class="apply-sidebar">

    @php
        $averageRating = number_format(4.6, 1);
        $reviewCount = 125;
        $companyName = $job->employer->name ?? 'Company';
    @endphp

    {{-- Company Trust/Rating Card --}}
    <div class="card detail-sidebar-card mb-3 overflow-hidden">
        <div class="p-4" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
            <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">
                <i class="bi bi-building-fill me-1"></i>{{ __('Employer') }}
            </p>
            <h4 class="fw-800 text-dark mb-0" style="font-family:var(--font-heading)">{{ __('Company Snapshot') }}</h4>
        </div>
        <div class="p-4 text-center">
            <p class="h2 fw-bolder mb-1" style="color:var(--primary-color)">{{ $averageRating }}<span class="small fw-normal text-muted"> / 5.0</span></p>
            <div class="mb-2" style="color:var(--primary-color)">
                @for ($i = 1; $i <= 5; $i++)
                    @if ($averageRating >= $i)
                        <i class="bi bi-star-fill"></i>
                    @elseif ($averageRating >= $i - 0.5)
                        <i class="bi bi-star-half"></i>
                    @else
                        <i class="bi bi-star"></i>
                    @endif
                @endfor
            </div>
            <p class="small text-muted mb-2">{{ __('Based on :count employee reviews', ['count' => number_format($reviewCount)]) }}</p>
            <a href="{{ route('partner.profile', $job->employer) }}" class="small text-decoration-none fw-semibold d-block" style="color:var(--primary-color)">{{ __('View company profile') }}</a>
        </div>
    </div>

    {{-- Apply Card (Primary Action) --}}
    <div class="card detail-sidebar-card p-4 mb-3">
        <h4 class="fw-800 mb-3">{{ __('Ready to apply?') }}</h4>

        <div class="mb-4 text-center">
            <p class="mb-1 fw-semibold">{{ __('Application deadline:') }}</p>
            @php
                $deadline = $job->application_deadline;
                $isExpired = $deadline->isPast();
                $badgeClass = $isExpired ? 'bg-secondary' : 'bg-danger';
            @endphp

            <span class="fw-semibold px-3 py-2 rounded-2 d-inline-block small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color);border:1.5px solid rgba(var(--primary-color-rgb),.2)">
                {{ $isExpired ? __('Expired') : $deadline->format('F d, Y') }}
            </span>
            @if (!$isExpired)
                <p class="small text-muted mt-1 mb-0">{{ __('Time remaining:') }} {{ $deadline->diffForHumans(null, true) }}</p>
            @endif
        </div>

        <div class="d-grid mb-3">
            <a href="{{ route('jobs.apply', $job->slug) }}" class="btn btn-primary btn-header-cta {{ $isExpired ? 'disabled' : '' }}">
                <i class="bi bi-box-arrow-in-right me-2"></i>{{ __('Apply now') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        </div>
        <div class="d-grid mb-4">
            <button class="btn btn-outline-secondary fw-semibold" {{ $isExpired ? 'disabled' : '' }}>
                <i class="bi bi-linkedin me-2"></i>{{ __('Apply with LinkedIn') }}
            </button>
        </div>

        <hr>
        <div class="text-center small text-muted">
            <button
                class="btn btn-link p-0 text-decoration-none fw-semibold"
                style="color:var(--primary-color)"
                data-action="toggle-favorite"
                data-job-id="{{ $job->id }}">
                <i class="bi bi-heart me-1"></i>{{ __('Save this job') }}
            </button>
            <span class="mx-1">|</span>
            <a href="{{ route('partner.profile', $job->employer) }}" class="btn btn-link p-0 text-decoration-none fw-semibold" style="color:var(--primary-color)">
                <i class="bi bi-person-add me-1"></i>{{ __('Follow :company', ['company' => $companyName]) }}
            </a>
        </div>
    </div>

    {{-- Hiring Process Timeline --}}
    <div class="card detail-sidebar-card p-4 mb-3">
        <h6 class="fw-semibold mb-3"><i class="bi bi-fast-forward me-2" style="color:var(--primary-color)"></i>{{ __('Hiring process') }}</h6>
        <ul class="list-unstyled small process-timeline">
            <li class="d-flex mb-2">
                <i class="bi bi-1-circle-fill me-3 flex-shrink-0 fs-5" style="color:var(--primary-color)"></i>
                <div><strong>{{ __('Application Review') }}</strong> ({{ __('1–2 weeks') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-2-circle-fill me-3 flex-shrink-0 fs-5" style="color:var(--primary-color)"></i>
                <div><strong>{{ __('Screening Call') }}</strong> ({{ __('30 min') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-3-circle-fill me-3 flex-shrink-0 fs-5" style="color:var(--primary-color)"></i>
                <div><strong>{{ __('Technical Interview') }}</strong> ({{ __('1 hr') }})</div>
            </li>
            <li class="d-flex">
                <i class="bi bi-4-circle-fill me-3 flex-shrink-0 fs-5" style="color:var(--primary-color)"></i>
                <div><strong>{{ __('Final Offer') }}</strong></div>
            </li>
        </ul>
    </div>

    {{-- Hiring Manager Contact --}}
    <div class="card detail-sidebar-card p-3 text-center">
        <h6 class="fw-semibold mb-2">{{ __('Questions? Contact HR:') }}</h6>
        <p class="small mb-1 text-muted">
            <i class="bi bi-envelope me-2"></i>
            <a href="mailto:{{ $job->employer->email_contact ?? 'careers@company.com' }}" class="text-muted text-decoration-none">
                {{ $job->employer->email_contact ?? 'careers@' . Str::slug($companyName, '') . '.com' }}
            </a>
        </p>
    </div>

</div>
