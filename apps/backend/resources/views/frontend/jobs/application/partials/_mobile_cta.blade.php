<div class="fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-apply-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            <span class="h6 fw-bold text-white mb-0 d-block">{{ $job->title }}</span>
            <span class="small fw-semibold text-success"><i class="bi bi-currency-dollar me-1"></i> ${{ number_format($job->salary_min) }} - ${{ number_format($job->salary_max) }}</span>
        </div>
        <button class="btn btn-primary fw-bold text-white"><i class="bi bi-box-arrow-in-right me-2"></i>{{ __('Apply Now') }}</button>
    </div>
</div>
