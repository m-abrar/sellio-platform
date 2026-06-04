@extends('frontend._layouts._app')

@section('title', page_content('events.search.meta_title', __('Upcoming Community & Tech Events')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="events"
        :paginator="$events"
        :total="$events->total()"
        titleKey="events.search.heading"
        :titleDefault="__('Events & Workshops')"
        subtitleKey="events.search.sub_heading"
        :subtitleDefault="__('Don\'t miss the next big conference or local meetup.')"
        icon="bi-calendar-check-fill"
        :desktopLabel="__('Events Found')"
        :filterActive="request()->anyFilled(['category', 'date_start', 'location', 'keyword'])"
    >
        <x-slot:filters>
            @include('frontend.events._partials._sidebar-filter-events')
        </x-slot:filters>

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
    </x-frontend.listing-index>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof window.flatpickr !== 'function') {
                return;
            }

            window.flatpickr(".event-date-picker", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        });
    </script>
@endpush
