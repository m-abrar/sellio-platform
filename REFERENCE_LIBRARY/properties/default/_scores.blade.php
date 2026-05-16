@php
    $scoresCount = $property->scores->count();
    // We normalize everything to 100 for the average "Total Score"
    $normalizedTotal = 0;
    foreach($property->scores as $s) {
        $normalizedTotal += ($s->score <= 10) ? ($s->score * 10) : $s->score;
    }
    $totalScoreValue = $scoresCount > 0 ? ($normalizedTotal / $scoresCount) : 0;
    $isTotalHigh = $totalScoreValue >= 75;
@endphp

<h6 class="fw-bold mb-4 text-primary-color">
    <i class="bi bi-bicycle me-2"></i>{{ __('Lifestyle & Accessibility') }}
</h6>

@if ($scoresCount > 0)
    {{-- Featured Total Score Card --}}
    <div class="glass-surface p-4 mb-4 border-0 position-relative overflow-hidden shadow-sm" 
         style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
        
        <div class="row align-items-center position-relative z-1">
            <div class="col-auto">
                <div class="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-lg" 
                     style="width: 80px; height: 80px; border: 4px solid rgba(255,255,255,0.3);">
                    <div class="text-center">
                        <h2 class="fw-800 text-primary-dark mb-0 lh-1" style="font-size: 1.6rem;">
                            {{ number_format($totalScoreValue, 0) }}
                        </h2>
                        <div class="text-muted fw-bold" style="font-size: 0.6rem; margin-top: -2px;">/100</div>
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
                // Detect scale: If score is 10 or less, assume scale of 10, otherwise 100
                $scale = ($score->score <= 10) ? 10 : 100;
                $isHigh = ($scale == 100) ? ($score->score >= 70) : ($score->score >= 7);
                $glowColor = $isHigh ? 'rgba(25, 135, 84, 0.15)' : 'rgba(111, 66, 193, 0.1)';
            @endphp
            <div class="col-6 col-md-4">
                <div class="score-card text-center h-100 d-flex flex-column justify-content-center p-3" 
                     style="background: var(--bg-glass-light); border: 1px solid var(--border-color) !important;">
                    
                    <div class="mx-auto mb-2 d-flex align-items-center justify-content-center" 
                         style="width: 55px; height: 55px; border-radius: 50%; border: 2px solid var(--primary-light); background: white; box-shadow: 0 4px 12px {{ $glowColor }};">
                        <div class="lh-1">
                            <span class="fw-800 text-primary-dark" style="font-size: 1.1rem;">
                                {{ number_format($score->score, ($scale == 10 ? 1 : 0)) }}
                            </span>
                            <span class="text-muted fw-bold d-block" style="font-size: 0.55rem; margin-top: -2px;">
                                /{{ $scale }}
                            </span>
                        </div>
                    </div>
                    
                    <p class="small fw-bold text-dark mb-1 text-uppercase tracking-wider" style="font-size: 0.6rem;">
                        {{ $score->title }}
                    </p>
                    
                    <span class="badge rounded-pill {{ $isHigh ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary' }} tiny fw-bold" style="font-size: 0.55rem;">
                        {{ $score->description ?? ($isHigh ? 'Excellent' : 'Good') }}
                    </span>
                </div>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted small">No scores available.</p>
@endif