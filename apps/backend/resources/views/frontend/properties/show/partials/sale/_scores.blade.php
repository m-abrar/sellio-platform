@php
    $scoresCount = $property->scores->count();
    $normalizedTotal = 0;
    foreach($property->scores as $s) {
        $normalizedTotal += ($s->score <= 10) ? ($s->score * 10) : $s->score;
    }
    $totalScoreValue = $scoresCount > 0 ? ($normalizedTotal / $scoresCount) : 0;
    $isTotalHigh = $totalScoreValue >= 75;
@endphp

@unless($hideHeading ?? false)
<h6 class="fw-bold mb-4 text-primary">
    <i class="bi bi-bicycle me-2"></i>{{ __('Lifestyle & Accessibility') }}
</h6>
@endunless

@if ($scoresCount > 0)
    {{-- Featured Total Score Card --}}
    <div class="livability-score-summary bg-primary p-4 mb-4 position-relative overflow-hidden rounded-4">
        
        <div class="row align-items-center position-relative z-1">
            <div class="col-auto">
                <div class="livability-score-ring d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg">
                    <div class="text-center">
                        <h2 class="livability-score-value fw-800 text-primary-dark mb-0 lh-1">
                            {{ number_format($totalScoreValue, 0) }}
                        </h2>
                        <div class="livability-score-scale text-muted fw-bold">/100</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <h5 class="text-white fw-800 mb-1">{{ __('Livability Index') }}</h5>
                <p class="text-white text-opacity-75 small mb-0 fw-semibold tracking-wider text-uppercase">
                    {{ $isTotalHigh ? __('Highly Accessible Living') : __('Standard Local Lifestyle') }}
                </p>
            </div>
        </div>
    </div>

    {{-- Individual Score Grid --}}
    <div class="row g-3">
        @foreach ($property->scores as $score)
            @php
                $scale = ($score->score <= 10) ? 10 : 100;
                $isHigh = ($scale == 100) ? ($score->score >= 70) : ($score->score >= 7);
                $glowColor = $isHigh ? 'rgba(25, 135, 84, 0.15)' : 'rgba(111, 66, 193, 0.1)';
            @endphp
            <div class="col-6 col-md-4 col-lg-3">
                <div class="score-card text-center h-100 d-flex flex-column justify-content-center p-3">
                    
                    <div class="score-card__ring mx-auto mb-2 d-flex align-items-center justify-content-center" style="--score-glow: {{ $glowColor }};">
                        <div class="lh-1">
                            <span class="score-card__value fw-800 text-primary-dark">
                                {{ number_format($score->score, ($scale == 10 ? 1 : 0)) }}
                            </span>
                            <span class="score-card__scale text-muted fw-bold d-block">
                                /{{ $scale }}
                            </span>
                        </div>
                    </div>
                    
                    <p class="score-card__title small fw-bold text-dark mb-1 text-uppercase tracking-wider">
                        {{ $score->title }}
                    </p>
                    
                    <span class="score-card__badge badge rounded-2 {{ $isHigh ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary' }} tiny fw-semibold">
                        {{ $score->description ?? ($isHigh ? __('Excellent') : __('Good')) }}
                    </span>
                </div>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted small">{{ __('No scores available.') }}</p>
@endif
