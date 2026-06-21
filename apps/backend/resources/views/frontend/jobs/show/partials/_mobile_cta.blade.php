<div class="fixed-bottom d-lg-none py-2 bg-dark border-top z-30" id="sticky-apply-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            <span class="h6 fw-bold text-white mb-0 d-block">{{ $job->title }}</span>
            <span class="small fw-semibold text-success"><i class="bi bi-currency-dollar me-1"></i> {{ $job->salary_range_formatted }}</span>
        </div>
        <button class="btn btn-primary fw-bold text-white"><i class="bi bi-box-arrow-in-right me-2"></i>{{ __('Apply Now') }}</button>
    </div>
</div>
