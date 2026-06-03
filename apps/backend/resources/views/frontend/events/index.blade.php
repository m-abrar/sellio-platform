@extends('frontend._layouts._app')

@section('title', page_content('events.search.meta_title', __('Upcoming Community & Tech Events')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="events" x-data="{ isFilterOpen: false }">
    @include('frontend._partials._page-heading', [
        'titleKey' => 'events.search.heading',
        'titleDefault' => __('Events & Workshops'),
        'subtitleKey' => 'events.search.sub_heading',
        'subtitleDefault' => __('Don\'t miss the next big conference or local meetup.'),
        'total' => $events->total(),
        'icon' => 'bi-calendar-check-fill',
        'desktopLabel' => __('Events Found'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Filters')])
            @include('frontend.events._partials._sidebar-filter-events')
        @endcomponent

        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($events as $event)
                    <div class="col">
                        @include('frontend.events._partials._card-event', ['event' => $event])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-calendar-x',
                        'title' => __('No Events Found'),
                        'description' => __('Try adjusting your filters or dates to find upcoming events.'),
                        'route' => route('events.index'),
                        'label' => __('View All Events'),
                    ])
                @endforelse
            </div>

            @if($events->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $events->links('frontend._partials._pagination') }}
                </div>
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['category', 'date_start', 'location']),
    ])
</x-frontend.listing-shell>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            flatpickr(".event-date-picker", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        });
    </script>
@endpush
