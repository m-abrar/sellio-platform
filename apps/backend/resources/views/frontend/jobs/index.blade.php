@extends('frontend._layouts._app')

@section('title', page_content('jobs.search.meta_title', __('Career Opportunities & Job Openings')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
    <x-frontend.listing-index
        variant="jobs"
        :paginator="$jobs"
        :total="$jobs->total()"
        titleKey="jobs.search.heading"
        :titleDefault="__('Available Jobs')"
        subtitleKey="jobs.search.sub_heading"
        :subtitleDefault="__('Find your next career move with top employers.')"
        icon="bi-briefcase-fill"
        :desktopLabel="__('Open Positions')"
        :mobileLabel="__('Jobs')"
        grid="list"
        :filterActive="request()->anyFilled(['keyword', 'type', 'location', 'category'])"
    >
        <x-slot:filters>
            @include('frontend.jobs._partials._sidebar-filter')
        </x-slot:filters>

        @forelse($jobs as $job)
            <div class="col">
                @include('frontend.jobs._partials._job-card', ['job' => $job])
            </div>
        @empty
            @include('frontend._partials._listing-empty-state', [
                'icon' => 'bi-briefcase',
                'title' => __('No Roles Found'),
                'description' => __('Try adjusting your keywords or location filters.'),
                'route' => route('jobs.index'),
            ])
        @endforelse
    </x-frontend.listing-index>
@endsection
