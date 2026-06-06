<footer style="background-color: var(--bs-sales-blue);">
    <div class="container-xl py-5">
        <div class="row text-white g-4">
            
            <div class="col-md-4">
                <h5 class="fw-bold mb-3">{!! page_content('global.footer.brand', 'H&R Homes') !!}</h5>
                <p>123 Main St, Suite 500<br>Real Estate City, RE 10001</p>
                <p>Email: info@hrhomes.com<br>Phone: (555) 123-4567</p>
            </div>
            
            <div class="col-md-4">
                <h5 class="fw-bold mb-3">Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white text-decoration-none">About Us</a></li>
                    <li><a href="#" class="text-white text-decoration-none">Careers</a></li>
                    <li><a href="#" class="text-white text-decoration-none">FAQ</a></li>
                </ul>
                <div class="d-flex gap-2 mt-3">
                    <a href="#" class="btn btn-sm btn-light text-nowrap" style="color: var(--bs-sales-blue); font-weight: 600;">Sell Your Home</a>
                    <a href="#" class="btn btn-sm btn-light text-nowrap" style="color: var(--bs-rental-green); font-weight: 600;">Rent Your Place</a>
                </div>
            </div>
            
            <div class="col-md-4">
                <h5 class="fw-bold mb-3">Stay Updated</h5>
                <p>Subscribe to our newsletter for market updates.</p>
                <form>
                    <div class="input-group mb-3">
                        <input type="email" class="form-control" placeholder="Your Email" aria-label="Recipient's email" required>
                        <button class="btn btn-rental" type="submit">Subscribe</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="text-center text-white-50 py-3" style="background-color: rgba(0, 0, 0, 0.2);">
        {!! page_content('global.footer.copyright', '&copy; 2025 H&R Homes. All rights reserved.') !!}
    </div>
</footer>