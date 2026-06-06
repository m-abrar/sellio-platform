<footer class="py-5">
    <div class="container container-max">
        <div class="row g-4">
            <div class="col-lg-4">
                {{-- Site Name and Logo --}}
                <a href="#" class="footer-logo mb-3 d-block"><i class="bi bi-buildings-fill"></i> {{ page_content('global.footer.brand', 'METRO HOMES') }}</a>
                
                {{-- Site Description --}}
                <p>{{ page_content('global.footer.paragraph', 'Your premier partner for buying and selling real estate in the heart of the city.') }}</p>
                
                {{-- Social Media Links --}}
                <div class="mt-4">
                    <a href="{{ setting('social_twitter', '#') }}" class="text-white me-3 fs-4"><i class="bi bi-twitter"></i></a>
                    <a href="{{ setting('social_facebook', '#') }}" class="text-white me-3 fs-4"><i class="bi bi-facebook"></i></a>
                    <a href="{{ setting('social_instagram', '#') }}" class="text-white me-3 fs-4"><i class="bi bi-instagram"></i></a>
                    <a href="{{ setting('social_linkedin', '#') }}" class="text-white fs-4"><i class="bi bi-linkedin"></i></a>
                </div>
            </div>
            
            <div class="col-lg-2 offset-lg-1">
                <h5 class="text-white fw-semibold mb-3">Quick Links</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="{{ route('properties.index') }}">Listings</a></li>
                    {{-- These links assume you have corresponding routes defined --}}
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">Rentals</a></li>
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">Agents</a></li>
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">Map Search</a></li>
                </ul>
            </div>
            
            <div class="col-lg-2">
                <h5 class="text-white fw-semibold mb-3">Company</h5>
                <ul class="list-unstyled">
                    {{-- These links assume you have corresponding routes defined --}}
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">About Us</a></li>
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">Careers</a></li>
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">Blog</a></li>
                    <li class="mb-2"><a href="{{ route('#') ?? '#' }}">FAQ</a></li>
                </ul>
            </div>
            
            <div class="col-lg-3">
                <h5 class="text-white fw-semibold mb-3">Contact Us</h5>
                <ul class="list-unstyled">
                    {{-- Dynamic Address --}}
                    <li class="mb-2">
                        <i class="bi bi-geo-alt-fill me-2"></i> 
                        {{ setting('address', 'Address goes here') }}
                    </li>
                    {{-- Dynamic Phone --}}
                    <li class="mb-2">
                        <i class="bi bi-telephone-fill me-2"></i> 
                        <a href="tel:{{ setting('phone') }}" class="text-white-50">
                            {{ setting('phone_contact') }}
                        </a>
                    </li>
                    {{-- Dynamic Email --}}
                    <li class="mb-2">
                        <i class="bi bi-envelope-fill me-2"></i> 
                        <a href="mailto:{{ setting('contact_email') }}" class="text-white-50">
                            {{ setting('email_contact') }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <hr class="my-4" style="border-color: rgba(255,255,255,0.2);">
        <div class="text-center text-muted">
            <p>{{ page_content('global.footer.copyright', '&copy; 2025 Metro Homes. All Rights Reserved.') }}</p>
        </div>
    </div>
</footer>