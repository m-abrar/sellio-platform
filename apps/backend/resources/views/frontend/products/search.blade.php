@extends('frontend._layouts._app')

@section('title', page_content('products.search.meta_title', __('Shop Products')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="products"
        :paginator="$products"
        :total="$products->total()"
        titleKey="products.search.heading"
        :titleDefault="__('Product Catalog')"
        subtitleKey="products.search.sub_heading"
        :subtitleDefault="__('Browse our latest collection of premium products.')"
        icon="bi-box-seam-fill"
        :desktopLabel="__('Products Found')"
        :filterActiveCount="$activeFilterCount ?? null"
    >
        <x-slot:filters>
            @include('frontend.products._partials._sidebar', [
                'categories' => $categories,
                'brands'     => $brands,
                'maxPrice'   => $maxAllowedPrice,
            ])
        </x-slot:filters>

        <x-slot:toolbar>
            @include('frontend.products._partials._listing-toolbar')
        </x-slot:toolbar>

        @forelse($products as $product)
            <div class="col">
                @include('frontend.products._partials._card', ['product' => $product])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-cart-x',
                'title' => __('No Products Found'),
                'description' => __('Try adjusting your filters or search terms.'),
                'route' => route('products.index'),
                'label' => __('Reset Search'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
