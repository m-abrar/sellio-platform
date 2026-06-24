@extends('frontend._layouts._app')

@section('title', $event->title)
@section('og_image', $event->primary_image_url)
@section('og_description', Str::limit(strip_tags($event->meta_description ?: $event->description), 160))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')
@php $tickets_left = $event->tickets_left @endphp
@section('content')
<x-frontend.detail-shell variant="event">
    <x-slot:breadcrumbs>
        @include('frontend.events.show.partials._breadcrumbs')
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        @include('frontend.events.show.partials._gallery')
    </x-slot:gallery>

    <x-slot:main>
        @include('frontend.events.show.partials._details_main')
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.events.show.partials._sidebar_tickets')
    </x-slot:sidebar>
</x-frontend.detail-shell>

@include('frontend.events.show.partials._mobile_cta_footer')
@include('frontend.events.show.partials._speaker_modal')
@endsection

@section('head_extra')
    @include('frontend.events.show.partials._detail_head_extra')
@endsection
