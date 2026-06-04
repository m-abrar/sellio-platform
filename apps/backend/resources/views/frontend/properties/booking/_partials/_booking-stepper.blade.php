@php
    $step = $step ?? 1;
    $confirmIcon = $confirmIcon ?? 'bi-star-fill';
    $confirmLabelClass = $confirmLabelClass ?? 'text-primary-color';

    $steps = [
        1 => __('Details'),
        2 => __('Payment'),
        3 => __('Confirm'),
    ];
@endphp

<div class="stepper mx-auto mb-5">
    @foreach($steps as $number => $label)
        @php
            $isDone = $step > $number;
            $isActive = $step === $number;
            $stateClass = $isDone ? 'done' : ($isActive ? 'active' : '');
            $labelClass = $isDone
                ? 'fw-bold text-success'
                : ($isActive && $number === 3 ? 'fw-800 ' . $confirmLabelClass : ($isActive ? 'fw-800 text-primary-color' : 'fw-bold text-muted'));
        @endphp

        <div class="step {{ $stateClass }}">
            <div @class(['step-icon', 'shadow-sm' => $isActive && ! $isDone])>
                @if($isDone)
                    <i class="bi bi-check-lg text-white"></i>
                @elseif($isActive && $number === 3)
                    <i class="bi {{ $confirmIcon }}"></i>
                @else
                    {{ $number }}
                @endif
            </div>
            <div class="step-label {{ $labelClass }} uppercase tracking-wider small">{{ $label }}</div>
        </div>
    @endforeach
</div>
