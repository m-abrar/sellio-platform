<div class="row g-4">
    {{-- Related Service Card 1 --}}
    <div class="col-md-4">
        <div class="card glass-surface related-service-card">
            <img src="https://picsum.photos/400/200?random=15" class="card-img-top related-img" alt="Service 1">
            <div class="card-body">
                <h6 class="card-title fw-bold">{{ ($isConsult ?? false) ? 'Estate Planning' : 'Hot Stone Therapy' }}</h6>
                <p class="card-text small text-muted mb-2">{{ ($isConsult ?? false) ? 'Secure your assets for the future with a personalized plan.' : '90 min of warm stone massage for ultimate muscle relaxation.' }}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-success">{{ ($isConsult ?? false) ? 'Free Consult' : '$160' }}</span>
                    <a href="#" class="btn btn-sm btn-primary-outline-cta">Explore</a>
                </div>
            </div>
        </div>
    </div>

    {{-- Related Service Card 2 --}}
    <div class="col-md-4">
        <div class="card glass-surface related-service-card">
            <img src="https://picsum.photos/400/200?random=16" class="card-img-top related-img" alt="Service 2">
            <div class="card-body">
                <h6 class="card-title fw-bold">{{ ($isConsult ?? false) ? 'Investment Analysis' : 'Ultimate Couple\'s Package' }}</h6>
                <p class="card-text small text-muted mb-2">{{ ($isConsult ?? false) ? 'Comprehensive look at your portfolio performance.' : 'Includes massage, facial, and private sauna access.' }}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-success">{{ ($isConsult ?? false) ? '$199' : '$350' }}</span>
                    <a href="#" class="btn btn-sm btn-primary-outline-cta">Explore</a>
                </div>
            </div>
        </div>
    </div>

    {{-- Related Service Card 3 --}}
    <div class="col-md-4">
        <div class="card glass-surface related-service-card">
            <img src="https://picsum.photos/400/200?random=17" class="card-img-top related-img" alt="Service 3">
            <div class="card-body">
                <h6 class="card-title fw-bold">Loyalty Program</h6>
                <p class="card-text small text-muted mb-2">Sign up for exclusive discounts and early access to new services.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-primary-color">Free</span>
                    <a href="#" class="btn btn-sm btn-primary-outline-cta">Sign Up</a>
                </div>
            </div>
        </div>
    </div>
</div>