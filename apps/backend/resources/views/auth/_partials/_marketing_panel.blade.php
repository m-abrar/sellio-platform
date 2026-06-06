@php
    $icon = $icon ?? 'bi-rocket-takeoff';
    $titleHtml = $titleHtml ?? '';
    $description = $description ?? '';
    $glowClass = $glowClass ?? 'auth-glow-tl';
    $features = $features ?? [];
@endphp

<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow {{ $glowClass }}"></div>

    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="auth-marketing-icon glass-surface border-0 shadow-deep">
                <i class="bi {{ $icon }} text-primary-color display-5"></i>
            </div>
        </div>

        <h1 class="display-4 fw-800 mb-4 lh-sm">{!! $titleHtml !!}</h1>

        @if($description)
            <p class="lead opacity-80 mb-5 fs-5 fw-medium">{{ $description }}</p>
        @endif

        @if(count($features) > 0)
            <div class="vstack gap-4 mt-2">
                @foreach($features as $feature)
                    <div class="d-flex align-items-center gap-4">
                        <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                            <i class="bi {{ $feature['icon'] ?? 'bi-check-circle' }} fs-4"></i>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">{{ $feature['title'] }}</h5>
                            @if(!empty($feature['text']))
                                <p class="small opacity-60 mb-0">{{ $feature['text'] }}</p>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">
            &copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}
        </p>
    </div>
</div>
