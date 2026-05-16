{{-- resources/views/frontend/unifieds/mega.blade.php --}}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unified Marketplace — Mega Template</title>

  <!-- Bootstrap 5 CSS (CDN) -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome (CDN) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

  <style>
    :root{
      --accent: #0d6efd;
      --muted: #6c757d;
      --bg: #f8f9fa;
    }
    /* Global */
    body { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:var(--bg); color:#222; }
    a { text-decoration: none; }
    .no-radius { border-radius: 0 !important; }
    .card-no-radius { border-radius: 0 !important; overflow: hidden; }
    /* Navbar */
    .navbar { transition: background .25s ease, box-shadow .25s ease; }
    .navbar.scrolled { background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
    /* Hero */
    .hero {
      min-height: 60vh;
      background-image: url('https://picsum.photos/1600/900?random=100');
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .hero::before { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35)); }
    .hero .hero-inner { position:relative; z-index:2; text-align:center; max-width:1000px; }
    .hero h1 { font-size: clamp(1.8rem, 3vw, 3rem); font-weight:700; margin-bottom:.5rem; }
    .hero p.lead { font-size:1.05rem; opacity:.95; }

    /* Search bar */
    .search-card { transform: translateY(-35px); z-index: 3; position: relative; }
    .search-card .form-control, .search-card .btn { height:56px; }

    /* Mega categories */
    .category-box { position: relative; overflow: hidden; height: 100%; }
    .category-box .carousel-item img { object-fit: cover; width:100%; height:100%; display:block; }
    .category-box .overlay { position:absolute; left:0; bottom:0; width:100%; padding:1.25rem; background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0)); color:#fff; }
    .category-box .overlay h3 { margin:0; font-size:1.25rem; font-weight:700; }
    .category-box .overlay p { margin:0; font-size:.9rem; opacity:.95; }

    /* Remove rounded corners for all image blocks */
    .carousel, .carousel-inner, .carousel-item, .category-box img { border-radius: 0 !important; }

    /* Trending listings */
    .listing-card img { height:160px; object-fit:cover; width:100%; display:block; }

    /* CTA */
    .cta-banner { background: linear-gradient(90deg, #0d6efd 0%, #6610f2 100%); color:#fff; padding:3rem 1rem; }

    /* Testimonials */
    .testimonial { background:#fff; padding:1.5rem; border-radius:0; box-shadow:0 6px 20px rgba(0,0,0,0.04); }

    /* Footer */
    footer { background:#111827; color: #d1d5db; padding:3rem 0; }
    footer a { color:inherit; opacity:.9; }
    footer a:hover { opacity:1; text-decoration:underline; }

    @media (max-width: 991px) {
      .search-card { transform: translateY(-20px); }
      .hero { min-height:50vh; }
    }
  </style>




<style>
.marketplace-page {
  font-family: "Poppins", sans-serif;
}

/* --- Category Box --- */
.mega-showcase .category-box {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  cursor: pointer;
  height: 100%;
}
.mega-showcase .category-box img {
  object-fit: cover;
  width: 100%;
  height: 300px;
  filter: brightness(70%);
  transition: all 0.5s ease;
}
.mega-showcase .category-box:hover img {
  transform: scale(1.05);
  filter: brightness(50%);
}
.mega-showcase .overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  padding: 1.5rem;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0));
}
.mega-showcase .overlay-content h3 {
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.mega-showcase .overlay-content p {
  font-size: 0.9rem;
  margin-bottom: 0;
  opacity: 0.9;
}
</style>













</head>
<body>

@php
  // === Data arrays (replace these with DB queries or controller-provided data) ===

  $nav = [
    ['label'=>'Home', 'href'=>'#home'],
    ['label'=>'Properties', 'href'=>'#properties'],
    ['label'=>'Autos', 'href'=>'#autos'],
    ['label'=>'Events', 'href'=>'#events'],
    ['label'=>'Classifieds', 'href'=>'#classifieds'],
    ['label'=>'Services', 'href'=>'#services'],
    ['label'=>'Jobs', 'href'=>'#jobs'],
    ['label'=>'Blog', 'href'=>'#blog'],
  ];

  $categories = [
    [
      'id'=>'properties', 'name'=>'Properties', 'desc'=>'Find your dream home or investment.', 'color'=>'#0d6efd', 'icon'=>'fa-house',
      'slides'=>[101,102,103]
    ],
    [
      'id'=>'autos', 'name'=>'Autos', 'desc'=>'New and used vehicles for every need.', 'color'=>'#198754', 'icon'=>'fa-car',
      'slides'=>[201,202,203]
    ],
    [
      'id'=>'events', 'name'=>'Events', 'desc'=>'Concerts, meetups and local happenings.', 'color'=>'#6f42c1', 'icon'=>'fa-calendar-days',
      'slides'=>[301,302]
    ],
    [
      'id'=>'classifieds', 'name'=>'Classifieds', 'desc'=>'Buy, sell, trade — local ads.', 'color'=>'#fd7e14', 'icon'=>'fa-tag',
      'slides'=>[401,402]
    ],
    [
      'id'=>'services', 'name'=>'Services', 'desc'=>'Skilled pros for every job.', 'color'=>'#20c997', 'icon'=>'fa-wrench',
      'slides'=>[501,502,503]
    ],
    [
      'id'=>'jobs', 'name'=>'Jobs', 'desc'=>'Career opportunities and gigs.', 'color'=>'#6c757d', 'icon'=>'fa-briefcase',
      'slides'=>[601,602,603]
    ],
  ];

  // Sample trending listings
  $listings = collect(range(1,8))->map(function($i){
    return (object)[
      'title'=>"Listing #{$i}",
      'subtitle'=>"City ".chr(64+$i),
      'price'=> ($i*10).'k',
      'img'=> "https://picsum.photos/600/400?random=".(900+$i)
    ];
  });

  // Testimonials
  $testimonials = [
    ['name'=>'Sara W.','text'=>'Amazing platform — 5 stars!','role'=>'Host'],
    ['name'=>'David L.','text'=>'Found my car in a week. Highly recommend.','role'=>'Buyer'],
    ['name'=>'Amir K.','text'=>'Smooth, fast, and reliable listing flow.','role'=>'Seller'],
  ];

  // Blogs
  $blogs = collect(range(1,3))->map(function($i){
    return (object)[
      'title'=>"How to prepare for listing #{$i}",
      'excerpt'=>"Short summary for blog post {$i}. Tips and tricks to boost your listing performance.",
      'img'=>"https://picsum.photos/800/450?random=".(1100+$i)
    ];
  });

  // Footer links
  $footer = [
    'About' => ['About Us','Careers','Contact'],
    'Explore' => ['Properties','Autos','Events','Classifieds'],
    'Resources' => ['Blog','Help Center','Terms'],
    'Contact' => ['support@example.com','+1 234 567 890','Twitter / LinkedIn'],
  ];
@endphp

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-light fixed-top py-3">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">Unified<span class="text-muted">Market</span></a>

    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navMain">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        @foreach($nav as $n)
          <li class="nav-item px-2"><a class="nav-link" href="{{ $n['href'] }}">{{ $n['label'] }}</a></li>
        @endforeach
      </ul>
      <div class="d-flex">
        <a href="#" class="btn btn-outline-primary me-2 no-radius">Sign in</a>
        <a href="#" class="btn btn-primary no-radius">Post Ad</a>
      </div>
    </div>
  </div>
</nav>

<!-- HERO -->
<section id="home" class="hero">
  <div class="hero-inner text-center px-3">
    <h1>Explore Everything in One Unified Marketplace</h1>
    <p class="lead">From homes to cars, jobs to events — discover and post listings in minutes.</p>
    <div class="mt-4">
      <a href="#properties" class="btn btn-light btn-lg me-2 no-radius">Browse Categories</a>
      <a href="#" class="btn btn-outline-light btn-lg no-radius">Post Listing</a>
    </div>
  </div>
</section>

<!-- SEARCH -->
<div class="container search-card">
  <div class="card card-no-radius shadow-sm">
    <div class="card-body">
      <form class="row g-2 align-items-center">
        <div class="col-md-4">
          <input type="text" class="form-control no-radius" placeholder="What are you looking for? (e.g., apartment, Toyota, plumber)">
        </div>
        <div class="col-md-3">
          <select class="form-select no-radius">
            <option selected>All categories</option>
            @foreach($categories as $c)
              <option value="{{ $c['id'] }}">{{ $c['name'] }}</option>
            @endforeach
          </select>
        </div>
        <div class="col-md-3">
          <input type="text" class="form-control no-radius" placeholder="Location (city, area)">
        </div>
        <div class="col-md-2 d-grid">
          <button class="btn btn-primary no-radius" type="submit"><i class="fa fa-search me-2"></i>Search</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- MEGA CATEGORIES -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-4">
      <h2 class="fw-bold">Explore by Category</h2>
      <p class="text-muted">Curated categories to help users find what they need — fast.</p>
    </div>

    <div class="row g-4">
      {{-- Left big column (Property) and right column with autos + two small boxes --}}
      <div class="col-lg-6">
        @php $cat = $categories[0]; @endphp
        <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:420px">
          <div class="carousel-inner h-100">
            @foreach($cat['slides'] as $idx => $s)
              <div class="carousel-item @if($idx==0) active @endif h-100">
                <img src="https://picsum.photos/1200/700?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
              </div>
            @endforeach
          </div>
          <div class="overlay" style="background: linear-gradient(to top, #007bffbb, transparent);">
            <h3><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h3>
            <p>{{ $cat['desc'] }}</p>
          </div>
          <button class="carousel-control-prev no-radius" type="button" data-bs-target="#{{ $cat['id'] }}Carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next no-radius" type="button" data-bs-target="#{{ $cat['id'] }}Carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="row g-4">
          {{-- Autos big top --}}
          <div class="col-12">
            @php $cat = $categories[1]; @endphp
            <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:210px">
              <div class="carousel-inner h-100">
                @foreach($cat['slides'] as $idx => $s)
                  <div class="carousel-item @if($idx==0) active @endif h-100">
                    <img src="https://picsum.photos/1200/400?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
                  </div>
                @endforeach
              </div>
              <div class="overlay" style="background: linear-gradient(to top, #28a745bb, transparent);">
                <h3><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h3>
                <p>{{ $cat['desc'] }}</p>
              </div>
            </div>
          </div>

          {{-- two small boxes: events + classifieds --}}
          <div class="col-6">
            @php $cat = $categories[2]; @endphp
            <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:200px">
              <div class="carousel-inner h-100">
                @foreach($cat['slides'] as $idx => $s)
                  <div class="carousel-item @if($idx==0) active @endif h-100">
                    <img src="https://picsum.photos/800/500?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
                  </div>
                @endforeach
              </div>
              <div class="overlay" style="background: linear-gradient(to top, #6f42c1bb, transparent);">
                <h5><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h5>
                <p class="mb-0">{{ $cat['desc'] }}</p>
              </div>
            </div>
          </div>

          <div class="col-6">
            @php $cat = $categories[3]; @endphp
            <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:200px">
              <div class="carousel-inner h-100">
                @foreach($cat['slides'] as $idx => $s)
                  <div class="carousel-item @if($idx==0) active @endif h-100">
                    <img src="https://picsum.photos/800/500?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
                  </div>
                @endforeach
              </div>
              <div class="overlay" style="background: linear-gradient(to top, #fd7e14bb, transparent);">
                <h5><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h5>
                <p class="mb-0">{{ $cat['desc'] }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    {{-- bottom row: services + jobs --}}
    <div class="row g-4 mt-3">
      <div class="col-lg-6">
        @php $cat = $categories[4]; @endphp
        <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:320px">
          <div class="carousel-inner h-100">
            @foreach($cat['slides'] as $idx => $s)
              <div class="carousel-item @if($idx==0) active @endif h-100">
                <img src="https://picsum.photos/1200/600?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
              </div>
            @endforeach
          </div>
          <div class="overlay" style="background: linear-gradient(to top, #20c997bb, transparent);">
            <h3><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h3>
            <p>{{ $cat['desc'] }}</p>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        @php $cat = $categories[5]; @endphp
        <div id="{{ $cat['id'] }}Carousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" style="height:320px">
          <div class="carousel-inner h-100">
            @foreach($cat['slides'] as $idx => $s)
              <div class="carousel-item @if($idx==0) active @endif h-100">
                <img src="https://picsum.photos/1200/600?random={{ $s }}" alt="{{ $cat['name'] }} slide {{ $idx+1 }}" class="d-block w-100 h-100">
              </div>
            @endforeach
          </div>
          <div class="overlay" style="background: linear-gradient(to top, #343a40bb, transparent);">
            <h3><i class="fa {{ $cat['icon'] }} me-2"></i> {{ $cat['name'] }}</h3>
            <p>{{ $cat['desc'] }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- TRENDING LISTINGS -->
<section class="py-5">
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Trending Right Now</h3>
      <a href="#" class="text-decoration-none">View all <i class="fa fa-arrow-right ms-1"></i></a>
    </div>

    <div id="trendingCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        @foreach($listings->chunk(4) as $chunkIdx => $chunk)
          <div class="carousel-item @if($chunkIdx==0) active @endif">
            <div class="row g-3">
              @foreach($chunk as $item)
                <div class="col-md-3">
                  <div class="card listing-card card-no-radius">
                    <img src="{{ $item->img }}" alt="{{ $item->title }}">
                    <div class="card-body">
                      <h6 class="card-title mb-1">{{ $item->title }}</h6>
                      <p class="text-muted small mb-1">{{ $item->subtitle }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">{{ $item->price }}</span>
                        <a href="#" class="btn btn-sm btn-outline-primary no-radius">View</a>
                      </div>
                    </div>
                  </div>
                </div>
              @endforeach
            </div>
          </div>
        @endforeach
      </div>

      <button class="carousel-control-prev no-radius" type="button" data-bs-target="#trendingCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next no-radius" type="button" data-bs-target="#trendingCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>

  </div>
</section>

<!-- CTA BANNER -->
<section class="cta-banner text-center my-5" style="background: linear-gradient(90deg, #0062cc, #20c997);">
  <div class="container">
    <h2 class="fw-bold">Ready to reach millions of buyers?</h2>
    <p class="mb-4">Post your listing today and get discovered by local customers.</p>
    <a href="#" class="btn btn-light btn-lg no-radius me-2">Post Your Ad</a>
    <a href="#" class="btn btn-outline-light btn-lg no-radius">Learn More</a>
  </div>
</section>


<!-- TESTIMONIALS -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-4">
      <h3 class="fw-bold">What our users say</h3>
      <p class="text-muted">Real stories from people who used the platform.</p>
    </div>

    <div id="testimonialsCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        @foreach($testimonials as $i => $t)
          <div class="carousel-item @if($i==0) active @endif">
            <div class="row justify-content-center">
              <div class="col-md-8">
                <div class="testimonial text-center">
                  <p class="mb-3">“{{ $t['text'] }}”</p>
                  <strong>{{ $t['name'] }}</strong>
                  <div class="text-muted small">{{ $t['role'] }}</div>
                </div>
              </div>
            </div>
          </div>
        @endforeach
      </div>
      <button class="carousel-control-prev no-radius" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next no-radius" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</section>

<!-- BLOG -->
<section id="blog" class="py-5 bg-white">
  <div class="container">
    <div class="text-center mb-4">
      <h3 class="fw-bold">From our blog</h3>
      <p class="text-muted">Tips, guides and news to help you succeed.</p>
    </div>

    <div class="row g-4">
      @foreach($blogs as $b)
        <div class="col-md-4">
          <div class="card card-no-radius">
            <img src="{{ $b->img }}" class="d-block w-100" style="height:200px; object-fit:cover" alt="{{ $b->title }}">
            <div class="card-body">
              <h5 class="card-title">{{ $b->title }}</h5>
              <p class="text-muted small">{{ $b->excerpt }}</p>
              <a href="#" class="text-decoration-none">Read more →</a>
            </div>
          </div>
        </div>
      @endforeach
    </div>
  </div>
</section>

<!-- NEWSLETTER -->
<section class="py-5">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <h4 class="fw-bold">Stay updated</h4>
        <p class="text-muted">Subscribe to our newsletter for the latest deals and tips.</p>
      </div>
      <div class="col-md-6">
        <form class="d-flex gap-2">
          <input class="form-control no-radius" type="email" placeholder="you@example.com">
          <button class="btn btn-primary no-radius" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="row">
      @foreach($footer as $colTitle => $links)
        <div class="col-md-3 mb-3">
          <h6 class="text-white">{{ $colTitle }}</h6>
          <ul class="list-unstyled">
            @foreach($links as $l)
              <li><a href="#">{{ $l }}</a></li>
            @endforeach
          </ul>
        </div>
      @endforeach
    </div>

    <div class="mt-4 border-top pt-3 d-flex justify-content-between align-items-center">
      <div>&copy; {{ date('Y') }} UnifiedMarket. All rights reserved.</div>
      <div class="small">Designed with ❤️</div>
    </div>
  </div>
</footer>

<!-- Bootstrap 5 JS (CDN) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
  // Navbar scroll background toggle
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  });

  // Initialize carousels with interval
  document.querySelectorAll('.carousel').forEach((el) => {
    // default auto slide every 5s except trending (which we'll keep as default)
    if (!el.id || el.id === 'trendingCarousel' || el.id === 'testimonialsCarousel') return;
    const bs = bootstrap.Carousel.getOrCreateInstance(el, { interval: 4000, ride: 'carousel' });
  });
</script>

</body>
</html>
