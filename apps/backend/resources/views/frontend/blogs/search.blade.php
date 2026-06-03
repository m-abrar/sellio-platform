@extends('frontend._layouts._app')

@section('title', page_content('blogs.search.meta_title', __('Expert Insights & Community Stories')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="blogs"
        :paginator="$blogs"
        :total="$blogs->total()"
        titleKey="blogs.search.heading"
        :titleDefault="__('Our Journal')"
        subtitleKey="blogs.search.sub_heading"
        :subtitleDefault="__('Explore the latest articles, guides, and stories from our community experts.')"
        icon="bi-journal-text"
        :desktopLabel="__('Articles Published')"
        :mobileLabel="__('Stories')"
        :filterActive="request()->anyFilled(['search', 'q', 'category', 'sort', 'tags'])"
    >
        <x-slot:filters>
            @include('frontend.blogs._partials._sidebar')
        </x-slot:filters>

        @forelse($blogs as $blog)
            <div class="col">
                @include('frontend.blogs._partials._card', ['blog' => $blog])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-journal-x',
                'title' => __('No Articles Found'),
                'description' => __('We couldn\'t find any posts matching your current filters.'),
                'route' => route('blogs.index'),
                'label' => __('Refresh Feed'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
