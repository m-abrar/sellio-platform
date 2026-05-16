<footer class="classic-footer py-5">
    <div class="container">
        <div class="row">

            {{-- Footer Contact Info & Social Media --}}
            <div class="col-md-4 mb-4 mb-md-0">
                <h5 class="mb-3" style="font-family: var(--font-family-heading); color: #f4f2ed;">
                    {{ page_content('global.footer.brand', 'Estate Realty') }}
                </h5>
                <p class="small mb-1">{{ page_content('global.footer.paragraph1', 'Classic Homes. Modern Service.') }}</p>
                <p class="small mb-1">{{ page_content('global.footer.paragraph2', 'Phone: (555) 123-4567') }}</p>
                <p class="small mb-1">{{ page_content('global.footer.paragraph3', 'Email: info@estaterealty.com') }}</p>
                
                {{-- Social Media Links --}}
                    <div class="mt-3">
                        @if(setting('facebook_url'))
                            <a href="{{ setting('facebook_url') }}" class="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-facebook-f fa-lg"></i>
                            </a>
                        @endif

                        @if(setting('twitter_url'))
                            <a href="{{ setting('twitter_url') }}" class="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-twitter fa-lg"></i>
                            </a>
                        @endif

                        @if(setting('instagram_url'))
                            <a href="{{ setting('instagram_url') }}" class="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-instagram fa-lg"></i>
                            </a>
                        @endif

                        @if(setting('linkedin_url'))
                            <a href="{{ setting('linkedin_url') }}" class="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-linkedin-in fa-lg"></i>
                            </a>
                        @endif

                        @if(setting('youtube_url'))
                            <a href="{{ setting('youtube_url') }}" class="text-white me-3 footer-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-youtube fa-lg"></i>
                            </a>
                        @endif
                    </div>

            </div>

            {{-- Footer Agent Spotlight --}}
            <div class="col-md-4 mb-4 mb-md-0">
                <h5 class="mb-3" style="font-family: var(--font-family-heading); color: #f4f2ed;">{{ $agent_spotlight_title ?? 'Agent Spotlight' }}</h5>
                <div class="d-flex align-items-center">
                    <img src="{{ $spotlight_agent_photo ?? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&h=60&w=60' }}" 
                            class="rounded-circle me-3" 
                            alt="{{ $spotlight_agent_name ?? 'Agent Photo' }}" 
                            style="width: 60px; height: 60px;">
                    <div>
                        <p class="mb-0 fw-bold small">{{ $spotlight_agent_name ?? 'Meet Saint Junkins' }}</p>
                        <p class="mb-0 small">{{ $spotlight_agent_title ?? 'Your Classic Home Specialist' }}</p>
                    </div>
                </div>
            </div>

            {{-- Footer Newsletter Signup --}}
            <div class="col-md-4">
                <h5 class="mb-3" style="font-family: var(--font-family-heading); color: #f4f2ed;">{{ $newsletter_title ?? 'Newsletter Signup' }}</h5>
                <form action="{{ route('#') }}" method="POST">
                    @csrf
                    <div class="input-group">
                        <input type="email" name="email" class="form-control" placeholder="Your Email" aria-label="Your Email" required>
                        <button class="btn" type="submit" style="background-color: #f4f2ed; color: var(--color-primary); border: none;">Subscribe</button>
                    </div>
                </form>
            </div>
        </div>

        <hr class="mt-4" style="border-color: rgba(255, 255, 255, 0.2);">
        <p class="text-center small mb-0 mt-3 text-white-50">
            {!! page_content('global.footer.copyright', '&copy; 2025 Estate Realty. All Rights Reserved.') !!}
            @if(setting('site_terms'))
                <a href="{{ setting('site_terms') }}" class="text-white-50 ms-3">Terms</a>
            @endif
            @if(setting('site_privacy'))
                <a href="{{ setting('site_privacy') }}" class="text-white-50 ms-2">Privacy</a>
            @endif
        </p>
    </div>
</footer>