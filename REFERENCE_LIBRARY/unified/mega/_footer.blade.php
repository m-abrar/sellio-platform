<footer>
    {{-- Newsletter Section --}}
    <section class="footer-newsletter">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-3 mb-md-0">
            <h4 class="fw-bold fs-4">{{ page_content('global.newsletter.heading', 'Stay updated') }}</h4>
            <p class="mb-0">{{ page_content('global.newsletter.paragraph', 'Subscribe to our newsletter for the latest deals and tips.') }}</p>
          </div>
          <div class="col-md-6">
            <form class="d-flex gap-2">
              <input class="form-control no-radius" type="email" placeholder="you@example.com">
              <button class="btn btn-primary no-radius fw-semibold" type="submit">{{ page_content('global.newsletter.button', 'Subscribe') }}</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    {{-- Main Footer Links Section --}}
    <div class="container py-5">
      <div class="row">
        @php
            $footer = [
              'About' => ['About Us','Careers','Contact'],
              'Explore' => ['Properties','Autos','Events','Classifieds'],
              'Resources' => ['Blog','Help Center','Terms','Privacy'],
              'Contact' => ['support@example.com','+1 234 567 890','Twitter / LinkedIn'],
            ];
        @endphp
        @foreach($footer as $colTitle => $links)
            <div class="col-md-3 mb-4 mb-md-0">
            <h6 class="text-white fw-bold mb-3">{{ $colTitle }}</h6>
            <ul class="list-unstyled small">
                @foreach($links as $l)
                <li><a href="#">{{ $l }}</a></li>
                @endforeach
            </ul>
            </div>
        @endforeach
      </div>

      <div class="mt-4 border-top pt-3 d-flex justify-content-between align-items-center small">
      <div>{!! page_content('global.footer.copyright', '&copy; 2025 **UnifiedMarket**. All rights reserved.') !!}</div>
      <div class="d-none d-sm-block">{{ page_content('global.footer.designed', 'Designed with ❤️') }}</div>
      </div>
    </div>
</footer>