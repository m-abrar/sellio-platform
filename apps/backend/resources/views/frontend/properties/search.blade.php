@extends('frontend._layouts._app')

@section('title', page_content_string('properties.search.meta_title', __('Premium Real Estate Listings')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    @php
        $activePropertyFilters = collect([
            'q',
            'property_type',
            'category',
            'max_price',
            'location',
            'bedrooms',
            'bathrooms',
            'check_in',
            'check_out',
            'amenities',
            'features',
        ])->filter(fn ($key) => request()->filled($key))->count();

        $activeFilterLabels = collect();

        if (request()->filled('q')) {
            $activeFilterLabels->push(__('Search: :value', ['value' => request('q')]));
        }

        if (request()->filled('property_type')) {
            $activeFilterLabels->push(request('property_type') === 'rental' ? __('Rentals') : __('For Sale'));
        }

        if (request()->filled('location')) {
            $activeFilterLabels->push(__('Location: :value', [
                'value' => optional(($locations ?? collect())->firstWhere('id', request('location')))->title ?? request('location'),
            ]));
        }

        if (request()->filled('category')) {
            $activeFilterLabels->push(__('Type: :value', [
                'value' => optional(($categories ?? collect())->firstWhere('id', request('category')))->title ?? request('category'),
            ]));
        }

        if (request()->filled('max_price')) {
            $activeFilterLabels->push(__('Up to :value', [
                'value' => setting_string('currency_symbol', '$') . number_format((float) request('max_price')),
            ]));
        }

        if (request()->filled('bedrooms')) {
            $activeFilterLabels->push(__('Beds: :value+', ['value' => request('bedrooms')]));
        }

        if (request()->filled('bathrooms')) {
            $activeFilterLabels->push(__('Baths: :value+', ['value' => request('bathrooms')]));
        }

        if (request()->filled('check_in') || request()->filled('check_out')) {
            $activeFilterLabels->push(__('Dates selected'));
        }

        if (request()->filled('amenities')) {
            $activeFilterLabels->push(trans_choice(':count amenity|:count amenities', count((array) request('amenities')), ['count' => count((array) request('amenities'))]));
        }

        if (request()->filled('features')) {
            $activeFilterLabels->push(trans_choice(':count feature|:count features', count((array) request('features')), ['count' => count((array) request('features'))]));
        }
    @endphp

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
        :filterActive="$activePropertyFilters > 0"
        :filterActiveCount="$activePropertyFilters"
    >
        <x-slot:filters>
            @include('frontend.properties._partials._sidebar_filter')
        </x-slot:filters>

        @if($activeFilterLabels->isNotEmpty())
            <x-slot:toolbar>
                <div class="active-filter-bar d-flex flex-wrap align-items-center gap-2">
                    <span class="active-filter-bar__label">{{ __('Active filters') }}</span>
                    @foreach($activeFilterLabels as $label)
                        <span class="active-filter-chip">{{ $label }}</span>
                    @endforeach
                    <a href="{{ route('properties.index') }}" class="active-filter-clear ms-auto">{{ __('Clear all') }}</a>
                </div>
            </x-slot:toolbar>
        @endif

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
            if (typeof window.flatpickr !== 'function') {
                return;
            }

            let checkOutPicker;

            const checkInPicker = window.flatpickr("#check_in", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                minDate: "today",
                onChange: function(selectedDates) {
                    if (selectedDates.length && checkOutPicker) {
                        checkOutPicker.set('minDate', selectedDates[0]);
                    }
                },
            });

            checkOutPicker = window.flatpickr("#check_out", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                minDate: checkInPicker.selectedDates[0] || "today",
            });
        });
    </script>
@endpush
