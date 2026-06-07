@extends('frontend._layouts._app')

@section('title', $page->title)
@section('meta_description', $page->meta_description ?? $page->title)
@section('body_class', 'has-body-glow bg-light frontend-page--cms')

@if(filled($page->css))
    @push('styles')
        <style>{!! sanitize_page_builder_css($page->css) !!}</style>
    @endpush
@endif

@section('content')
<x-frontend.page-shell variant="page">
    <article class="cms-page-content">
        {!! sanitize_rich_html($page->html, page_content_editor_allowed_tags()) !!}
    </article>
</x-frontend.page-shell>
@endsection
