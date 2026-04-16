@extends('frontend._layouts._app')

{{-- Use a safe fallback for the title --}}
@section('title', $siteName ?? __('Welcome'))

@section('body_class', 'has-body-glow')

@section('hero')
    @include('frontend.unifieds._partials._index-section-hero')
@endsection

@section('content')
<div class="main-content-container">
    @include('frontend.unifieds._partials._index-body')
</div>
@endsection
