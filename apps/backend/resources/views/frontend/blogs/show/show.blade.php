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
        <article class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="gallery-section border-bottom border-color-light position-relative">
                <div class="position-absolute top-0 start-0 m-3 z-2">
                    <span class="badge bg-white text-dark border px-3 py-2 rounded-2 fw-semibold small">
                        <i class="bi bi-bookmark-fill me-1" style="color:var(--primary-color)"></i>{{ $blog->category?->title ?? __('General') }}
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
                                    <a href="{{ route('blogs.index', ['tag' => $tag->slug]) }}" class="badge text-decoration-none px-3 py-2 rounded-2 fw-semibold" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
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
        {{-- Author Card --}}
        <div class="card detail-sidebar-card p-4 mb-4">
            <h4 class="fw-800 mb-3">{{ __('About the Author') }}</h4>
            <div class="text-center mb-3 border-bottom pb-3" style="border-color:rgba(15,23,42,.07)!important">
                <img src="{{ $blog->user->getFirstMediaUrl('avatar') ?: asset('images/default-avatar.png') }}"
                     class="host-profile-avatar rounded-circle mb-2 shadow-sm"
                     width="80" height="80" alt="{{ $blog->user->name }}">
                <h5 class="mb-0 fw-semibold text-dark">{{ $blog->user->name }}</h5>
                <p class="small text-muted mb-0 mt-1">{{ $blog->user->bio ?? __('Content Creator') }}</p>
            </div>
            <div class="d-grid">
                <a href="{{ route('partner.profile', $blog->user) }}" class="btn btn-outline-secondary fw-semibold">
                    <i class="bi bi-person-badge me-2"></i>{{ __('View profile') }}
                </a>
            </div>
        </div>

        {{-- Newsletter Card --}}
        <div class="card detail-sidebar-card mb-4 overflow-hidden">
            <div class="card-header border-0 p-4" style="background:var(--primary-color)">
                <h4 class="fw-800 mb-1 text-white"><i class="bi bi-envelope-fill me-2"></i>{{ __('Join our Newsletter') }}</h4>
                <p class="small mb-0" style="color:rgba(255,255,255,.7)">{{ __('Get the latest stories sent to your inbox.') }}</p>
            </div>
            <div class="card-body p-4">
                <form action="{{ route('newsletter.subscribe') }}" method="POST">
                    @csrf
                    <input type="hidden" name="source" value="blog_sidebar">
                    <input type="email" name="email" class="form-control mb-3" placeholder="{{ __('Email Address') }}" required>
                    <button type="submit" class="btn btn-primary btn-header-cta w-100">{{ __('Subscribe') }}<i class="bi bi-arrow-right ms-2"></i></button>
                </form>
            </div>
        </div>

        {{-- Share Card --}}
        <div class="p-4 rounded-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
            <h6 class="fw-bold text-dark"><i class="bi bi-share me-2" style="color:var(--primary-color)"></i>{{ __('Share Article') }}</h6>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-facebook"></i></button>
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-twitter-x"></i></button>
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm"><i class="bi bi-linkedin"></i></button>
            </div>
        </div>
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
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
