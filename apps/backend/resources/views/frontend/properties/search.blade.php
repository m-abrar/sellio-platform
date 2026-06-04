@extends('frontend._layouts._app')

@section('title', page_content_string('properties.search.meta_title', __('Premium Real Estate Listings')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="properties"
        :paginator="$properties"
        :total="$properties->total()"
        titleKey="properties.search.heading"
        :titleDefault="__('Properties')"
        subtitleKey="properties.search.sub_heading"
        :subtitleDefault="__('Explore premium real estate listings.')"
        icon="bi-houses-fill"
        :desktopLabel="__('Listings Available')"
        :filterActive="request()->anyFilled(['category', 'max_price', 'location', 'bedrooms', 'bathrooms', 'amenities', 'features'])"
    >
        <x-slot:filters>
            @include('frontend.properties._partials._sidebar_filter')
        </x-slot:filters>

        @forelse($properties as $property)
            <div class="col">
                @include('frontend.properties._partials._card', ['property' => $property])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-house-exclamation',
                'route' => route('properties.index'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            flatpickr("#check_in, #check_out", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        });
    </script>
@endpush
