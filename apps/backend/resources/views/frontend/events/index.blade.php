@extends('frontend._layouts._app')

@section('title', page_content('events.search.meta_title', __('Upcoming Community & Tech Events')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
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

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($events as $event)
                    <div class="col">
                        @include('frontend.events._partials._card-event', ['event' => $event])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-calendar-x display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Events Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters or dates to find upcoming events.') }}</p>
                            <a href="{{ route('events.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('View All Events') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
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
</div>
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
