@extends('frontend._layouts._app')

@section('title', @$category->title ? $category->title . ' Vehicles for Sale' : __('Browse All Vehicle Listings'))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="autos"
        :paginator="$autos"
        :total="$autos->total()"
        :titleHtml="($category->title ?? null) ?: page_content('autos.search.heading', __('Certified Pre-Owned Vehicles'))"
        :subtitleHtml="($category->title ?? null) ? __('Browse our inventory of quality ') . strtolower($category->title) : page_content('autos.search.sub_heading', __('Explore premium cars, trucks, and SUVs with verified history.'))"
        icon="bi-car-front-fill"
        :desktopLabel="__('Vehicles Available')"
        :filterActive="request()->anyFilled(['brand', 'model', 'price_min', 'price_max', 'year', 'keyword', 'category', 'location'])"
    >
        <x-slot:filters>
            @include('frontend.autos._filter_sidebar')
        </x-slot:filters>

        @forelse($autos as $auto)
            <div class="col">
                @include('frontend.autos._auto_card', ['auto' => $auto])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-car-front',
                'title' => __('No Vehicles Found'),
                'route' => route('autos.index'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
