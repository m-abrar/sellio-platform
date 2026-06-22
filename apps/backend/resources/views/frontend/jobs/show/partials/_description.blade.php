{{-- Assumes $job and $employmentMap are passed from the controller --}}
<div class="detail-main-card border-0 overflow-hidden mb-4">
    
    {{-- 1. Premium Header Section --}}
    <div class="p-4 p-lg-5 border-bottom bg-light bg-opacity-50 position-relative">
        <div class="d-flex align-items-start align-items-md-center gap-4 flex-column flex-md-row">
            
            {{-- Dynamic Company Logo --}}
            @php
                $logoUrl = $job->employer->getFirstMediaUrl('avatar', 'thumb')
                            ?: 'https://ui-avatars.com/api/?name=' . urlencode($job->employer->name) . '&background=E05F2C&color=fff&size=120&font-size=0.45';
                $companyName = $job->employer->name ?? __('N/A');
            @endphp
            
            <div class="position-relative">
                <img src="{{ $logoUrl }}" class="company-logo-header shadow-sm bg-white p-2 rounded-4 border border-white" 
                     alt="{{ $companyName }} {{ __('Logo') }}" style="width: 100px; height: 100px; object-fit: contain;">
                <span class="position-absolute bottom-0 end-0 badge rounded-circle bg-success p-2 border border-3 border-white" title="{{ __('Verified Employer') }}">
                    <i class="bi bi-check-lg text-white"></i>
                </span>
            </div>
            
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <h1 class="fw-800 text-dark mb-1 fs-2">{{ $job->title }}</h1>
                </div>
                <h5 class="text-primary fw-semibold mb-3">{{ $companyName }}</h5>
                
                {{-- Quick Stats Ribbon --}}
                <div class="d-flex flex-wrap gap-3 mt-2">
                    <div class="stats-pill">
                        <i class="bi bi-geo-alt-fill lc-geo-icon me-1"></i>
                        {{ $job->workplace_type == 3 ? __('Fully Remote') : ($job->city . ', ' . $job->state) }}
                    </div>
                    <div class="stats-pill">
                        <i class="bi bi-briefcase-fill text-primary me-1"></i>
                        {{ $employmentMap[$job->employment_type] ?? __('Full-Time') }}
                    </div>
                    <div class="stats-pill bg-success-light text-success fw-bold">
                        <i class="bi bi-cash-stack me-1"></i>
                        {{ setting('currency_symbol', '$') }}{{ number_format($job->salary_min) }} - {{ setting('currency_symbol', '$') }}{{ number_format($job->salary_max) }} 
                        <span class="smaller fw-normal">/ {{ __(Str::title($job->salary_frequency)) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- 2. Skills & Tech Tags --}}
    @if ($job->tags->isNotEmpty())
    <div class="px-4 px-lg-5 pt-4">
        <div class="amenities-grid">
            @foreach ($job->tags as $tag)
                <span class="amenity-chip">
                    <i class="bi bi-hash amenity-chip__icon" aria-hidden="true"></i>
                    <span class="amenity-chip__label">{{ $tag->title }}</span>
                </span>
            @endforeach
        </div>
    </div>
    @endif

    {{-- 3. Detailed Body Content --}}
    <div class="p-4 p-lg-5">
        <div class="job-content-area line-height-lg text-muted">
            <h4 class="fw-800 text-dark mb-3 detail-section-title"><i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Job Description') }}</h4>
            <div class="mb-5 fs-6">
                {!! nl2br(e($job->description)) !!}
            </div>

            <h4 class="fw-800 text-dark mb-3 detail-section-title"><i class="bi bi-mortarboard me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Requirements') }}</h4>
            <div class="mb-5" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07);border-radius:14px;padding:20px 24px">
                <div class="row g-3">
                    <div class="col-sm-6">
                        <div class="smaller text-uppercase tracking-wider fw-bold text-muted mb-1">{{ __('Education') }}</div>
                        <div class="text-dark fw-bold">{{ $job->required_education }}</div>
                    </div>
                    <div class="col-sm-6">
                        <div class="smaller text-uppercase tracking-wider fw-bold text-muted mb-1">{{ __('Experience Level') }}</div>
                        <div class="text-dark fw-bold">{{ $experienceMap[$job->experience_level] ?? Str::title($job->experience_level) }}</div>
                    </div>
                </div>
            </div>

            <h4 class="fw-800 text-dark mb-4 detail-section-title"><i class="bi bi-gift me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Benefits & Perks') }}</h4>
            <div class="amenities-grid mb-5">
                <div class="amenity-chip"><i class="bi bi-check2-circle amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('Paid Time Off (PTO)') }}</span></div>
                <div class="amenity-chip"><i class="bi bi-check2-circle amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('Comprehensive Health Coverage') }}</span></div>
                <div class="amenity-chip"><i class="bi bi-check2-circle amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('Remote / Hybrid Flexibility') }}</span></div>
                <div class="amenity-chip"><i class="bi bi-check2-circle amenity-chip__icon"></i><span class="amenity-chip__label">{{ __('401(k) Retirement Planning') }}</span></div>
            </div>
        </div>

        {{-- 4. About Company Section --}}
        <div class="mt-5 pt-5 border-top">
            <div class="card bg-primary-light border-0 rounded-4 p-4 p-lg-5 shadow-sm">
                <h4 class="fw-bold text-dark mb-3">{{ __('About') }} {{ $companyName }}</h4>
                <p class="text-muted mb-4 fs-6">
                    {{ Str::limit($job->employer->profile_summary ?? __('This company is a leading player in the :category industry.', ['category' => $job->category->title]), 300) }}
                </p>
                <a href="{{ route('partner.profile', $job->employer) }}" class="btn btn-primary btn-header-cta px-4">
                    {{ __('Explore company profile') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
    </div>
</div>
