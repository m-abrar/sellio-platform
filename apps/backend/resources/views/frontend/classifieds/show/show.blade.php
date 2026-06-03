@extends('frontend._layouts._app')

{{-- Use classified data for title and category name --}}
@section('title', $classified->title . ' - ' . ($classified->category->title ?? __('Classified Ad'))) 
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="classified">
    <x-slot:breadcrumbs>
        @include('frontend.classifieds.show.partials._breadcrumbs', [
            'pageTitle' => $classified->title,
            'categoryName' => $classified->category->title ?? __('Classifieds'),
            'categorySlug' => $classified->category->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:main>
        <div class="card glass-surface border-0 overflow-hidden mb-5 shadow-lg">
            <div class="gallery-section border-bottom border-color-light position-relative">
                <div class="position-absolute top-0 start-0 m-3 z-2">
                    <span class="badge bg-white text-dark shadow-sm border px-3 py-2 rounded-pill fw-bold small">
                        <i class="bi bi-megaphone-fill text-primary me-1"></i> {{ strtoupper($classified->type?->title ?? __('Listing')) }}
                    </span>
                </div>
                @include('frontend.classifieds.show.partials._listing_gallery')
            </div>

            <div class="p-4 p-lg-5">
                @include('frontend.classifieds.show.partials._listing_header', [
                    'classified' => $classified
                ])

                <hr class="opacity-10 my-4">

                <div class="property-details-content">
                    <section id="listing-description" class="mb-5">
                        <h2 class="fw-800 text-dark mb-4 section-title">{{ __('Description') }}</h2>
                        <div class="listing-description">
                            @include('frontend.classifieds.show.partials._item_description')
                        </div>
                    </section>

                    @isset($classified->attributes)
                        <section id="item-specs" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Specifications') }}</h4>
                            @include('frontend.classifieds.show.partials._item_specs_table')
                        </section>
                    @endisset
                </div>
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.classifieds.show.partials.sidebar._seller_contact_card', [
            'seller' => $classified->user
        ])

        @include('frontend.classifieds.show.partials.sidebar._pickup_location_card')

        <div class="p-4 rounded-4 border border-warning bg-warning bg-opacity-10">
            <h6 class="fw-bold text-dark"><i class="bi bi-shield-lock me-2"></i>{{ __('Safety Tips') }}</h6>
            <ul class="small text-muted mb-0 ps-3">
                <li>{{ __('Meet in a public place') }}</li>
                <li>{{ __('Check the item before paying') }}</li>
                <li>{{ __('Avoid upfront wire transfers') }}</li>
            </ul>
        </div>
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 section-title">
                <i class="bi bi-tags-fill me-2 text-primary-color"></i>
                {{ __('More from :seller', ['seller' => $classified->user?->name ?? __('this seller')]) }}
            </h4>
            @include('frontend.classifieds.show.partials._related_seller_items', [
                'seller' => $classified->user
            ])
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-img');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // 1. Get the new image source
                const newSrc = this.getAttribute('data-full-src');
                
                // 2. Change the main image source
                mainImage.src = newSrc;
                
                // 3. Update active state on thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
</script>
@endsection
