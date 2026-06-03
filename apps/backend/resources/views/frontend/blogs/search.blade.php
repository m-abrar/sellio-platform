@extends('frontend._layouts._app')

@section('title', page_content('blogs.search.meta_title', __('Expert Insights & Community Stories')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="blogs" x-data="{ isFilterOpen: false }">
    @include('frontend._partials._page-heading', [
        'titleKey' => 'blogs.search.heading',
        'titleDefault' => __('Our Journal'),
        'subtitleKey' => 'blogs.search.sub_heading',
        'subtitleDefault' => __('Explore the latest articles, guides, and stories from our community experts.'),
        'total' => $blogs->total(),
        'icon' => 'bi-journal-text',
        'desktopLabel' => __('Articles Published'),
        'mobileLabel' => __('Stories'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Filter Content')])
            @include('frontend.blogs._partials._sidebar')
        @endcomponent

        <div class="col-12 col-lg-9">
            <div class="row g-2 g-md-3 g-lg-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
                @forelse ($blogs as $blog)
                    <div class="col">
                        @include('frontend.blogs._partials._card', ['blog' => $blog])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-journal-x',
                        'title' => __('No Articles Found'),
                        'description' => __('We couldn\'t find any posts matching your current filters.'),
                        'route' => route(Route::currentRouteName()),
                        'label' => __('Refresh Feed'),
                    ])
                @endforelse
            </div>

            @if($blogs->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $blogs->links('frontend.blogs._partials._pagination') }}
                </div>
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'label' => __('Refine Topics'),
        'icon' => 'bi-funnel',
        'active' => request()->anyFilled(['search', 'category', 'sort', 'tags']),
    ])
</x-frontend.listing-shell>
@endsection
