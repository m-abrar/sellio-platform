@props([
    'variant' => 'default',
    'withAlerts' => true,
])

<div {{ $attributes->merge(['class' => 'detail-page detail-page--' . $variant]) }}>
    <div class="detail-page__inner">
        @isset($breadcrumbs)
            <div class="detail-page__breadcrumbs">
                {{ $breadcrumbs }}
            </div>
        @endisset

        @if($withAlerts)
            @include('frontend._partials._alerts')
        @endif

        <div class="detail-page__grid">
            <main class="detail-page__main">
                {{ $main ?? $slot }}
            </main>

            @isset($sidebar)
                <aside class="detail-page__sidebar">
                    <div class="detail-page__sidebar-stack">
                        {{ $sidebar }}
                    </div>
                </aside>
            @endisset
        </div>

        @isset($related)
            <section class="detail-page__related">
                {{ $related }}
            </section>
        @endisset
    </div>
</div>
