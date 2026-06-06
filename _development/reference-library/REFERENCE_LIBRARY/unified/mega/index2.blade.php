{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}
@extends('frontend.layouts.app')



@section('content')

{{-- ================= CUSTOM STYLES ================= --}}
@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<style>
    body { font-family:'Inter',sans-serif; background-color:#f8f9fa; }
    .navbar-brand { font-weight:700; }
    .hero-section {
        background:linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)),
                   url('https://picsum.photos/seed/hero/1600/600') no-repeat center center;
        background-size:cover; padding:100px 0; text-align:center;
    }
    .hero-search-bar {
        max-width:800px; margin:0 auto; background-color:white;
        padding:15px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.08);
    }
    .btn-category-filter { border-radius:20px; padding:5px 15px; margin:5px; font-size:.9rem; color:#fff; }
    .color-property{background:#008080}.color-event{background:#F97316}.color-auto{background:#1E3A8A}
    .color-service{background:#16A34A}.color-job{background:#7C3AED}.color-classified{background:#DC2626}
    .card { border:none; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.08); overflow:hidden; transition:.2s; }
    .card:hover{transform:translateY(-5px); box-shadow:0 8px 20px rgba(0,0,0,0.12);}
    .card-img-top{height:200px;object-fit:cover;}
    .tag-pill{display:inline-block;padding:2px 10px;border-radius:15px;font-size:.75rem;color:#fff;margin-top:5px;}
    .category-spotlight-card{min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-weight:600;color:white;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,.08);}
    .stats-section .stat-item{font-size:2.5rem;font-weight:700;color:#343a40;}
    .stats-section .stat-label{color:#6c757d;font-size:1.1rem;}
    .how-it-works-item{text-align:center;padding:20px;}
    .how-it-works-item i{font-size:3rem;color:#0d6efd;margin-bottom:15px;}
    .testimonial-img{width:80px;height:80px;object-fit:cover;border-radius:50%;margin-bottom:15px;}
    .footer{background:#343a40;color:#f8f9fa;padding:50px 0;}
    .footer a{color:#f8f9fa;text-decoration:none;} .footer a:hover{text-decoration:underline;}
</style>
@endpush

{{-- ================= NAVBAR ================= --}}
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
  <div class="container">
    <a class="navbar-brand" href="{{ route('#') }}">Mega Market</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" href="{{ route('#') }}">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">About</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Contact</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Post Ad</a></li>
        <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Login</a></li>
      </ul>
    </div>
  </div>
</nav>

{{-- ================= HERO ================= --}}
<section class="hero-section">
  <div class="container">
    <h1 class="display-4 fw-bold mb-4">Find Anything, Anywhere</h1>
    <p class="lead mb-5">Your one-stop marketplace for everything you need.</p>
    <div class="hero-search-bar">
      <form class="row g-2 align-items-center justify-content-center">
        <div class="col-md-7 col-lg-8">
          <div class="input-group search-input-group">
            <input type="text" class="form-control form-control-lg" placeholder="I'm looking for...">
            <button class="btn btn-primary btn-lg" type="submit">Search</button>
          </div>
        </div>
        <div class="col-md-5 col-lg-4 d-flex justify-content-center flex-wrap">
          @php $filters = ['Properties'=>'property','Events'=>'event','Autos'=>'auto','Services'=>'service','Jobs'=>'job','Classifieds'=>'classified']; @endphp
          @foreach($filters as $label=>$cls)
            <button type="button" class="btn btn-category-filter color-{{ $cls }}">{{ $label }}</button>
          @endforeach
        </div>
      </form>
    </div>
  </div>
</section>

{{-- ================= TRENDING TABS ================= --}}
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="text-center mb-4 fw-bold">Trending Now</h2>
    <ul class="nav nav-tabs justify-content-center mb-4" id="trendingTabs" role="tablist">
      @php $cats=['properties','events','autos','services','jobs','classifieds']; @endphp
      @foreach($cats as $i=>$c)
        <li class="nav-item" role="presentation">
          <button class="nav-link @if($i==0) active @endif" data-bs-toggle="tab" data-bs-target="#{{ $c }}" type="button">{{ ucfirst($c) }}</button>
        </li>
      @endforeach
    </ul>
    <div class="tab-content">
      @foreach($cats as $i=>$c)
      <div class="tab-pane fade @if($i==0) show active @endif" id="{{ $c }}">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          @php
            $items = [
              ['title'=>'Sample 1','desc'=>'Short description here','price'=>'$100','category'=>ucfirst($c),'color'=>$c,'image'=>"https://picsum.photos/seed/{$c}1/600/400"],
              ['title'=>'Sample 2','desc'=>'Another item description','price'=>'$200','category'=>ucfirst($c),'color'=>$c,'image'=>"https://picsum.photos/seed/{$c}2/600/400"],
              ['title'=>'Sample 3','desc'=>'Something interesting','price'=>'$300','category'=>ucfirst($c),'color'=>$c,'image'=>"https://picsum.photos/seed/{$c}3/600/400"],
              ['title'=>'Sample 4','desc'=>'More details here','price'=>'$400','category'=>ucfirst($c),'color'=>$c,'image'=>"https://picsum.photos/seed/{$c}4/600/400"],
            ];
          @endphp
          @foreach($items as $item)
          <div class="col">
            <div class="card h-100">
              <img src="{{ $item['image'] }}" class="card-img-top" alt="{{ $item['title'] }}">
              <div class="card-body">
                <h5 class="card-title">{{ $item['title'] }}</h5>
                <p class="text-muted">{{ $item['desc'] }}</p>
                <div class="d-flex justify-content-between">
                  <h6 class="fw-bold mb-0">{{ $item['price'] }}</h6>
                  <span class="tag-pill color-{{ $item['color'] }}">{{ $item['category'] }}</span>
                </div>
              </div>
            </div>
          </div>
          @endforeach
        </div>
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ================= FEATURED ================= --}}
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-4 fw-bold">Featured Listings</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      @php
        $featured=[
          ['title'=>'Modern Lakeside Villa','desc'=>'Luxury living with lake views','price'=>'$1,200,000','color'=>'property','image'=>'https://picsum.photos/seed/feat1/600/400'],
          ['title'=>'Brand New Electric Sedan','desc'=>'Zero emissions and tech','price'=>'$78,500','color'=>'auto','image'=>'https://picsum.photos/seed/feat2/600/400'],
          ['title'=>'Rock & Roll Festival','desc'=>'Biggest music event of the year','price'=>'$99','color'=>'event','image'=>'https://picsum.photos/seed/feat3/600/400']
        ];
      @endphp
      @foreach($featured as $item)
      <div class="col">
        <div class="card h-100">
          <img src="{{ $item['image'] }}" class="card-img-top" alt="{{ $item['title'] }}">
          <div class="card-body">
            <h5 class="card-title">{{ $item['title'] }}</h5>
            <p class="text-muted">{{ $item['desc'] }}</p>
            <div class="d-flex justify-content-between">
              <h6 class="fw-bold mb-0">{{ $item['price'] }}</h6>
              <span class="tag-pill color-{{ $item['color'] }}">{{ ucfirst($item['color']) }}</span>
            </div>
          </div>
        </div>
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ================= STATS ================= --}}
<section class="py-5 bg-primary text-white stats-section text-center">
  <div class="container">
    <h2 class="fw-bold mb-5">Our Community by the Numbers</h2>
    <div class="row">
      <div class="col-md-4"><div class="stat-item">1M+</div><div class="stat-label">Active Users</div></div>
      <div class="col-md-4"><div class="stat-item">500K+</div><div class="stat-label">Listings</div></div>
      <div class="col-md-4"><div class="stat-item">10K+</div><div class="stat-label">Businesses</div></div>
    </div>
  </div>
</section>

{{-- ================= CATEGORIES ================= --}}
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-4 fw-bold">Explore Categories</h2>
    <div class="row g-4 justify-content-center">
      @foreach($filters as $label=>$cls)
      <div class="col-6 col-md-4 col-lg-2">
        <a href="{{ route('#') }}" class="text-decoration-none">
          <div class="category-spotlight-card color-{{ $cls }}">
            <i class="bi bi-{{ $cls=='property'?'house-door':($cls=='event'?'calendar-event':($cls=='auto'?'car-front':($cls=='service'?'gear':($cls=='job'?'briefcase':'shop')))) }}"></i>
            <span>{{ $label }}</span>
          </div>
        </a>
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ================= HOW IT WORKS ================= --}}
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="text-center mb-5 fw-bold">How It Works</h2>
    <div class="row">
      @php
        $steps=[['icon'=>'person-plus','title'=>'Create an Account','desc'=>'Sign up quickly and easily'],
                ['icon'=>'file-earmark-plus','title'=>'Post a Listing','desc'=>'List with simple steps'],
                ['icon'=>'currency-dollar','title'=>'Connect & Transact','desc'=>'Connect securely']];
      @endphp
      @foreach($steps as $s)
      <div class="col-md-4 how-it-works-item">
        <i class="bi bi-{{ $s['icon'] }}"></i>
        <h4>{{ $s['title'] }}</h4>
        <p class="text-muted">{{ $s['desc'] }}</p>
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ================= TESTIMONIALS ================= --}}
<section class="py-5">
  <div class="container text-center">
    <h2 class="fw-bold mb-5">What Our Users Say</h2>
    <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        @php
          $testimonials=[
            ['img'=>'https://picsum.photos/seed/user1/100/100','text'=>'Mega Market made finding my new home easy.','name'=>'Jane Doe, Buyer'],
            ['img'=>'https://picsum.photos/seed/user2/100/100','text'=>'I sold my car within a week.','name'=>'John Smith, Seller'],
            ['img'=>'https://picsum.photos/seed/user3/100/100','text'=>'From services to events, it’s my go-to app.','name'=>'Emily White, User']
          ];
        @endphp
        @foreach($testimonials as $i=>$t)
        <div class="carousel-item @if($i==0) active @endif">
          <div class="d-flex flex-column align-items-center text-center p-4">
            <img src="{{ $t['img'] }}" class="testimonial-img" alt="{{ $t['name'] }}">
            <p class="lead mb-3">"{{ $t['text'] }}"</p>
            <h5 class="fw-bold">- {{ $t['name'] }}</h5>
          </div>
        </div>
        @endforeach
      </div>
      <button class="carousel-control-prev" data-bs-target="#testimonialCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
      <button class="carousel-control-next" data-bs-target="#testimonialCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
    </div>
  </div>
</section>

{{-- ================= CTA ================= --}}
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="mb-3 fw-bold">Ready to Buy or Sell?</h2>
    <p class="lead mb-4">Join our community and start today!</p>
    <a href="{{ route('#') }}" class="btn btn-light btn-lg">Get Started Now</a>
  </div>
</section>

{{-- ================= FOOTER ================= --}}
<footer class="footer">
  <div class="container">
    <div class="row">
      <div class="col-md-4"><h5>Mega Market</h5><p class="text-muted">Your marketplace for everything.</p></div>
      <div class="col-md-2"><h5>Company</h5><ul class="list-unstyled"><li><a href="{{ route('#') }}">About Us</a></li><li><a href="{{ route('#') }}">Careers</a></li></ul></div>
      <div class="col-md-2"><h5>Support</h5><ul class="list-unstyled"><li><a href="{{ route('#') }}">Help Center</a></li><li><a href="{{ route('#') }}">Contact</a></li></ul></div>
      <div class="col-md-2"><h5>Legal</h5><ul class="list-unstyled"><li><a href="{{ route('#') }}">Terms</a></li><li><a href="{{ route('#') }}">Privacy</a></li></ul></div>
      <div class="col-md-2"><h5>Follow Us</h5><ul class="list-unstyled d-flex"><li class="me-3"><a href="{{ route('#') }}"><i class="bi bi-facebook"></i></a></li><li><a href="{{ route('#') }}"><i class="bi bi-twitter"></i></a></li></ul></div>
    </div>
    <hr class="my-4 border-secondary">
    <div class="text-center text-muted">&copy; {{ date('Y') }} Mega Market. All rights reserved.</div>
  </div>
</footer>

@endsection
