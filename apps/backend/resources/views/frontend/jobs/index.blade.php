@extends('frontend._layouts._app')

@section('title', page_content('jobs.search.meta_title', __('Career Opportunities & Job Openings')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="jobs" x-data="{ isFilterOpen: false }">
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

        <div class="col-12 col-lg-9">
            <div class="row g-3 g-lg-4 row-cols-1">
                @forelse($jobs as $job)
                    <div class="col">
                        @include('frontend.jobs._partials._job-card', ['job' => $job])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-search',
                        'title' => __('No Roles Found'),
                        'description' => __('Try adjusting your keywords or location filters.'),
                        'route' => route('jobs.index'),
                    ])
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
</x-frontend.listing-shell>
@endsection
