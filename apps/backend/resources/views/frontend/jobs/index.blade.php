@extends('frontend._layouts._app')

@section('title', page_content('jobs.search.meta_title', __('Career Opportunities & Job Openings')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
    @include('frontend._partials._page-heading', [
        'titleKey' => 'jobs.search.heading',
        'titleDefault' => __('Available Jobs'),
        'subtitleKey' => 'jobs.search.sub_heading',
        'subtitleDefault' => __('Find your next career move with top employers.'),
        'total' => $jobs->total(),
        'icon' => 'bi-briefcase-fill',
        'desktopLabel' => __('Open Positions'),
        'mobileLabel' => __('Jobs'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Refine Search')])
            @include('frontend.jobs._partials._sidebar-filter')
        @endcomponent

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-3 g-lg-4 row-cols-1"> {{-- Jobs usually look better in a 1-column list --}}
                @forelse($jobs as $job)
                    <div class="col">
                        @include('frontend.jobs._partials._job-card', ['job' => $job])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-search display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Roles Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your keywords or location filters.') }}</p>
                            <a href="{{ route('jobs.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset All Filters') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>
            @if($jobs->hasPages())
                {{ $jobs->links('frontend._partials._pagination') }}
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['keyword', 'type', 'location']),
    ])
</div>
@endsection
