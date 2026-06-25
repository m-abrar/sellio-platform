@extends('frontend._layouts._app')

{{-- Use blog data for title and category name --}}
@section('title', $blog->title . ' - ' . ($blog->category->title ?? __('Blog')))
@section('og_type', 'article')
@section('og_image', $blog->getFirstMediaUrl('featured_image') ?: asset('images/placeholder.jpg'))
@section('og_description', Str::limit(strip_tags($blog->meta_description ?: $blog->content), 160))
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
                    <h1 class="fw-800 text-dark mb-3 display-6 tracking-tight lh-sm" style="font-family:var(--font-heading)">{{ $blog->title }}</h1>

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
                    <section id="blog-body" class="mb-5">
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
            <div class="p-4" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
                <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">
                    <i class="bi bi-envelope-fill me-1"></i>{{ __('Newsletter') }}
                </p>
                <h4 class="fw-800 text-dark mb-1" style="font-family:var(--font-heading)">{{ __('Stay in the Loop') }}</h4>
                <p class="small text-muted mb-0">{{ __('Get the latest stories sent to your inbox.') }}</p>
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
        @php
            $encodedUrl   = urlencode(url()->current());
            $encodedTitle = urlencode($blog->title);
        @endphp
        <div class="p-4 rounded-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
            <h6 class="fw-bold text-dark"><i class="bi bi-share me-2" style="color:var(--primary-color)"></i>{{ __('Share Article') }}</h6>
            <div class="d-flex gap-2 mt-3">
                <a href="https://www.facebook.com/sharer/sharer.php?u={{ $encodedUrl }}"
                   target="_blank" rel="noopener"
                   class="btn btn-light btn-sm rounded-circle border shadow-sm" title="{{ __('Share on Facebook') }}" aria-label="Facebook">
                    <i class="bi bi-facebook"></i>
                </a>
                <a href="https://twitter.com/intent/tweet?url={{ $encodedUrl }}&text={{ $encodedTitle }}"
                   target="_blank" rel="noopener"
                   class="btn btn-light btn-sm rounded-circle border shadow-sm" title="{{ __('Share on X') }}" aria-label="X / Twitter">
                    <i class="bi bi-twitter-x"></i>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ $encodedUrl }}"
                   target="_blank" rel="noopener"
                   class="btn btn-light btn-sm rounded-circle border shadow-sm" title="{{ __('Share on LinkedIn') }}" aria-label="LinkedIn">
                    <i class="bi bi-linkedin"></i>
                </a>
                <button class="btn btn-light btn-sm rounded-circle border shadow-sm js-share-btn"
                        data-share-title="{{ $blog->title }}"
                        data-share-url="{{ url()->current() }}"
                        title="{{ __('Copy link') }}" aria-label="{{ __('Copy link') }}">
                    <i class="bi bi-link-45deg"></i>
                </button>
            </div>
        </div>

        @push('scripts')
        <script>
        (function () {
            document.querySelectorAll('.js-share-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var url   = btn.dataset.shareUrl;
                    var title = btn.dataset.shareTitle;
                    if (navigator.share) {
                        navigator.share({ title: title, url: url }).catch(function () {});
                    } else {
                        navigator.clipboard.writeText(url).then(function () {
                            var icon = btn.querySelector('i');
                            icon.className = 'bi bi-check2';
                            setTimeout(function () { icon.className = 'bi bi-link-45deg'; }, 2000);
                        });
                    }
                });
            });
        })();
        </script>
        @endpush
    </x-slot:sidebar>

    <x-slot:related>
        @if(($related_posts ?? collect())->isNotEmpty())
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-grid-fill me-2 text-primary"></i>
                {{ __('Recommended Reading') }}
            </h4>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                @foreach($related_posts as $related)
                    @include('frontend.blogs._partials._card', ['blog' => $related])
                @endforeach
            </div>
        </div>
        @endif
    </x-slot:related>
</x-frontend.detail-shell>
@endsection
