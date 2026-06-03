@extends('frontend._layouts._app')

@section('title', page_content('services.search.meta_title', __('Professional Services & Solutions')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="services"
        :paginator="$services"
        :total="$services->total()"
        titleKey="services.search.heading"
        :titleDefault="__('Professional Services')"
        subtitleKey="services.search.sub_heading"
        :subtitleDefault="__('Expert consultation and technical solutions.')"
        icon="bi-gear-fill"
        :desktopLabel="__('Services Available')"
        grid="cards-2"
        :filterActive="request()->anyFilled(['category', 'expertise', 'location', 'keyword'])"
    >
        <x-slot:filters>
            @include('frontend.services._partials._sidebar_filter')
        </x-slot:filters>

        @forelse($services as $service)
            <div class="col">
                @include('frontend.services._partials._card', ['service' => $service])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-tools',
                'title' => __('No Services Found'),
                'route' => route('services.index'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
