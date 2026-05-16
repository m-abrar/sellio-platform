<div class="utility-bar d-none d-md-block">
  <div class="container d-flex justify-content-between">
    <div class="d-flex align-items-center">
        <a href="#" class="me-3">
            <i class="fa fa-circle-question me-1"></i> Help Center
        </a>
        <a href="#">
            <i class="fa fa-truck me-1"></i> Track Order
        </a>
    </div>

    <div>
      <div class="dropdown d-inline-block me-4">
        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-globe me-1"></i> English
        </a>
        <ul class="dropdown-menu no-radius">
          <li><a class="dropdown-item" href="#">Spanish</a></li>
          <li><a class="dropdown-item" href="#">French</a></li>
        </ul>
      </div>
      <div class="dropdown d-inline-block">
        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-dollar-sign me-1"></i> USD
        </a>
        <ul class="dropdown-menu no-radius">
          <li><a class="dropdown-item" href="#">EUR</a></li>
          <li><a class="dropdown-item" href="#">GBP</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="top-header-row">
  <div class="container d-flex justify-content-between align-items-center">
    
    <a href="#" class="logo-text fw-bold me-4">
        {!! page_content('global.header.brand', 'Unified<span class="market-word">Market</span>') !!}
    </a>

    <form class="d-flex search-bar w-50 flex-grow-1 mx-3 d-none d-lg-flex" role="search">
      <div class="input-group">
        <input type="text" class="form-control no-radius" placeholder="Search for property, car, service...">
        <select class="form-select w-auto search-form-category">
            <option selected>All categories</option>
            @foreach($categories as $c)
              <option value="{{ $c['id'] }}">{{ $c['name'] }}</option>
            @endforeach
        </select>
        <button class="btn no-radius" type="submit"><i class="fa fa-search"></i></button>
      </div>
    </form>

    <div class="action-buttons d-flex align-items-center ms-auto ms-lg-0">
      <a href="#" class="btn btn-outline-primary me-2 no-radius d-none d-sm-inline-block fw-semibold">
        <i class="fa fa-user me-1"></i> Account
      </a>
      <a href="#" class="btn btn-primary no-radius fw-semibold">
        <i class="fa fa-plus me-1"></i> Post Ad
      </a>
      <button class="navbar-toggler border-0 ms-2 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navBottom">
        <span class="navbar-toggler-icon"></span>
      </button>
      
    </div>
  </div>
</div>

<nav class="navbar navbar-expand-lg bottom-nav py-0">
  <div class="container">

    <div class="collapse navbar-collapse" id="navBottom">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 py-0">

        {{-- Browse All Dropdown (FIRST nav-item) --}}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa fa-bars me-2"></i>Browse All
          </a>
          <ul class="dropdown-menu no-radius">
              @foreach($categories as $c)
              <li><a class="dropdown-item" href="#{{ $c['id'] }}-explore"><i class="fa {{ $c['icon'] }} me-2"></i> {{ $c['name'] }}</a></li>
              @endforeach
          </ul>
        </li>

        {{-- Remaining menu links (includes Blog) --}}
        @foreach($nav as $n)
          @if($n['label'] != 'Properties') {{-- Properties link is covered by dropdown --}}
            <li class="nav-item"><a class="nav-link" href="{{ $n['href'] }}">{{ $n['label'] }}</a></li>
          @endif
        @endforeach

      </ul>
      
      {{-- Mobile Search Bar --}}
      <form class="d-flex search-bar w-100 p-3 d-lg-none" role="search">
        <div class="input-group">
          <input type="text" class="form-control no-radius" placeholder="What are you looking for?">
          <button class="btn btn-primary no-radius" type="submit"><i class="fa fa-search"></i></button>
        </div>
      </form>
    </div>
  </div>
</nav>