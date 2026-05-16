@extends('frontend._layouts._app')

{{-- 1. Sets $page_title --}}
@section('title', 'Upcoming Events & Workshops') 

{{-- 2. Sets $icon_class for the navbar (using bi-calendar-event-fill) --}}
@section('icon_class', 'bi-calendar-event-fill') 

{{-- 3. Sets $active_page for link highlighting --}}
@section('active_page', 'events') 

{{-- Applies the body glow class for the main aesthetic --}}
@section('body_class', 'has-body-glow')

@section('content')
<main class="container-xl page-wrapper">


    {{-- 1. Page Header Section --}}
    @include('frontend.themes.events.default._page_header_events')

    <div class="row g-4">
        
        {{-- 2. Filter Sidebar (col-lg-3) --}}
        <div class="col-lg-3">
            @include('frontend.themes.events.default._filter_sidebar_events')
        </div>

        {{-- 3. Event Listings Grid (col-lg-9) --}}
        <div class="col-lg-9">
            @include('frontend.themes.events.default._event_listing_grid')
        </div>
        
    </div>
</main>
@endsection

{{-- Add a small style section if needed --}}
@section('head_extra')
<style>
    .btn-primary {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
    }
</style>
@endsection