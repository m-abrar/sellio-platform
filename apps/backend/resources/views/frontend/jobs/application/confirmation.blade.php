@extends('frontend._layouts._app')

@section('title', 'Application Sent!')
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="job-application" narrow>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9">
            
            @include('frontend._partials._checkout_success_hero', [
                'eyebrow' => __('Application received'),
                'title' => __('Application Sent!'),
                'message' => __('You have taken a great step toward your next career move at :company.', ['company' => $job->title]),
                'icon' => 'bi-send-check-fill',
                'tone' => 'success',
                'reference' => $application->id,
                'referenceLabel' => __('Application ID'),
            ])

            <div class="card bg-white border overflow-hidden">
                {{-- Job Summary Strip --}}
                <div class="p-4 bg-primary-light border-bottom d-flex align-items-center justify-content-between">
                    <div>
                        <span class="smaller text-uppercase fw-bold text-primary tracking-wider">Position Applied</span>
                        <h4 class="fw-bold text-dark mb-0">{{ $job->title }}</h4>
                    </div>
                    <span class="badge bg-white text-primary shadow-sm px-3 py-2 rounded-2">
                        ID: #{{ $application->id }}
                    </span>
                </div>

                <div class="card-body p-4 p-lg-5">
                    @if (session('success'))
                        <div class="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-4 mb-4">
                            <i class="bi bi-balloon-heart-fill me-2"></i> {{ session('success') }}
                        </div>
                    @endif

                    <div class="row g-4 mb-5">
                        <div class="col-sm-6">
                            <label class="smaller text-muted fw-bold text-uppercase mb-1 d-block">Submission Date</label>
                            <p class="text-dark fw-semibold mb-0">
                                <i class="bi bi-calendar3 me-2 text-primary"></i>
                                {{ $application->created_at->format('M d, Y') }}
                            </p>
                            <small class="text-muted">{{ $application->created_at->format('h:i A') }}</small>
                        </div>
                        <div class="col-sm-6">
                            <label class="smaller text-muted fw-bold text-uppercase mb-1 d-block">Status</label>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-info-subtle text-info px-3 py-2 rounded-2 fw-semibold">
                                    <span class="spinner-grow spinner-grow-sm me-2" role="status"></span>
                                    {{ Str::title($application->status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    {{-- Cover Letter Preview --}}
                    <div class="mb-5">
                        <h6 class="fw-bold text-dark mb-3">Cover Letter Snapshot</h6>
                        <div class="p-4 rounded-4 bg-light border border-dashed text-muted smaller line-height-lg">
                            "{{ Str::limit($application->cover_letter, 300) }}..."
                        </div>
                    </div>

                    {{-- Next Steps Roadmap --}}
                    <div class="bg-light rounded-4 p-4 mb-5">
                        <h6 class="fw-bold text-dark mb-3"><i class="bi bi-map me-2"></i> What happens next?</h6>
                        <div class="roadmap">
                            <div class="roadmap-item active">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">Application Received</div>
                                <div class="text-muted extra-small">The employer has been notified of your interest.</div>
                            </div>
                            <div class="roadmap-item">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">Review Process</div>
                                <div class="text-muted extra-small">Hiring managers will screen your resume.</div>
                            </div>
                            <div class="roadmap-item">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">Feedback/Interview</div>
                                <div class="text-muted extra-small">You will be contacted via email if shortlisted.</div>
                            </div>
                        </div>
                    </div>

                    {{-- Action Buttons --}}
                    <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <a href="{{ setting('url_user', '#') }}" class="btn btn-primary px-5 py-3">
                            <i class="bi bi-grid-fill me-2"></i> Track in Dashboard
                        </a>
                        <a href="{{ route('jobs.index') }}" class="btn btn-outline-secondary px-5 py-3 fw-semibold">
                            <i class="bi bi-search me-2"></i> Keep Browsing
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
