@extends('frontend._layouts._app')

@section('title', $event->title) 
@section('body_class', 'has-body-glow')
@php $tickets_left = $event->tickets_left @endphp
@section('content')
<x-frontend.detail-shell variant="event">
    <x-slot:breadcrumbs>
        @include('frontend.events.show.partials._breadcrumbs')
    </x-slot:breadcrumbs>

    <x-slot:main>
        @include('frontend.events.show.partials._details_main')
    </x-slot:main>

    <x-slot:sidebar>
        <div class="ticket-sidebar">
            @include('frontend.events.show.partials._sidebar_tickets')
        </div>
    </x-slot:sidebar>
</x-frontend.detail-shell>
{{-- Mobile Sticky CTA --}}
@include('frontend.events.show.partials._mobile_cta_footer')

{{-- Modals --}}
@include('frontend.events.show.partials._speaker_modal')
@endsection

@section('head_extra')
    @include('frontend.events.show.partials._detail_head_extra')
@endsection
