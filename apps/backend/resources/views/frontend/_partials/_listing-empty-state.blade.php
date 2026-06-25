@php
    $icon        = $icon        ?? 'bi-search';
    $title       = $title       ?? __('No Results Found');
    $description = $description ?? __('We couldn\'t find anything matching your search. A few tweaks might do the trick.');
    $route       = $route       ?? url()->current();
    $label       = $label       ?? __('Clear All Filters');
    $quickLinks  = $quickLinks  ?? [];   // ['Label' => url] pairs for vertical-specific shortcuts
@endphp

<div class="les-col-full">
    <div class="les-card">

        {{-- ── Top: icon + copy + CTAs ─────────────────────────────── --}}
        <div class="les-hero">
            <div class="les-icon-circle">
                <i class="bi {{ $icon }}" aria-hidden="true"></i>
            </div>
            <div class="les-hero-text">
                <h3 class="les-title">{{ $title }}</h3>
                <p class="les-description">{{ $description }}</p>
                <div class="les-actions">
                    <a href="{{ $route }}" class="btn btn-primary-theme">
                        <i class="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>{{ $label }}
                    </a>
                    <a href="{{ route('index') }}" class="btn btn-outline-secondary">
                        <i class="bi bi-house me-2" aria-hidden="true"></i>{{ __('Back to Home') }}
                    </a>
                </div>
            </div>
        </div>

        {{-- ── Bottom: two columns ─────────────────────────────────── --}}
        <div class="les-bottom">

            {{-- Recent searches (JS populated) --}}
            <div class="les-panel" id="les-recents-panel" hidden>
                <p class="les-panel-label">
                    <i class="bi bi-clock-history me-2" aria-hidden="true"></i>{{ __('Your Recent Searches') }}
                </p>
                <div class="les-chips" id="les-recents-chips"></div>
                <button type="button" class="les-clear-btn" id="les-recents-clear">{{ __('Clear history') }}</button>
            </div>

            {{-- Tips --}}
            <div class="les-panel">
                <p class="les-panel-label">
                    <i class="bi bi-lightbulb me-2 text-warning" aria-hidden="true"></i>{{ __('Suggestions') }}
                </p>
                <ul class="les-tips-list">
                    <li>{{ __('Remove one or more active filters') }}</li>
                    <li>{{ __('Try a broader keyword or different location') }}</li>
                    <li>{{ __('Check for spelling mistakes') }}</li>
                    <li>{{ __('Use fewer words to widen your results') }}</li>
                </ul>

                @if(count($quickLinks))
                <div class="les-quick-links mt-3">
                    <p class="les-panel-label mb-2">{{ __('Browse by category') }}</p>
                    <div class="d-flex flex-wrap gap-2">
                        @foreach($quickLinks as $qlLabel => $qlUrl)
                            <a href="{{ $qlUrl }}" class="les-quick-chip">{{ $qlLabel }}</a>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>

        </div>

        {{-- ── AI nudge banner ─────────────────────────────────────── --}}
        @if(Route::has('smart-search.parse'))
        <div class="les-ai-nudge">
            <i class="bi bi-stars me-2" aria-hidden="true"></i>
            {!! __('Still stuck? Try <a href=":url" class="les-ai-link">AI Smart Search</a> — describe what you\'re looking for in plain language and we\'ll find it.', ['url' => url('/') . '#ai-search-tab']) !!}
        </div>
        @endif

    </div>
</div>

@once
@push('js')
<script>
(function () {
    var panel     = document.getElementById('les-recents-panel');
    var chipsWrap = document.getElementById('les-recents-chips');
    var clearBtn  = document.getElementById('les-recents-clear');
    if (!panel || !chipsWrap) return;

    var RECENTS_URL   = '{{ Route::has("smart-search.recents") ? route("smart-search.recents") : "" }}';
    var RECENTS_CLEAR = '{{ Route::has("smart-search.recents.clear") ? route("smart-search.recents.clear") : "" }}';
    var CSRF          = document.querySelector('meta[name="csrf-token"]')?.content || '';

    function load() {
        if (!RECENTS_URL) return;
        fetch(RECENTS_URL, { headers: { Accept: 'application/json' } })
            .then(function (r) { return r.json(); })
            .then(function (items) {
                if (!items || !items.length) return;
                chipsWrap.innerHTML = '';
                items.forEach(function (q) {
                    var chip = document.createElement('a');
                    chip.className   = 'les-recent-chip';
                    chip.textContent = q;
                    chip.href        = '{{ url("/") }}#ai-search-tab';
                    chip.addEventListener('click', function (e) {
                        e.preventDefault();
                        var input = document.getElementById('ai-nl-input');
                        if (input) {
                            input.value = q;
                            var submitBtn = document.querySelector('[data-ai-submit]');
                            if (submitBtn) submitBtn.click();
                        } else {
                            window.location.href = '{{ url("/") }}#ai-search-tab';
                        }
                    });
                    chipsWrap.appendChild(chip);
                });
                panel.hidden = false;
            })
            .catch(function () {});
    }

    if (clearBtn && RECENTS_CLEAR) {
        clearBtn.addEventListener('click', function () {
            fetch(RECENTS_CLEAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': CSRF },
                body: JSON.stringify({}),
            }).then(function () {
                panel.hidden     = true;
                chipsWrap.innerHTML = '';
            }).catch(function () {});
        });
    }

    load();
})();
</script>
@endpush
@endonce
