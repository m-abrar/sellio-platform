<section class="hero-section text-center">
    <div class="container-xl">
        {{-- Text Content --}}
        <div class="row pt-2 pt-md-5 pb-2 pb-md-4" data-aos="fade-up">
            <div class="col-12 text-center">
                <span class="badge bg-primary-light border border-primary border-opacity-25 text-primary rounded-pill px-4 py-2 fw-800 mb-3 tracking-wider">
                    {!! page_content('home.hero.badge', __('THE ALL-IN-ONE MARKETPLACE')) !!}
                </span>

                <h1 class="fw-800 display-3 mb-3 tracking-tight text-dark">
                    {!! page_content('home.hero.title', 'Find Everything <span class="text-primary">Extraordinary.</span>') !!}
                </h1>

                <p class="fs-5 text-muted mx-auto mb-5 hero-text-max">
                    {{ page_content('home.hero.description', __('The ultimate destination to buy, sell, and discover premium properties, verified vehicles, and top-tier careers.')) }}
                </p>
            </div>
        </div>

        {{-- Search Container --}}
        <div class="search-container-wrapper mx-auto hero-search-max" data-aos="zoom-in" data-aos-delay="200">
            <ul class="nav nav-pills justify-content-center" id="searchTab" role="tablist">
                @php
                    $tabs = [
                        ['id' => 'properties', 'icon' => 'bi-building', 'label' => __('Properties')],
                        ['id' => 'autos', 'icon' => 'bi-car-front-fill', 'label' => __('Autos')],
                        ['id' => 'jobs', 'icon' => 'bi-briefcase', 'label' => __('Jobs')],
                        ['id' => 'classifieds', 'icon' => 'bi-tag', 'label' => __('Classifieds')],
                    ];
                @endphp

                @foreach($tabs as $tab)
                <li class="nav-item" role="presentation">
                    <div class="pill-group">
                        <button class="nav-link @if($loop->first) active @endif" 
                                id="{{ $tab['id'] }}-tab" 
                                data-bs-toggle="pill" 
                                data-bs-target="#{{ $tab['id'] }}" 
                                type="button" role="tab" 
                                aria-controls="{{ $tab['id'] }}"
                                aria-selected="{{ $loop->first ? 'true' : 'false' }}">
                            <i class="bi {{ $tab['icon'] }}"></i>
                        </button>
                        <div class="label-text">{{ $tab['label'] }}</div>
                    </div>
                </li>
                @endforeach
            </ul>

            <div class="glass-hero-panel">
                <div class="tab-content" id="searchTabContent">
                    {{-- Form logic remains same but ensure __() is used for all placeholders --}}
                    @include('frontend.themes.unifieds.default._partials._hero_search_forms')
                </div>
            </div>
        </div>
    </div>
</section>