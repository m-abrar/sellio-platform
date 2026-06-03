@extends('frontend._layouts._app')

@section('title', page_content('classifieds.search.meta_title', __('Community Classifieds & Marketplace')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="classifieds"
        :paginator="$classifieds"
        :total="$classifieds->total()"
        titleKey="classifieds.search.heading"
        :titleDefault="__('Classifieds')"
        subtitleKey="classifieds.search.sub_heading"
        :subtitleDefault="__('Find great deals in your local community.')"
        icon="bi-tags-fill"
        :desktopLabel="__('Ads Available')"
        :filterActive="request()->anyFilled(['q', 'keyword', 'category', 'price_min', 'price_max', 'location'])"
    >
        <x-slot:filters>
            @include('frontend.classifieds._partials._sidebar')
        </x-slot:filters>

        @forelse($classifieds as $classified)
            <div class="col">
                @include('frontend.classifieds._partials._card', ['classified' => $classified])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-tag',
                'title' => __('No Ads Found'),
                'description' => __('Try broadening your search or changing categories.'),
                'route' => route('classifieds.index'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
