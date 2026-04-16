{{-- Assumes $job and $employmentMap are passed from the controller --}}
<div class="card glass-surface border-0 shadow-lg overflow-hidden mb-4">
    
    {{-- 1. Premium Header Section --}}
    <div class="p-4 p-lg-5 border-bottom bg-light bg-opacity-50 position-relative">
        <div class="d-flex align-items-start align-items-md-center gap-4 flex-column flex-md-row">
            
            {{-- Dynamic Company Logo --}}
            @php
                $logoUrl = $job->employer->getFirstMediaUrl('avatar', 'thumb') 
                            ?: 'https://ui-avatars.com/api/?name=' . urlencode($job->employer->name) . '&background=059669&color=fff&size=120&font-size=0.45';
                $companyName = $job->employer->name ?? 'N/A';
            @endphp
            
            <div class="position-relative">
                <img src="{{ $logoUrl }}" class="company-logo-header shadow-sm bg-white p-2 rounded-4 border border-white" 
                     alt="{{ $companyName }} Logo" style="width: 100px; height: 100px; object-fit: contain;">
                <span class="position-absolute bottom-0 end-0 badge rounded-circle bg-success p-2 border border-3 border-white" title="Verified Employer">
                    <i class="bi bi-check-lg text-white"></i>
                </span>
            </div>
            
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <h1 class="fw-800 text-dark mb-1 fs-2">{{ $job->title }}</h1>
                </div>
                <h5 class="text-primary-color fw-bold mb-3">{{ $companyName }}</h5>
                
                {{-- Quick Stats Ribbon --}}
                <div class="d-flex flex-wrap gap-3 mt-2">
                    <div class="stats-pill">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                        {{ $job->workplace_type == 1 ? 'Fully Remote' : ($job->city . ', ' . $job->state) }}
                    </div>
                    <div class="stats-pill">
                        <i class="bi bi-briefcase-fill text-primary-color me-1"></i>
                        {{ $employmentMap[$job->employment_type] ?? 'Full-Time' }}
                    </div>
                    <div class="stats-pill bg-success-light text-success fw-bold">
                        <i class="bi bi-cash-stack me-1"></i>
                        ${{ number_format($job->salary_min) }} - ${{ number_format($job->salary_max) }} 
                        <span class="smaller fw-normal">/ {{ Str::title($job->salary_frequency) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- 2. Skills & Tech Tags --}}
    @if ($job->tags->isNotEmpty())
    <div class="px-4 px-lg-5 pt-4">
        <div class="d-flex flex-wrap gap-2">
            @foreach ($job->tags as $tag)
                <span class="badge rounded-pill bg-white border text-muted px-3 py-2 fw-semibold shadow-sm">
                    #{{ $tag->title }}
                </span>
            @endforeach
        </div>
    </div>
    @endif

    {{-- 3. Detailed Body Content --}}
    <div class="p-4 p-lg-5">
        <div class="job-content-area line-height-lg text-muted">
            <h4 class="fw-bold text-dark mb-3"><i class="bi bi-body-text me-2 text-primary-color"></i>Job Description</h4>
            <div class="mb-5 fs-6">
                {!! nl2br(e($job->description)) !!}
            </div>

            <h4 class="fw-bold text-dark mb-3"><i class="bi bi-mortarboard me-2 text-primary-color"></i>Requirements</h4>
            <div class="bg-light bg-opacity-50 rounded-4 p-4 mb-5 border border-white">
                <div class="row g-3">
                    <div class="col-sm-6">
                        <div class="smaller text-uppercase tracking-wider fw-bold text-muted mb-1">Education</div>
                        <div class="text-dark fw-bold">{{ $job->required_education }}</div>
                    </div>
                    <div class="col-sm-6">
                        <div class="smaller text-uppercase tracking-wider fw-bold text-muted mb-1">Experience Level</div>
                        <div class="text-dark fw-bold">{{ Str::title($job->experience_level) }} Level</div>
                    </div>
                </div>
            </div>

            <h4 class="fw-bold text-dark mb-4"><i class="bi bi-gift me-2 text-primary-color"></i>Benefits & Perks</h4>
            <div class="row row-cols-1 row-cols-md-2 g-3 mb-5">
                <div class="col d-flex align-items-center"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Paid Time Off (PTO)</div>
                <div class="col d-flex align-items-center"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Comprehensive Health Coverage</div>
                <div class="col d-flex align-items-center"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Remote / Hybrid Flexibility</div>
                <div class="col d-flex align-items-center"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> 401(k) Retirement Planning</div>
            </div>
        </div>

        {{-- 4. About Company Section --}}
        <div class="mt-5 pt-5 border-top">
            <div class="card bg-primary-light border-0 rounded-4 p-4 p-lg-5 shadow-sm">
                <h4 class="fw-bold text-dark mb-3">About {{ $companyName }}</h4>
                <p class="text-muted mb-4 fs-6">
                    {{ Str::limit($job->employer->profile_summary ?? 'This company is a leading player in the ' . $job->category->title . ' industry.', 300) }}
                </p>
                <a href="{{ route('partner.profile', $job->employer) }}" class="btn btn-white text-primary-color fw-bold rounded-pill px-4 shadow-sm border-0">
                    Explore Company Profile <i class="bi bi-arrow-up-right ms-2"></i>
                </a>
            </div>
        </div>
    </div>
</div>
