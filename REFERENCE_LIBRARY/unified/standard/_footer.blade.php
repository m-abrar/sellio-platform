{{-- Footer --}}
<footer class="mt-5 pt-5 pb-3 bg-dark"> {{-- Added bg-dark for better contrast --}}
    <div class="container-xl">
        <div class="row">

            <div class="col-md-4 mb-4 mb-md-0">
                <a href="#" class="footer-logo mb-3 d-block fw-bold fs-5" style="color: var(--primary-color);"><i class="bi bi-rocket-takeoff-fill me-2"></i>{{setting('site_name', env('APP_NAME'))}}</a>
                <p class="small text-light">Elevating your experience with innovative solutions.</p>
                <div class="mt-3">
                    <a href="#" class="social-icon me-2 text-light fs-5"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="social-icon me-2 text-light fs-5"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="social-icon me-2 text-light fs-5"><i class="bi bi-twitter-x"></i></a>
                </div>
            </div>

            <div class="col-md-2 col-6">
                <h6 class="fw-bold mb-3 text-white">Company</h6> {{-- Changed to text-white for clarity --}}
                <a href="#" class="d-block text-decoration-none text-light small mb-2">About Us</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Careers</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Press</a>
            </div>

            <div class="col-md-2 col-6">
                <h6 class="fw-bold mb-3 text-white">Support</h6>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Help Center</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Contact Support</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Terms of Service</a>
            </div>

            <div class="col-md-2 col-6 mt-4 mt-md-0">
                <h6 class="fw-bold mb-3 text-white">Resources</h6>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">API Documentation</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">System Status</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2">Pricing</a>
            </div>

            <div class="col-md-2 col-6 mt-4 mt-md-0">
                <h6 class="fw-bold mb-3 text-white">Settings</h6>
                <a href="#" class="d-block text-decoration-none text-light small mb-2"><i class="bi bi-globe me-1"></i> English (US)</a>
                <a href="#" class="d-block text-decoration-none text-light small mb-2"><i class="bi bi-currency-dollar me-1"></i> USD</a>
            </div>

        </div>

        <hr class="my-4" style="border-color: rgba(255, 255, 255, 0.5);">

        <div class="text-center small text-light">
            &copy; {{ date('Y') }} {{setting('site_name', env('APP_NAME'))}}. All rights reserved.
        </div>
    </div>
</footer>