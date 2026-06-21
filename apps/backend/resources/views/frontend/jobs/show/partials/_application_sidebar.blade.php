{{-- Assumes $job is passed from the controller --}}
<div class="apply-sidebar">

    @php
        $averageRating = number_format(4.6, 1);
        $reviewCount = 125;
        $companyName = $job->employer->name ?? 'Company';
    @endphp

    {{-- Company Trust/Rating Card --}}
    <div class="card detail-sidebar-card p-4 mb-3 text-center">
        <h5 class="fw-semibold mb-3"><i class="bi bi-building-fill me-2 text-primary"></i>{{ __('Company snapshot') }}</h5>
        <p class="h2 fw-bolder text-warning mb-1">{{ $averageRating }}<span class="small fw-normal text-muted"> / 5.0</span></p>
        <div class="text-warning mb-2">
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
        <p class="small text-muted mb-0">{{ __('Based on :count employee reviews', ['count' => number_format($reviewCount)]) }}</p>
        <a href="{{ route('partner.profile', $job->employer) }}" class="small text-primary text-decoration-none mt-2 fw-semibold d-block">{{ __('View company profile') }}</a>
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

            <span class="badge text-white fw-semibold p-2 fs-6 rounded-2 {{ $badgeClass }}">
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
                class="btn btn-link p-0 text-primary text-decoration-none fw-semibold"
                data-action="toggle-favorite"
                data-job-id="{{ $job->id }}">
                <i class="bi bi-heart me-1"></i>{{ __('Save this job') }}
            </button>
            <span class="mx-1">|</span>
            <a href="{{ route('partner.profile', $job->employer) }}" class="btn btn-link p-0 text-primary text-decoration-none fw-semibold">
                <i class="bi bi-person-add me-1"></i>{{ __('Follow :company', ['company' => $companyName]) }}
            </a>
        </div>
    </div>

    {{-- Hiring Process Timeline --}}
    <div class="card detail-sidebar-card p-4 mb-3">
        <h6 class="fw-semibold mb-3"><i class="bi bi-fast-forward me-2 text-primary"></i>{{ __('Hiring process') }}</h6>
        <ul class="list-unstyled small process-timeline">
            <li class="d-flex mb-2">
                <i class="bi bi-1-circle-fill me-3 flex-shrink-0 text-primary fs-5"></i>
                <div><strong>{{ __('Application Review') }}</strong> ({{ __('1–2 weeks') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-2-circle-fill me-3 flex-shrink-0 text-primary fs-5"></i>
                <div><strong>{{ __('Screening Call') }}</strong> ({{ __('30 min') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-3-circle-fill me-3 flex-shrink-0 text-primary fs-5"></i>
                <div><strong>{{ __('Technical Interview') }}</strong> ({{ __('1 hr') }})</div>
            </li>
            <li class="d-flex">
                <i class="bi bi-4-circle-fill me-3 flex-shrink-0 text-primary fs-5"></i>
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
