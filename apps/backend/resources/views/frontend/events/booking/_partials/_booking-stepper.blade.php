@php
    $step = $step ?? 1;
    $confirmIcon = $confirmIcon ?? 'bi-star-fill';
    $confirmLabelClass = $confirmLabelClass ?? 'text-primary';

    $steps = [
        1 => __('Tickets'),
        2 => __('Payment'),
        3 => __('Confirm'),
    ];
@endphp

<ol class="stepper mx-auto mb-5" aria-label="{{ __('Booking progress') }}">
    @foreach($steps as $number => $label)
        @php
            $isDone = $step > $number;
            $isActive = $step === $number;
            $stateClass = $isDone ? 'done' : ($isActive ? 'active' : '');
            $labelClass = $isDone
                ? 'fw-bold text-success'
                : ($isActive && $number === 3 ? 'fw-800 ' . $confirmLabelClass : ($isActive ? 'fw-800 text-primary' : 'fw-bold text-muted'));
        @endphp

        <li class="step {{ $stateClass }}" @if($isActive) aria-current="step" @endif>
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
        </li>
    @endforeach
</ol>
