@php
    /** * We use a smaller delay (50ms) for list items so the 
     * sequence finishes quickly as the user scrolls.
     */
    $delay = ($iteration ?? 1) * 50;
@endphp

<div data-aos="fade-right" data-aos-delay="{{ $delay }}">
    <a href="{{ route('jobs.show', $job) }}" 
       class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom px-0 transition-all border-0">
        
        <div class="pe-3 overflow-hidden">
            {{-- Job Title --}}
            <h6 class="mb-1 fw-800 text-dark text-truncate hvr-text-primary">
                {{ $job->title }}
            </h6>
            
            {{-- Company and Location Meta --}}
            <div class="small d-flex align-items-center flex-wrap">
                <span class="text-primary fw-bold">
                    {{ $job->company_name ?? $job->user->company ?? __('Verified Partner') }}
                </span> 
                
                <span class="mx-2 text-muted opacity-50">•</span> 
                
                <span class="text-muted text-truncate" style="max-width: 150px;">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                    {{ $job->location?->title ?? __('Remote') }}
                </span>
            </div>
        </div>

        {{-- Category/Type Badge --}}
        <div class="ms-3 flex-shrink-0">
            <span class="badge bg-primary-light text-primary rounded-pill fw-800 px-3 py-2 border border-primary border-opacity-10" 
                  style="font-size: 0.65rem; letter-spacing: 0.5px;">
                <i class="bi bi-clock-history me-1"></i>
                {{ strtoupper($job->category?->title ?? __('Full Time')) }}
            </span>
        </div>
    </a>
</div>