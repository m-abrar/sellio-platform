<footer class="site-footer">
    <div class="container">
        <div class="row">
            <div class="col-lg-4 mb-4 mb-lg-0">
                <h5 class="footer-heading">{{ page_content('global.footer.widget_newsletter_heading', 'Newsletter Signup') }}</h5>
                <p>{{ page_content('global.footer.widget_newsletter_paragraph', 'Get the latest properties and deals directly in your inbox.') }}</p>
                <form class="d-flex">
                    <input type="email" class="form-control me-2" placeholder="Enter your email">
                    <button class="btn btn-primary flex-shrink-0" type="submit">{{ page_content('global.footer.widget_newsletter_button', 'Subscribe') }}</button>
                </form>
            </div>
            <div class="col-lg-2 col-md-4 col-6">
                <h5 class="footer-heading">Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="col-lg-2 col-md-4 col-6">
                <h5 class="footer-heading">Rentals</h5>
                <ul class="list-unstyled">
                    <li><a href="#">Beach Homes</a></li>
                    <li><a href="#">City Lofts</a></li>
                    <li><a href="#">Mountain Cabins</a></li>
                    <li><a href="#">Suburban</a></li>
                </ul>
            </div>
            <div class="col-lg-4 col-md-4">
                <h5 class="footer-heading">Travel Blog</h5>
                <ul class="list-unstyled">
                    <li><a href="#">Top 10 Vacation Spots</a></li>
                    <li><a href="#">Guide to Long-Term Rentals</a></li>
                    <li><a href="#">Hosting 101</a></li>
                </ul>
            </div>
        </div>
        <hr>
        <div class="text-center small">
            {!! page_content('global.footer.copyright', '&copy; 2025 StayFind. All Rights Reserved.') !!}
        </div>
    </div>
</footer>