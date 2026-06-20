{{-- Assumes $job is passed from the controller --}}
<div class="apply-sidebar">
    
    {{-- Company Trust/Rating Card (Requires reviews/ratings relationship on Employer) --}}
    @php
        // Placeholder for real rating data
        $averageRating = number_format(4.6, 1); // Example placeholder
        $reviewCount = 125; // Example placeholder
        $companyName = $job->employer->name ?? 'Company';
    @endphp

    <div class="card glass-surface p-4 mb-3 text-center">
        <h5 class="fw-bold mb-3"><i class="bi bi-building-fill me-2 text-primary-color"></i>{{ __('Company Snapshot') }}</h5>
        <p class="h2 fw-bolder text-warning mb-1">{{ $averageRating }}<span class="small fw-normal text-muted"> / 5.0</span></p>
        <div class="text-warning mb-2">
            {{-- Simple star generation based on $averageRating --}}
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
        <a href="{{ route('partner.profile', $job->employer) }}" class="small text-primary-color text-decoration-none mt-2 fw-semibold">{{ __('View Company Profile') }}</a>
    </div>

    {{-- Apply Card (Primary Action) --}}
    <div class="card glass-surface p-4 mb-3">
        <h4 class="fw-bold mb-3">{{ __('Ready to Apply?') }}</h4>
        
        {{-- Deadline --}}
        <div class="mb-4 text-center">
            <p class="mb-1 fw-semibold">{{ __('Application Deadline:') }}</p>
            @php
                $deadline = $job->application_deadline;
                $isExpired = $deadline->isPast();
                $badgeClass = $isExpired ? 'bg-secondary' : 'bg-danger';
            @endphp
            
            <span class="badge text-white fw-bold p-2 fs-6 {{ $badgeClass }}">
                {{ $isExpired ? __('EXPIRED') : $deadline->format('F d, Y') }}
            </span>
            @if (!$isExpired)
                <p class="small text-muted mt-1 mb-0">{{ __('Time remaining:') }} {{ $deadline->diffForHumans(null, true) }}</p>
            @endif
        </div>
        
        {{-- Application Buttons --}}
        <div class="d-grid mb-3">
            {{-- Assumes route('jobs.apply') handles the application form/process --}}
            <a href="{{ route('jobs.apply', $job->slug) }}" class="btn btn-lg fw-bold text-white btn-primary {{ $isExpired ? 'disabled' : '' }}">
                <i class="bi bi-box-arrow-in-right me-2"></i>{{ __('Apply Now') }}
            </a>
        </div>
        <div class="d-grid mb-4">
            {{-- Placeholder for external application link --}}
            <button class="btn btn-lg btn-outline-secondary fw-bold" {{ $isExpired ? 'disabled' : '' }}><i class="bi bi-linkedin me-2"></i>{{ __('Apply with LinkedIn') }}</button>
        </div>

        <hr>
        <div class="text-center small text-muted">
            {{-- Toggle for saving/favoriting the job --}}
            <button 
                class="btn btn-link p-0 text-primary-color text-decoration-none fw-semibold" 
                data-action="toggle-favorite" 
                data-job-id="{{ $job->id }}">
                <i class="bi bi-heart me-1"></i>{{ __('Save This Job') }}
            </button> 
            <span class="mx-1">|</span>
            {{-- Link to follow the company/employer --}}
            <a href="{{ route('partner.profile', $job->employer) }}" class="btn btn-link p-0 text-primary-color text-decoration-none fw-semibold">
                <i class="bi bi-person-add me-1"></i>{{ __('Follow :company', ['company' => $companyName]) }}
            </a>
        </div>
    </div>
    
    {{-- Hiring Process Timeline (Generic) --}}
    <div class="card glass-surface p-4 mb-3">
        <h6 class="fw-bold mb-3"><i class="bi bi-fast-forward me-2 text-primary-color"></i>{{ __('Hiring Process') }}</h6>
        {{-- NOTE: In a real app, this would come from a relationship, but is static here as a feature --}}
        <ul class="list-unstyled small process-timeline">
            <li class="d-flex mb-2">
                <i class="bi bi-1-circle-fill me-3 flex-shrink-0 text-primary-color fs-5"></i>
                <div>**{{ __('Application Review') }}** ({{ __('1-2 Weeks') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-2-circle-fill me-3 flex-shrink-0 text-primary-color fs-5"></i>
                <div>**{{ __('Screening Call') }}** ({{ __('30 min') }})</div>
            </li>
            <li class="d-flex mb-2">
                <i class="bi bi-3-circle-fill me-3 flex-shrink-0 text-primary-color fs-5"></i>
                <div>**{{ __('Technical Interview') }}** ({{ __('1 hr') }})</div>
            </li>
            <li class="d-flex">
                <i class="bi bi-4-circle-fill me-3 flex-shrink-0 text-primary-color fs-5"></i>
                <div>**{{ __('Final Offer') }}**</div>
            </li>
        </ul>
    </div>

    {{-- Hiring Manager Contact --}}
    <div class="card glass-surface p-3 text-center">
        <h6 class="fw-bold mb-2">{{ __('Questions? Contact HR:') }}</h6>
        <p class="small mb-1 text-muted">
            <i class="bi bi-envelope me-2"></i>
            <a href="mailto:{{ $job->employer->email_contact ?? 'careers@company.com' }}" class="text-muted text-decoration-none">
                {{ $job->employer->email_contact ?? 'careers@' . Str::slug($companyName, '') . '.com' }}
            </a>
        </p>
    </div>

</div>
