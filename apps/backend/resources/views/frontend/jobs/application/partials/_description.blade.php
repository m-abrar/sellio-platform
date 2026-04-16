{{-- Assumes $job is passed from the controller --}}
<div class="card glass-surface p-4">
    
    {{-- Company/Job Header --}}
    <div class="d-flex align-items-center mb-4">
        {{-- Company Logo/Avatar --}}
        @php
            $logoUrl = $job->employer->getFirstMediaUrl('avatar', 'thumb') 
                        ?: 'https://ui-avatars.com/api/?name=' . urlencode($job->employer->name) . '&background=059669&color=fff&size=100&font-size=0.45';
            $companyName = $job->employer->name ?? 'N/A';
        @endphp
        <img src="{{ $logoUrl }}" class="company-logo-header flex-shrink-0 me-4 rounded-circle" alt="{{ $companyName }} Logo">
        
        <div>
            <h1 class="fw-bold mb-1">{{ $job->title }}</h1>
            <h4 class="text-muted fw-normal mb-2">{{ $companyName }}</h4>
            
            {{-- Job Quick Stats --}}
            <div class="d-flex gap-3 small text-muted flex-wrap">
                <span><i class="bi bi-geo-alt me-1"></i> **{{ $job->workplace_type == 1 ? 'Fully Remote' : ($job->city . ', ' . $job->state) }}**</span>
                <span><i class="bi bi-person-workspace me-1"></i> **{{ $employmentMap[$job->employment_type] ?? 'Full-Time' }}**</span>
                <span class="text-success fw-bold">
                    <i class="bi bi-currency-dollar me-1"></i> 
                    **${{ number_format($job->salary_min) }} - ${{ number_format($job->salary_max) }}**
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
        <h5 class="fw-bold mb-3"><i class="bi bi-tags-fill me-2 text-primary-color"></i>Key Skills & Tech</h5>
        <div class="d-flex flex-wrap gap-2 small">
            @foreach ($job->tags as $tag)
                <span class="badge rounded-pill bg-primary-light text-primary-color px-3 py-2 fw-semibold">{{ $tag->title }}</span>
            @endforeach
        </div>
    </div>
    <hr>
    @endif
    
    {{-- Job Summary / Full Description --}}
    <h4 class="fw-bold mt-4 mb-3">Job Description</h4>
    <div class="text-muted">{!! nl2br(e($job->description)) !!}</div>
    
    {{-- Key Attributes List (Responsibilities/Qualifications) --}}
    <h4 class="fw-bold mt-4 mb-3">Required Education & Experience</h4>
    <ul class="list-group list-group-flush small mb-4">
        <li class="list-group-item bg-transparent"><i class="bi bi-patch-check me-2 text-primary-color"></i>**Education:** {{ $job->required_education }}</li>
        <li class="list-group-item bg-transparent"><i class="bi bi-patch-check me-2 text-primary-color"></i>**Experience:** {{ Str::title($job->experience_level) }} Level</li>
    </ul>

    {{-- Employee Benefits Section (Placeholder/Example) --}}
    <h4 class="fw-bold mt-4 mb-3"><i class="bi bi-heart-fill me-2 text-primary-color"></i>Benefits & Perks</h4>
    <div class="row row-cols-2 g-3 small mb-4">
        {{-- Assuming you might have a benefits relationship or hardcode common ones --}}
        <div class="col"><span class="badge bg-success-light text-success"><i class="bi bi-calendar-check me-1"></i> PTO</span></div>
        <div class="col"><span class="badge bg-success-light text-success"><i class="bi bi-hospital me-1"></i> Health Coverage</span></div>
        <div class="col"><span class="badge bg-success-light text-success"><i class="bi bi-laptop me-1"></i> Remote/Hybrid</span></div>
        <div class="col"><span class="badge bg-success-light text-success"><i class="bi bi-gear me-1"></i> 401k</span></div>
    </div>

    <hr>

    {{-- About Company (Link to Brand/Employer Page) --}}
    <h4 class="fw-bold mt-4 mb-3">About {{ $companyName }}</h4>
    <p class="text-muted small">
        {{ Str::limit($job->employer->profile_summary ?? 'This company is a leading player in the ' . $job->category->title . ' industry.', 300) }}
        <a href="{{ route('partner.profile', $job->employer) }}" class="fw-semibold">View Company Profile</a>
    </p>

</div>
