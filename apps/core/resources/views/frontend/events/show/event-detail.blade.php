@extends('frontend._layouts._app')

@section('title', $event->title) 
@section('body_class', 'has-body-glow')
@php $tickets_left = $event->tickets_left @endphp
@section('content')
<div class="page-content-wrapper py-3 py-lg-4">
    {{-- 1. Breadcrumbs --}}
    @include('frontend.events.show.partials._breadcrumbs')
    <div class="row g-4 mt-1">
        @include('frontend._partials._alerts')
        {{-- MAIN COLUMN --}}
        <div class="col-lg-8">
            @include('frontend.events.show.partials._details_main')
        </div>

        {{-- SIDEBAR --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar ticket-sidebar" style="z-index: 10;">
                @include('frontend.events.show.partials._sidebar_tickets')
            </aside>
        </div>
    </div>
</div>
{{-- Mobile Sticky CTA --}}
@include('frontend.events.show.partials._mobile_cta_footer')

{{-- Modals --}}
@include('frontend.events.show.partials._speaker_modal')
@endsection

@section('head_extra')
    @include('frontend.events.show.partials._detail_head_extra')
@endsection
