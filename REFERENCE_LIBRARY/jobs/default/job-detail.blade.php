@extends('frontend._layouts._app')

{{-- 1. Metadata --}}
@section('title', $job->title . ' | ' . setting('site_name', config('app.name')))
@section('body_class', 'has-body-glow')

{{-- 2. SEO & Schema (CodeCanyon reviewers value this highly) --}}
@push('head_extra')
    @include('frontend.themes.jobs.default.show.partials._head_extra')
    {{-- Tip: Ensure JSON-LD JobPosting schema is inside the partial above --}}
@endpush

@section('content')
<div class="page-content-wrapper py-3 py-lg-4">
    
    {{-- Job Header (Title, Company, Cover) --}}
    @include('frontend.themes.jobs.default.show.partials._header')

    <div class="row g-4 mt-1">
        {{-- Flash Messages / Form Feedback --}}
        @include('frontend._partials._alerts')

        {{-- MAIN COLUMN: Job Description & Requirements --}}
        <div class="col-lg-8">
            <article class="job-details-article">
                @include('frontend.themes.jobs.default.show.partials._description')
            </article>
        </div>

        {{-- SIDEBAR: Application Form & Company Info --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar">
                @include('frontend.themes.jobs.default.show.partials._application_sidebar')
            </aside>
        </div>
    </div>
</div>
@endsection

{{-- 3. Scripts --}}
@push('scripts_extra')
    {{-- Use @push instead of @section for scripts to allow stack layering --}}
@endpush