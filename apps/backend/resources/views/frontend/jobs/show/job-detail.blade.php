@extends('frontend._layouts._app')

{{-- 1. Metadata --}}
@section('title', $job->title . ' | ' . setting('site_name', config('app.name')))
@section('og_image', $job->employer->avatar_url ?? asset('images/app-logo.webp'))
@section('og_description', Str::limit(strip_tags($job->description), 160))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

{{-- 2. SEO & Schema (CodeCanyon reviewers value this highly) --}}
@push('head_extra')
    @include('frontend.jobs.show.partials._head_extra')
    {{-- Tip: Ensure JSON-LD JobPosting schema is inside the partial above --}}
@endpush

@section('content')
<x-frontend.detail-shell variant="job">
    <x-slot:breadcrumbs>
        @include('frontend.jobs.show.partials._header')
    </x-slot:breadcrumbs>

    <x-slot:main>
        <article class="job-details-article">
            @include('frontend.jobs.show.partials._description')
        </article>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.jobs.show.partials._application_sidebar')
    </x-slot:sidebar>
</x-frontend.detail-shell>
@endsection

{{-- 3. Scripts --}}
@push('scripts_extra')
    {{-- Use @push instead of @section for scripts to allow stack layering --}}
@endpush
