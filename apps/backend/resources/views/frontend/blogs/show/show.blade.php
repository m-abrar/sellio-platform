@extends('frontend._layouts._app')

{{-- Use blog data for title and category name --}}
@section('title', $blog->title . ' - ' . ($blog->category->title ?? __('Blog'))) 
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="blog">
    <x-slot:breadcrumbs>
        @include('frontend.blogs.show.partials._breadcrumbs', [
            'pageTitle' => $blog->title,
            'categoryName' => $blog->category?->title ?? __('Articles'),
            'categorySlug' => $blog->category?->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:main>
        <article class="card glass-surface border-0 overflow-hidden mb-5 shadow-lg">
            <div class="gallery-section border-bottom border-color-light position-relative">
                <div class="position-absolute top-0 start-0 m-3 z-2">
                    <span class="badge bg-white text-dark shadow-sm border px-3 py-2 rounded-pill fw-bold small">
                        <i class="bi bi-bookmark-fill text-primary me-1"></i> {{ strtoupper($blog->category?->title ?? __('General')) }}
                    </span>
                </div>

                <div class="main-article-image overflow-hidden" style="max-height: 500px;">
                    <img src="{{ $blog->getFirstMediaUrl('featured_image') }}"
                         id="mainImage"
                         alt="{{ $blog->title }}"
                         class="w-100 h-100 object-fit-cover transition-all">
                </div>
            </div>

            <div class="p-4 p-lg-5">
                <header class="mb-4">
                    <h1 class="fw-800 text-dark mb-3 display-6">{{ $blog->title }}</h1>

                    <div class="d-flex align-items-center flex-wrap gap-3 text-muted small">
                        <div class="d-flex align-items-center">
                            <img src="{{ $blog->user->getFirstMediaUrl('avatar') ?: asset('images/default-avatar.png') }}"
                                 class="rounded-circle me-2" width="30" height="30" alt="{{ $blog->user->name }}">
                            <span>{{ __('By') }} <strong>{{ $blog->user->name }}</strong></span>
                        </div>
                        <span><i class="bi bi-calendar3 me-1"></i>{{ $blog->created_at->translatedFormat('M d, Y') }}</span>
                        <span><i class="bi bi-eye me-1"></i>{{ $blog->views_count ?? 0 }} {{ __('Views') }}</span>
                    </div>
                </header>

                <hr class="opacity-10 my-4">

                <div class="article-content-wrapper">
                    <section id="blog-body" class="mb-5 fs-5 lh-lg text-secondary">
                        {!! sanitize_rich_html($blog->content) !!}
                    </section>

                    @if($blog->tags->count() > 0)
                        <div class="tags-section mt-5">
                            <h6 class="fw-bold mb-3 text-dark"><i class="bi bi-tags me-2"></i>{{ __('Tags') }}</h6>
                            <div class="d-flex flex-wrap gap-2">
                                @foreach($blog->tags as $tag)
                                    <a href="{{ route('blogs.index', ['tag' => $tag->slug]) }}" class="badge bg-light text-primary border text-decoration-none px-3 py-2 rounded-pill">
                                        #{{ $tag->title }}
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </article>
    </x-slot:main>

    <x-slot:sidebar>
        <div class="card glass-surface border-0 p-4 rounded-4 shadow-sm">
            <h6 class="fw-800 text-dark mb-4">{{ __('About the Author') }}</h6>
            <div class="text-center">
                <img src="{{ $blog->user->getFirstMediaUrl('avatar') }}" class="rounded-circle mb-3 border p-1" width="100" height="100">
                <h5 class="fw-bold mb-1">{{ $blog->user->name }}</h5>
                <p class="small text-muted mb-3">{{ $blog->user->bio ?? __('Content Creator') }}</p>
                <a href="#" class="btn btn-primary btn-sm rounded-pill w-100 fw-bold">{{ __('View Profile') }}</a>
            </div>
        </div>

        <div class="card bg-primary text-white p-4 rounded-4 border-0 shadow-sm">
            <h5 class="fw-bold mb-2">{{ __('Join our Newsletter') }}</h5>
            <p class="small opacity-75 mb-3">{{ __('Get the latest stories sent to your inbox.') }}</p>
            <form action="{{ route('newsletter.subscribe') }}" method="POST" class="mt-2">
                @csrf
                <input type="hidden" name="source" value="blog_sidebar">
                <input type="email" name="email" class="form-control form-control-sm border-0 mb-2" placeholder="{{ __('Email Address') }}" required>
                <button type="submit" class="btn btn-dark btn-sm w-100 rounded-pill">{{ __('Subscribe') }}</button>
            </form>
        </div>

        <div class="p-4 rounded-4 border border-primary bg-primary bg-opacity-10">
            <h6 class="fw-bold text-dark"><i class="bi bi-share me-2"></i>{{ __('Share Article') }}</h6>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-facebook"></i></button>
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-twitter-x"></i></button>
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-linkedin"></i></button>
            </div>
        </div>
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 section-title">
                <i class="bi bi-grid-fill me-2 text-primary"></i>
                {{ __('Recommended Reading') }}
            </h4>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                @foreach($viewData['related_posts'] ?? [] as $related)
                    @include('frontend.blogs._blog_card', ['blog' => $related])
                @endforeach
            </div>
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection
