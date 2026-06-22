{{-- Assumes $job is passed from the controller --}}
<div class="card bg-white border p-4">

    {{-- Company/Job Header --}}
    <div class="d-flex align-items-center mb-4">
        {{-- Company Logo/Avatar --}}
        @php
            $logoUrl = $job->employer->getFirstMediaUrl('avatar', 'thumb')
                        ?: asset('images/fallbacks/default-avatar.png');
            $companyName = $job->employer->name ?? 'N/A';
        @endphp
        <img src="{{ $logoUrl }}" class="company-logo-header flex-shrink-0 me-4 rounded-circle" alt="{{ $companyName }} Logo">

        <div>
            <h1 class="fw-bold mb-1">{{ $job->title }}</h1>
            <h4 class="text-muted fw-normal mb-2">{{ $companyName }}</h4>

            {{-- Job Quick Stats --}}
            <div class="d-flex gap-3 small text-muted flex-wrap">
                <span><i class="bi bi-geo-alt me-1"></i> <strong>{{ $job->workplace_type == 1 ? __('Fully Remote') : ($job->city . ', ' . $job->state) }}</strong></span>
                <span><i class="bi bi-person-workspace me-1"></i> <strong>{{ $employmentMap[$job->employment_type] ?? __('Full-Time') }}</strong></span>
                <span class="fw-bold" style="color:var(--primary-color)">
                    <i class="bi bi-currency-dollar me-1"></i>
                    <strong>${{ number_format($job->salary_min) }} - ${{ number_format($job->salary_max) }}</strong>
                    / {{ Str::title($job->salary_frequency) }}
                </span>
                <span><i class="bi bi-clock me-1"></i> Posted {{ $job->created_at->diffForHumans() }}</span>
            </div>
        </div>
    </div>

    <hr>

    {{-- Core Job Tags/Skills --}}
    @if ($job->tags->isNotEmpty())
    <div class="mb-4">
        <h5 class="fw-bold mb-3"><i class="bi bi-tags-fill me-2" style="color:var(--primary-color)"></i>{{ __('Key Skills & Tech') }}</h5>
        <div class="amenities-grid">
            @foreach ($job->tags as $tag)
                <div class="amenity-chip">
                    <i class="bi bi-tag amenity-chip__icon" aria-hidden="true"></i>
                    <span class="amenity-chip__label">{{ $tag->title }}</span>
                </div>
            @endforeach
        </div>
    </div>
    <hr>
    @endif

    {{-- Job Summary / Full Description --}}
    <h4 class="fw-bold mt-4 mb-3">{{ __('Job Description') }}</h4>
    <div class="text-muted">{!! nl2br(e($job->description)) !!}</div>

    {{-- Key Attributes List (Responsibilities/Qualifications) --}}
    <h4 class="fw-bold mt-4 mb-3">{{ __('Required Education & Experience') }}</h4>
    <div style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07);border-radius:14px;overflow:hidden" class="mb-4">
        <div class="d-flex align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
            <i class="bi bi-patch-check me-3" style="color:var(--primary-color)"></i>
            <div><span class="fw-semibold small text-dark">{{ __('Education:') }}</span> <span class="small text-muted">{{ $job->required_education }}</span></div>
        </div>
        <div class="d-flex align-items-center px-4 py-3">
            <i class="bi bi-patch-check me-3" style="color:var(--primary-color)"></i>
            <div><span class="fw-semibold small text-dark">{{ __('Experience:') }}</span> <span class="small text-muted">{{ Str::title($job->experience_level) }} {{ __('Level') }}</span></div>
        </div>
    </div>

    {{-- Employee Benefits Section --}}
    <h4 class="fw-bold mt-4 mb-3"><i class="bi bi-heart-fill me-2" style="color:var(--primary-color)"></i>{{ __('Benefits & Perks') }}</h4>
    <div class="amenities-grid mb-4">
        <div class="amenity-chip"><i class="bi bi-calendar-check amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('PTO') }}</span></div>
        <div class="amenity-chip"><i class="bi bi-hospital amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('Health Coverage') }}</span></div>
        <div class="amenity-chip"><i class="bi bi-laptop amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('Remote/Hybrid') }}</span></div>
        <div class="amenity-chip"><i class="bi bi-gear amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('401k') }}</span></div>
    </div>

    <hr>

    {{-- About Company (Link to Brand/Employer Page) --}}
    <h4 class="fw-bold mt-4 mb-3">{{ __('About :name', ['name' => $companyName]) }}</h4>
    <p class="text-muted small">
        {{ Str::limit($job->employer->profile_summary ?? 'This company is a leading player in the ' . $job->category->title . ' industry.', 300) }}
        <a href="{{ route('partner.profile', $job->employer) }}" class="fw-semibold">{{ __('View Company Profile') }}</a>
    </p>

</div>
