@extends('frontend._layouts._app')

{{-- Use classified data for title and category name --}}
@section('title', $classified->title . ' - ' . ($classified->category->title ?? 'Classified Ad')) 
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-3 py-lg-4">
    
    {{-- 1. NAVIGATION HEADER (Breadcrumbs Only) --}}
    @include('frontend.themes.classifieds.default.show.partials._breadcrumbs', [
        'pageTitle' => $classified->title,
        'categoryName' => $classified->category->title ?? 'Classifieds',
        'categorySlug' => $classified->category->slug ?? null,
    ])

    <div class="row g-4 mt-1">
        {{-- MAIN COLUMN (8/12) --}}
        <div class="col-lg-8">
            <div class="card glass-surface border-0 overflow-hidden mb-5 shadow-lg">
                
                {{-- 2. IMAGE GALLERY --}}
                <div class="gallery-section border-bottom border-color-light position-relative">
                    {{-- Status Ribbon --}}
                    <div class="position-absolute top-0 start-0 m-3 z-2">
                        <span class="badge bg-white text-dark shadow-sm border px-3 py-2 rounded-pill fw-bold small">
                           <i class="bi bi-megaphone-fill text-primary me-1"></i> {{ strtoupper($classified->type?->title ?? 'Listing') }}
                        </span>
                    </div>
                    @include('frontend.themes.classifieds.default.show.partials._listing_gallery') 
                </div>

                <div class="p-4 p-lg-5">
                    
                    {{-- 3. LISTING HEADER (Title & Price) --}}
                    {{-- Title, Price, Post Info, and Action Buttons --}}
                            @include('frontend.themes.classifieds.default.show.partials._listing_header', [
                                'classified' => $classified // Pass the whole object
                            ])

                    <hr class="opacity-10 my-4">

                    {{-- 4. DESCRIPTION & DETAILS --}}
                    <div class="property-details-content">
                        <section id="listing-description" class="mb-5">
                            <h2 class="fw-800 text-dark mb-4 section-title">{{ __('Description') }}</h2>
                            <div class="listing-description">
                                @include('frontend.themes.classifieds.default.show.partials._item_description')
                            </div>
                        </section>

                        {{-- Listing Specific Attributes (e.g. Condition, Brand) --}}
                        @isset($classified->attributes)
                            <section id="item-specs" class="mb-5">
                                <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Specifications') }}</h4>
                                @include('frontend.themes.classifieds.default.show.partials._item_specs_table')
                            </section>
                        @endisset
                    </div>
                </div>
            </div>
            
            {{-- 5. RELATED ITEMS --}}
            <div class="related-wrapper pb-5">
                <h4 class="fw-800 text-dark mb-4 section-title">
                    <i class="bi bi-tags-fill me-2 text-primary-color"></i>
                    {{ __('More from :seller', ['seller' => $classified->user?->name ?? __('this seller')]) }}
                </h4>
                @include('frontend.themes.classifieds.default.show.partials._related_seller_items', [
                            'seller' => $classified->user // Pass the User model
                        ])
            </div>
        </div>

        {{-- SIDEBAR COLUMN (4/12) --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar">
                {{-- Seller Contact Card --}}
                <div class="mb-4">
                    @include('frontend.themes.classifieds.default.show.partials.sidebar._seller_contact_card', [
                            'seller' => $classified->user // Pass the User model
                        ])
                </div>
                
                {{-- Pickup Location Card --}}
                @include('frontend.themes.classifieds.default.show.partials.sidebar._pickup_location_card')

                {{-- Safety Tips Card --}}
                <div class="mt-4 p-4 rounded-4 border border-warning bg-warning bg-opacity-10">
                    <h6 class="fw-bold text-dark"><i class="bi bi-shield-lock me-2"></i>{{ __('Safety Tips') }}</h6>
                    <ul class="small text-muted mb-0 ps-3">
                        <li>{{ __('Meet in a public place') }}</li>
                        <li>{{ __('Check the item before paying') }}</li>
                        <li>{{ __('Avoid upfront wire transfers') }}</li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
</div>
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