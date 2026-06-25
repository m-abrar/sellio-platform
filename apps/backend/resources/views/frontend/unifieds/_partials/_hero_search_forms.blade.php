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

        <div class="ai-result-panel" data-ai-result hidden>
            <div class="ai-result-header">
                <span class="ai-result-label">
                    <i class="bi bi-braces me-1" aria-hidden="true"></i>{{ __('Parsed Query') }}
                </span>
                <div class="ai-result-actions">
                    <button type="button" class="ai-action-btn" data-ai-copy title="{{ __('Copy JSON') }}">
                        <i class="bi bi-clipboard" aria-hidden="true"></i>
                        <span>{{ __('Copy') }}</span>
                    </button>
                    <button type="button" class="ai-action-btn ai-action-btn--primary" data-ai-apply
                            title="{{ __('Backend integration coming soon') }}">
                        {{ __('Apply Filters') }}
                        <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <pre class="ai-json-output" data-ai-json aria-live="polite"></pre>
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
    function parseNL(q) {
        var lq = q.toLowerCase();
        var result = { module: null, filters: {}, confidence: 0 };

        if (/house|apartment|condo|villa|studio|bedroom|property|rent|buy|home/.test(lq)) {
            result.module = 'properties';
        } else if (/car|auto|vehicle|truck|suv|van|sedan|motorbike|bike/.test(lq)) {
            result.module = 'autos';
        } else if (/job|work|hire|career|position|salary|employment/.test(lq)) {
            result.module = 'jobs';
        } else if (/event|concert|festival|workshop|conference|seminar/.test(lq)) {
            result.module = 'events';
        } else if (/service|plumber|cleaner|repair|fix|contractor|handyman/.test(lq)) {
            result.module = 'services';
        } else {
            result.module = 'classifieds';
        }

        var bedroomM = lq.match(/(\d+)[- ]?bed/);
        if (bedroomM) result.filters.bedrooms = parseInt(bedroomM[1], 10);

        var priceM = lq.match(/\$\s?(\d[\d,]*)\s*k/i) || lq.match(/under\s+\$?\s?(\d[\d,]*)\s*(k)?/i);
        if (priceM) {
            var n = parseInt(priceM[1].replace(/,/g, ''), 10);
            if ((priceM[2] || '').toLowerCase() === 'k' || /\$\s?\d+k/i.test(lq)) n *= 1000;
            result.filters.max_price = n;
        }

        if (/\brent\b|\brental\b|\blease\b/.test(lq)) result.filters.listing_type = 'rental';
        else if (/\bbuy\b|\bfor sale\b|\bpurchase\b/.test(lq))  result.filters.listing_type = 'sale';

        var locM = lq.match(/(?:near|in|around|at)\s+([a-z][a-z\s]{1,30}?)(?:\s+under|\s+with|\s+for|\s+max|\s+bed|\s*$)/);
        if (locM) result.filters.location = locM[1].trim();

        var amenities = [];
        if (/\bpool\b/.test(lq))           amenities.push('pool');
        if (/\bgarage\b/.test(lq))         amenities.push('garage');
        if (/\bgarden\b|\byard\b/.test(lq)) amenities.push('garden');
        if (/\bparking\b/.test(lq))        amenities.push('parking');
        if (/\bbalcony\b/.test(lq))        amenities.push('balcony');
        if (amenities.length) result.filters.amenities = amenities;

        if (/\bhouse\b|\bvilla\b/.test(lq))   result.filters.property_type = 'house';
        else if (/\bapartment\b/.test(lq))    result.filters.property_type = 'apartment';
        else if (/\bcondo\b/.test(lq))        result.filters.property_type = 'condo';
        else if (/\bstudio\b/.test(lq))       result.filters.property_type = 'studio';

        var matched = Object.keys(result.filters).length;
        result.confidence = Math.min(0.98, Math.round((0.55 + matched * 0.07) * 100) / 100);

        return result;
    }

    function syntaxHL(json) {
        return json
            .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="aj-key">$1</span>$2')
            .replace(/(:\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="aj-str">$2</span>')
            .replace(/(:\s*)(\d+(?:\.\d+)?)/g,     '$1<span class="aj-num">$2</span>')
            .replace(/(:\s*)(true|false|null)/g,    '$1<span class="aj-kw">$2</span>')
            .replace(/(\[)(\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*)(\])/g, function(_, open, inner, close) {
                return open + inner.replace(/"([^"]*)"/g, '<span class="aj-str">"$1"</span>') + close;
            });
    }

    function initAiSearch() {
        var pane = document.getElementById('hero-search-ai');
        if (!pane) return;

        var input     = pane.querySelector('[data-ai-input]');
        var submitBtn = pane.querySelector('[data-ai-submit]');
        var idleSpan  = submitBtn.querySelector('.ai-btn-idle');
        var busySpan  = submitBtn.querySelector('.ai-btn-busy');
        var resultEl  = pane.querySelector('[data-ai-result]');
        var jsonEl    = pane.querySelector('[data-ai-json]');
        var copyBtn   = pane.querySelector('[data-ai-copy]');
        var applyBtn  = pane.querySelector('[data-ai-apply]');
        var micBtn    = pane.querySelector('[data-ai-mic]');

        var lastParsed = null;

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
        function run() {
            var q = (input.value || '').trim();
            if (!q) { input.focus(); return; }

            idleSpan.hidden = true;
            busySpan.hidden = false;
            submitBtn.disabled = true;

            setTimeout(function () {
                lastParsed = parseNL(q);
                var pretty = JSON.stringify(lastParsed, null, 2);
                jsonEl.innerHTML = syntaxHL(pretty);
                resultEl.hidden = false;
                idleSpan.hidden = false;
                busySpan.hidden = true;
                submitBtn.disabled = false;
            }, 1300);
        }

        submitBtn.addEventListener('click', run);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); run(); }
        });

        copyBtn.addEventListener('click', function () {
            if (!lastParsed) return;
            navigator.clipboard.writeText(JSON.stringify(lastParsed, null, 2)).then(function () {
                var icon = copyBtn.querySelector('i');
                var label = copyBtn.querySelector('span');
                icon.className = 'bi bi-clipboard-check';
                label.textContent = '{{ __("Copied!") }}';
                setTimeout(function () {
                    icon.className = 'bi bi-clipboard';
                    label.textContent = '{{ __("Copy") }}';
                }, 1800);
            });
        });

        applyBtn.addEventListener('click', function () {
            applyBtn.textContent = '{{ __("Coming soon…") }}';
            setTimeout(function () {
                applyBtn.innerHTML = '{{ __("Apply Filters") }} <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>';
            }, 1800);
        });

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
