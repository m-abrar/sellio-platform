{{-- Assumes $auto and $auto->user (the dealer/user) are available --}}
@php
    $dealer = $auto->user;
@endphp

<div class="contact-sidebar">

    {{-- 4.1 Finance Calculator --}}
    @include('frontend.autos.show.partials._test_drive_request')

    {{-- 4.3 Contact Dealer Card --}}
    @include('frontend.autos.show.partials._contact_dealer')

    {{-- Secondary Action (Save to Favorites) --}}
    <div class="text-center mt-3">
        <button class="btn btn-link text-primary fw-semibold" data-auto-id="{{ $auto->id }}">
            <i class="bi bi-heart me-1"></i>{{ __('Save to favourites') }}
        </button>
    </div>
</div>
