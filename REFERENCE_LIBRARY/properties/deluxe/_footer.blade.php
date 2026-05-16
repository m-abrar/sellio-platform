<footer>
    <div class="container container-max">
        <div class="row">
            {{-- Company Info & Subscription --}}
            <div class="col-md-4 mb-4 mb-md-0">
                <h6>{{ setting('site_name', 'LuxEstate') }}</h6>
                <p class="text-muted small">High-end properties, premium service. Subscribe to updates.</p>
                <form class="d-flex" role="search" action="{{ route('#') }}" method="POST" aria-label="Subscribe to newsletter">
                    @csrf
                    <input class="form-control form-control-sm me-2" type="email" name="email" placeholder="Email address" required aria-label="Email">
                    {{-- Using btn-primary as the default primary color set in your layout variables --}}
                    <button class="btn btn-sm btn-gold" type="submit">Subscribe</button> 
                </form>
            </div>
            
            {{-- Company Links --}}
            <div class="col-md-4 mb-4 mb-md-0">
                <h6>Company</h6>
                <ul class="list-unstyled small">
                    <li><a href="#" class="text-muted">About</a></li>
                    <li><a href="#" class="text-muted">Careers</a></li>
                    <li><a href="#contact" class="text-muted">Contact</a></li>
                </ul>
            </div>
            
            {{-- Legal Links --}}
            <div class="col-md-4">
                <h6>Legal</h6>
                <ul class="list-unstyled small">
                    <li><a href="#" class="text-muted">Privacy Policy</a></li>
                    <li><a href="#" class="text-muted">Terms of Service</a></li>
                    <li><a href="#" class="text-muted">Cookie Policy</a></li>
                </ul>
            </div>
        </div>

        <div class="text-center mt-4 small text-muted">
            {{-- Use PHP to dynamically get the current year --}}
            © {{ date('Y') }} {{ setting('site_name', 'LuxEstate') }}. All rights reserved.
        </div>
    </div>
</footer>