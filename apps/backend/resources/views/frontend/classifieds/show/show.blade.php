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
        <div class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="gallery-section border-bottom border-color-light position-relative">
                <div class="position-absolute top-0 start-0 m-3 z-2">
                    <span class="badge bg-white text-dark border px-3 py-2 rounded-2 fw-semibold small">
                        <i class="bi bi-megaphone-fill me-1" style="color:var(--primary-color)"></i>{{ $classified->type?->title ?? __('Listing') }}
                    </span>
                </div>
                @include('frontend.classifieds.show.partials._listing_gallery')
            </div>

            <div class="p-4 p-lg-5">
                @include('frontend.classifieds.show.partials._listing_header', [
                    'classified' => $classified
                ])

                <div class="property-details-content">
                    <section id="listing-description" class="mb-5">
                        <h2 class="fw-800 text-dark mb-4 detail-section-title"><i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Description') }}</h2>
                        <div class="listing-description">
                            @include('frontend.classifieds.show.partials._item_description')
                        </div>
                    </section>

                    @isset($classified->attributes)
                        <section id="item-specs" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Specifications') }}</h4>
                            @include('frontend.classifieds.show.partials._item_specs_table')
                        </section>
                    @endisset
                </div>
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        {{-- Card 1: Price + CTA (orange banner — like property booking widget) --}}
        @include('frontend.classifieds.show.partials.sidebar._price_contact_card')

        {{-- Card 2: Seller Profile (no orange banner — like property host card) --}}
        @include('frontend.classifieds.show.partials.sidebar._seller_contact_card', [
            'seller' => $classified->user
        ])

        @include('frontend.classifieds.show.partials.sidebar._pickup_location_card')

        <div class="card detail-sidebar-card p-4">
            <h4 class="fw-800 mb-4"><i class="bi bi-shield-lock-fill me-2" style="color:var(--primary-color)"></i>{{ __('Safety Tips') }}</h4>
            <ul class="list-unstyled small mb-3">
                    <li class="d-flex align-items-start gap-3 mb-3">
                        <span class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center" style="width:32px;height:32px;background:rgba(var(--primary-color-rgb),.08)">
                            <i class="bi bi-people-fill" style="color:var(--primary-color)"></i>
                        </span>
                        <div><strong class="text-dark">{{ __('Meet in a public place') }}</strong><br><span class="text-muted">{{ __('Choose a busy location for the exchange.') }}</span></div>
                    </li>
                    <li class="d-flex align-items-start gap-3 mb-3">
                        <span class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center" style="width:32px;height:32px;background:rgba(var(--primary-color-rgb),.08)">
                            <i class="bi bi-eye-fill" style="color:var(--primary-color)"></i>
                        </span>
                        <div><strong class="text-dark">{{ __('Inspect before paying') }}</strong><br><span class="text-muted">{{ __('Check the item carefully before handing over money.') }}</span></div>
                    </li>
                    <li class="d-flex align-items-start gap-3">
                        <span class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center" style="width:32px;height:32px;background:rgba(var(--primary-color-rgb),.08)">
                            <i class="bi bi-bank2" style="color:var(--primary-color)"></i>
                        </span>
                        <div><strong class="text-dark">{{ __('Avoid wire transfers') }}</strong><br><span class="text-muted">{{ __('Never pay in advance via untraceable methods.') }}</span></div>
                    </li>
            </ul>
            <div class="p-3 rounded-3 small text-center" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.07)">
                <i class="bi bi-flag me-1" style="color:var(--primary-color)"></i>
                {{ __('Something look off?') }} <a href="#" class="fw-semibold text-decoration-none" style="color:var(--primary-color)">{{ __('Report this listing') }}</a>
            </div>
        </div>
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-tags-fill me-2" style="color:var(--primary-color)"></i>
                {{ __('More from :seller', ['seller' => $classified->user?->name ?? __('this seller')]) }}
            </h4>
            @include('frontend.classifieds.show.partials._related_seller_items', [
                'seller' => $classified->user
            ])
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection
