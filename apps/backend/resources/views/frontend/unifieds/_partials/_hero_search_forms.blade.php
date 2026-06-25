@foreach(($publicModules ?? collect())->take(8) as $module)
<div class="tab-pane fade"
     id="hero-search-{{ $module['id'] }}"
     data-hero-pane
     role="tabpanel"
     aria-labelledby="{{ $module['id'] }}-tab"
     hidden>

    {{-- ── PROPERTIES ────────────────────────────────────────────── --}}
    @if($module['id'] === 'properties')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-search hsf-icon" aria-hidden="true"></i>
                <input type="text" name="q" class="hsf-input"
                       placeholder="{{ __('Address, city, or ZIP code…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Search') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($propertyLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($propertyLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="property_type" class="hsf-filter-select">
                <option value="">{{ __('Buy or Rent') }}</option>
                <option value="sale">{{ __('For Sale') }}</option>
                <option value="rental">{{ __('For Rent') }}</option>
            </select>
            @if(($propertyCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('Any Type') }}</option>
                @foreach($propertyCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                   placeholder="{{ __('Max price') }}" min="0" step="1000">
        </div>
    </form>

    {{-- ── AUTOS ─────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'autos')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-car-front-fill hsf-icon" aria-hidden="true"></i>
                <input type="text" name="make" class="hsf-input"
                       placeholder="{{ __('Make, brand, or model…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Find Cars') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($autoLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($autoLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($autoCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('Any Category') }}</option>
                @foreach($autoCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="type" class="hsf-filter-select">
                <option value="">{{ __('Selling or Lease') }}</option>
                <option value="selling">{{ __('For Sale') }}</option>
                <option value="lease">{{ __('Lease') }}</option>
            </select>
            <select name="transmission" class="hsf-filter-select">
                <option value="">{{ __('Any Transmission') }}</option>
                <option value="Automatic">{{ __('Automatic') }}</option>
                <option value="Manual">{{ __('Manual') }}</option>
            </select>
        </div>
    </form>

    {{-- ── PRODUCTS ──────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'products')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-bag-check-fill hsf-icon" aria-hidden="true"></i>
                <input type="text" name="q" class="hsf-input"
                       placeholder="{{ __('Products, brands, or categories…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-bag me-1"></i>{{ __('Shop') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($productCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($productCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($productLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($productLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── SERVICES ──────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'services')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-tools hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('What service do you need?') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Find Pros') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($serviceLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($serviceLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($serviceCategories ?? collect())->isNotEmpty())
            <select name="category_id" class="hsf-filter-select">
                <option value="">{{ __('All Service Types') }}</option>
                @foreach($serviceCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min price') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max price') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── JOBS ──────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'jobs')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-briefcase hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Job title or company…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-briefcase me-1"></i>{{ __('Find Jobs') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($jobLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($jobLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="workplace_type" class="hsf-filter-select">
                <option value="">{{ __('Work Type') }}</option>
                <option value="remote">{{ __('Remote') }}</option>
                <option value="hybrid">{{ __('Hybrid') }}</option>
                <option value="on-site">{{ __('On-site') }}</option>
            </select>
            @if(($jobCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($jobCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
        </div>
    </form>

    {{-- ── EVENTS ────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'events')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-calendar-event hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Events, workshops, or venues…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-calendar-event me-1"></i>{{ __('Find Events') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($eventLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($eventLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($eventCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Types') }}</option>
                @foreach($eventCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <input type="date" name="date" class="hsf-filter-select hsf-date-input"
                   min="{{ now()->format('Y-m-d') }}"
                   title="{{ __('Event date') }}">
        </div>
    </form>

    {{-- ── CLASSIFIEDS ───────────────────────────────────────────── --}}
    @elseif($module['id'] === 'classifieds')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-tag hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Electronics, furniture, cameras…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Browse') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($classifiedLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($classifiedLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($classifiedCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($classifiedCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── BLOGS ─────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'blogs')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-journal-text hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Articles, guides, and updates…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-book me-1"></i>{{ __('Read') }}
            </button>
        </div>
        @if(($blogCategories ?? collect())->isNotEmpty())
        <div class="hsf-filters-row">
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Topics') }}</option>
                @foreach($blogCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            <select name="sort" class="hsf-filter-select">
                <option value="">{{ __('Sort by') }}</option>
                <option value="latest">{{ __('Latest') }}</option>
                <option value="popular">{{ __('Most Popular') }}</option>
            </select>
        </div>
        @endif
    </form>

    {{-- ── FALLBACK ──────────────────────────────────────────────── --}}
    @else
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-search hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Search…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">{{ __('Search') }}</button>
        </div>
    </form>
    @endif

</div>
@endforeach

{{-- ── AI NATURAL LANGUAGE SEARCH PANE ─────────────────────────────── --}}
<div class="tab-pane fade show active"
     id="hero-search-ai"
     data-hero-pane
     role="tabpanel"
     aria-labelledby="ai-search-tab">

    <div class="hero-ai-search">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap hsf-input-wrap--with-mic">
                <i class="bi bi-chat-text hsf-icon" aria-hidden="true"></i>
                <input type="text"
                       id="ai-nl-input"
                       class="hsf-input hsf-input--ai"
                       placeholder="{{ __('3-bedroom house near downtown under $500k with a pool…') }}"
                       autocomplete="off"
                       data-ai-input>
                <button type="button" class="ai-mic-btn" data-ai-mic
                        aria-label="{{ __('Search by voice') }}" title="{{ __('Search by voice') }}">
                    <i class="bi bi-mic-fill" aria-hidden="true"></i>
                </button>
            </div>
            <button type="button" class="hsf-submit-btn hsf-submit-btn--ai" data-ai-submit>
                <span class="ai-btn-idle">
                    <i class="bi bi-stars me-1" aria-hidden="true"></i>{{ __('Search') }}
                </span>
                <span class="ai-btn-busy" hidden>
                    <span class="ai-spinner" aria-hidden="true"></span>
                    {{ __('Searching…') }}
                </span>
            </button>
        </div>

        {{-- Thinking loader (shown during fetch) --}}
        <div class="ai-thinking-panel" data-ai-thinking hidden>
            <span class="ai-thinking-dot"></span>
            <span class="ai-thinking-dot"></span>
            <span class="ai-thinking-dot"></span>
            <span class="ai-thinking-label">{{ __('Understanding your search…') }}</span>
        </div>

        {{-- Summary panel (shown after response, before redirect) --}}
        <div class="ai-summary-panel" data-ai-summary hidden>
            <div class="ai-summary-body">
                <i class="bi bi-stars ai-summary-icon" aria-hidden="true"></i>
                <div class="ai-summary-content">
                    <span class="ai-summary-module" data-ai-module-badge></span>
                    <p class="ai-summary-sentence" data-ai-summary-text aria-live="polite"></p>
                </div>
                <button type="button" class="ai-go-now-btn" data-ai-go title="{{ __('Go now') }}">
                    <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
            <div class="ai-redirect-track">
                <div class="ai-redirect-bar" data-ai-redirect-bar></div>
            </div>
            <p class="ai-redirect-label">{{ __('Taking you to results…') }}</p>
        </div>

        <p class="ai-search-hint">
            <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
            {{ __('Describe what you\'re looking for in plain language — AI will parse it into structured filters.') }}
        </p>
    </div>

</div>

@once
@push('scripts')
<script>
(function () {
    var CSRF = document.querySelector('meta[name="csrf-token"]')
                ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                : '';

    function initAiSearch() {
        var pane = document.getElementById('hero-search-ai');
        if (!pane) return;

        var input       = pane.querySelector('[data-ai-input]');
        var submitBtn   = pane.querySelector('[data-ai-submit]');
        var idleSpan    = submitBtn.querySelector('.ai-btn-idle');
        var busySpan    = submitBtn.querySelector('.ai-btn-busy');
        var thinkingEl  = pane.querySelector('[data-ai-thinking]');
        var summaryEl   = pane.querySelector('[data-ai-summary]');
        var moduleBadge = pane.querySelector('[data-ai-module-badge]');
        var summaryText = pane.querySelector('[data-ai-summary-text]');
        var redirectBar = pane.querySelector('[data-ai-redirect-bar]');
        var goNowBtn    = pane.querySelector('[data-ai-go]');
        var micBtn      = pane.querySelector('[data-ai-mic]');

        var lastParsed    = null;
        var redirectTimer = null;

        // ── Cycling placeholder ──────────────────────────────────────────
        var examples = [
            '{{ __("3-bedroom house near downtown under $500k with a pool…") }}',
            '{{ __("part-time remote marketing job, flexible hours…") }}',
            '{{ __("used SUV under $20k, automatic, low mileage…") }}',
            '{{ __("weekend cooking class near me, beginner friendly…") }}',
            '{{ __("plumber available this week for urgent bathroom repair…") }}',
            '{{ __("1-bedroom apartment for rent under $1,200/month…") }}',
            '{{ __("graphic designer for logo, $500 budget, fast turnaround…") }}',
        ];
        var exIdx = 0, typeTimer = null, waitTimer = null;

        function stopCycling() {
            clearInterval(typeTimer);
            clearTimeout(waitTimer);
        }

        function typeIn(text) {
            var i = 0;
            input.placeholder = '';
            typeTimer = setInterval(function () {
                input.placeholder = text.slice(0, ++i);
                if (i >= text.length) {
                    clearInterval(typeTimer);
                    waitTimer = setTimeout(function () { eraseOut(text); }, 2600);
                }
            }, 38);
        }

        function eraseOut(text) {
            var len = text.length;
            typeTimer = setInterval(function () {
                input.placeholder = text.slice(0, --len);
                if (len <= 0) {
                    clearInterval(typeTimer);
                    exIdx = (exIdx + 1) % examples.length;
                    waitTimer = setTimeout(function () { typeIn(examples[exIdx]); }, 350);
                }
            }, 18);
        }

        function startCycling() {
            if (input.value || document.activeElement === input) return;
            stopCycling();
            waitTimer = setTimeout(function () { typeIn(examples[exIdx]); }, 500);
        }

        input.addEventListener('focus', stopCycling);
        input.addEventListener('blur',  function () { if (!input.value.trim()) startCycling(); });
        setTimeout(startCycling, 900);

        // ── Run search ───────────────────────────────────────────────────
        var MODULE_LABELS = {
            properties: '{{ __("Properties") }}',
            autos:      '{{ __("Autos") }}',
            events:     '{{ __("Events") }}',
            services:   '{{ __("Services") }}',
            classifieds:'{{ __("Classifieds") }}',
            jobs:       '{{ __("Jobs") }}',
            products:   '{{ __("Products") }}',
            blogs:      '{{ __("Blogs") }}',
        };

        function cancelRedirect() {
            clearTimeout(redirectTimer);
            if (redirectBar) { redirectBar.style.transition = 'none'; redirectBar.style.width = '0%'; }
        }

        function startRedirect(url) {
            if (!url) return;
            var DELAY = 2200;
            if (redirectBar) {
                redirectBar.style.transition = 'none';
                redirectBar.style.width = '0%';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        redirectBar.style.transition = 'width ' + DELAY + 'ms linear';
                        redirectBar.style.width = '100%';
                    });
                });
            }
            redirectTimer = setTimeout(function () { window.location.href = url; }, DELAY);
        }

        function showSummary(data) {
            var label = MODULE_LABELS[data.module] || data.module;
            moduleBadge.textContent = label;
            moduleBadge.className   = 'ai-summary-module ai-summary-module--' + data.module;
            summaryText.textContent = data.summary || '{{ __("Search parsed successfully.") }}';
            summaryEl.hidden = false;
            goNowBtn.disabled = !data.redirect_url;
            startRedirect(data.redirect_url);
        }

        function showError(msg) {
            moduleBadge.textContent = '{{ __("Error") }}';
            moduleBadge.className   = 'ai-summary-module ai-summary-module--error';
            summaryText.textContent = msg || '{{ __("Something went wrong. Please try again.") }}';
            summaryEl.hidden = false;
            goNowBtn.disabled = true;
        }

        function run() {
            var q = (input.value || '').trim();
            if (!q) { input.focus(); return; }

            cancelRedirect();
            idleSpan.hidden    = true;
            busySpan.hidden    = false;
            submitBtn.disabled = true;
            thinkingEl.hidden  = false;
            summaryEl.hidden   = true;

            fetch('{{ route("smart-search.parse") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': CSRF,
                },
                body: JSON.stringify({ q: q }),
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.error) throw new Error(data.error);
                lastParsed = data;
                showSummary(data);
            })
            .catch(function (err) {
                showError(err.message);
            })
            .finally(function () {
                thinkingEl.hidden  = false;
                idleSpan.hidden    = false;
                busySpan.hidden    = true;
                submitBtn.disabled = false;
                thinkingEl.hidden  = true;
            });
        }

        submitBtn.addEventListener('click', run);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); run(); }
        });

        if (goNowBtn) {
            goNowBtn.addEventListener('click', function () {
                if (lastParsed && lastParsed.redirect_url) {
                    cancelRedirect();
                    window.location.href = lastParsed.redirect_url;
                }
            });
        }

        // ── Voice search ─────────────────────────────────────────────────
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { if (micBtn) micBtn.hidden = true; return; }

        var recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = document.documentElement.lang || 'en-US';
        var isListening = false;

        micBtn.addEventListener('click', function () {
            if (isListening) { recognition.stop(); return; }
            try { recognition.start(); } catch (e) {}
        });

        recognition.onstart = function () {
            isListening = true;
            stopCycling();
            micBtn.classList.add('ai-mic-btn--listening');
            micBtn.setAttribute('aria-label', '{{ __("Listening… click to stop") }}');
            input.value = '';
            input.placeholder = '{{ __("Listening…") }}';
        };

        recognition.onresult = function (event) {
            var transcript = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            input.value = transcript;
        };

        recognition.onend = function () {
            isListening = false;
            micBtn.classList.remove('ai-mic-btn--listening');
            micBtn.setAttribute('aria-label', '{{ __("Search by voice") }}');
            var val = (input.value || '').trim();
            if (val) { run(); } else { startCycling(); }
        };

        recognition.onerror = function () {
            isListening = false;
            micBtn.classList.remove('ai-mic-btn--listening');
            micBtn.setAttribute('aria-label', '{{ __("Search by voice") }}');
            startCycling();
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAiSearch);
    } else {
        initAiSearch();
    }
})();
</script>
@endpush
@endonce
