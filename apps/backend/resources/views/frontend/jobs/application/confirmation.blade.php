@extends('frontend._layouts._app')

@section('title', __('Application Sent!'))
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
                <div class="p-4 d-flex align-items-center justify-content-between" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
                    <div>
                        <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">{{ __('Position Applied') }}</p>
                        <h4 class="fw-800 text-dark mb-0" style="font-family:var(--font-heading)">{{ $job->title }}</h4>
                    </div>
                    <span class="fw-semibold px-3 py-2 rounded-2 small flex-shrink-0 ms-3" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        #{{ $application->id }}
                    </span>
                </div>

                <div class="card-body p-4 p-lg-5">
                    @if (session('success'))
                        <div class="p-3 rounded-3 mb-4 d-flex align-items-center" style="background:rgba(var(--primary-color-rgb),.06);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
                            <i class="bi bi-balloon-heart-fill me-2" style="color:var(--primary-color)"></i> {{ session('success') }}
                        </div>
                    @endif

                    <div class="row g-4 mb-5">
                        <div class="col-sm-6">
                            <label class="smaller text-muted fw-semibold mb-1 d-block">{{ __('Submission Date') }}</label>
                            <p class="text-dark fw-semibold mb-0">
                                <i class="bi bi-calendar3 me-2" style="color:var(--primary-color)"></i>
                                {{ $application->created_at->format('M d, Y') }}
                            </p>
                            <small class="text-muted">{{ $application->created_at->format('h:i A') }}</small>
                        </div>
                        <div class="col-sm-6">
                            <label class="smaller text-muted fw-semibold mb-1 d-block">{{ __('Status') }}</label>
                            <div class="d-flex align-items-center">
                                <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                                    <span class="spinner-grow spinner-grow-sm me-2" role="status" style="color:var(--primary-color)"></span>
                                    {{ Str::title($application->status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    {{-- Cover Letter Preview --}}
                    <div class="mb-5">
                        <h6 class="fw-bold text-dark mb-3">{{ __('Cover Letter Snapshot') }}</h6>
                        <div class="p-4 rounded-4 text-muted smaller line-height-lg" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                            "{{ Str::limit($application->cover_letter, 300) }}..."
                        </div>
                    </div>

                    {{-- Next Steps Roadmap --}}
                    <div class="p-4 mb-5 rounded-4" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                        <h6 class="fw-bold text-dark mb-3"><i class="bi bi-map me-2"></i> {{ __('What happens next?') }}</h6>
                        <div class="roadmap">
                            <div class="roadmap-item active">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">{{ __('Application Received') }}</div>
                                <div class="text-muted extra-small">{{ __('The employer has been notified of your interest.') }}</div>
                            </div>
                            <div class="roadmap-item">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">{{ __('Review Process') }}</div>
                                <div class="text-muted extra-small">{{ __('Hiring managers will screen your resume.') }}</div>
                            </div>
                            <div class="roadmap-item">
                                <div class="roadmap-dot"></div>
                                <div class="smaller fw-bold">{{ __('Feedback/Interview') }}</div>
                                <div class="text-muted extra-small">{{ __('You will be contacted via email if shortlisted.') }}</div>
                            </div>
                        </div>
                    </div>

                    {{-- Action Buttons --}}
                    <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <a href="{{ setting('url_user', '#') }}" class="btn btn-primary btn-header-cta">
                            <i class="bi bi-grid-fill me-2"></i> {{ __('Track in Dashboard') }}
                        </a>
                        <a href="{{ route('jobs.index') }}" class="btn btn-outline-secondary px-5 py-3 fw-semibold">
                            <i class="bi bi-search me-2"></i> {{ __('Keep Browsing') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
