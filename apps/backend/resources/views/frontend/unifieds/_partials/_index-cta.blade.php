<section class="py-5 mb-5" data-aos="zoom-in">
    <div class="container-xl">
        <div class="rounded-5 overflow-hidden position-relative shadow-lg border-0">
            {{-- Background Layer --}}
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark-gradient z-index-0"></div>
            
            {{-- Aesthetic Glows --}}
            <div class="position-absolute top-0 end-0 m-n5 rounded-circle bg-primary opacity-25 blur-3xl glow-circle-lg"></div>
            <div class="position-absolute bottom-0 start-0 m-n5 rounded-circle bg-success opacity-25 blur-3xl glow-circle-sm"></div>

            <div class="row align-items-center position-relative g-0 z-index-1">
                <div class="col-lg-7 p-4 p-md-5 text-center text-lg-start">
                    <h2 class="display-5 fw-800 text-white mb-3">
                        {{ __('Ready to reach') }} <span class="text-primary">{{ __('thousands?') }}</span>
                    </h2>
                    <p class="lead text-white-50 mb-4 mx-auto mx-lg-0 max-w-500">
                        {{ __('List your property, vehicle, or job opening on the most trusted marketplace. Our verified community ensures high-quality leads every time.') }}
                    </p>
                    <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                        <a href="{{ filled(setting('url_partner')) ? setting('url_partner') : route('register') }}" class="btn btn-primary btn-lg rounded-pill px-5 fw-800 hover-lift shadow-sm">
                            {{ __('POST A LISTING') }}
                        </a>
                        <a href="{{ route('register') }}" class="btn btn-outline-light btn-lg rounded-pill px-5 fw-800 hover-lift">
                            {{ __('JOIN COMMUNITY') }}
                        </a>
                    </div>
                </div>
                
                <div class="col-lg-5 d-none d-lg-block text-end p-5">
                    <div class="glass-surface bg-opacity-20 rounded-5 p-4 border-white border-opacity-10 shadow-lg rotate-3 float-animation">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-success bg-opacity-25 icon-circle p-4 me-3">
                                <i class="bi bi-shield-check text-success fs-4"></i>
                            </div>
                            <div class="text-start">
                                <h6 class="mb-0 fw-800 text-white">{{ __('Verified Safety') }}</h6>
                                <small class="text-white-50">{{ __('Secure transactions only') }}</small>
                            </div>
                        </div>
                        <hr class="border-light opacity-25">
                        <div class="text-start text-white">
                            <h4 class="fw-800 mb-0">1.2k+</h4>
                            <p class="small text-white-50 mb-0">{{ __('Successful listings this week') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
