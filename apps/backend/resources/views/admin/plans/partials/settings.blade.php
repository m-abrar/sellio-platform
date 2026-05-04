<div class="card card-premium mb-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-eye mr-2 text-primary opacity-50"></i> Display Parameters
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="row g-4">
            @php
                $displaySwitches = [
                    ['name' => 'is_featured', 'id' => 'featuredSwitch', 'label' => 'FEATURED STATUS', 'desc' => 'Highlight on main pricing grid', 'value' => 1, 'checked' => $plan->exists && $plan->is_featured],
                    ['name' => 'is_popular', 'id' => 'popularSwitch', 'label' => 'POPULAR MARKER', 'desc' => 'Badge as most selected choice', 'value' => 1, 'checked' => $plan->exists && $plan->is_popular],
                ];
            @endphp

            @foreach ($displaySwitches as $switch)
                <div class="col-md-6 mb-0">
                    <label class="w-100 cursor-pointer mb-0">
                        <input type="hidden" name="{{ $switch['name'] }}" value="0">
                        <input type="checkbox" name="{{ $switch['name'] }}" value="{{ $switch['value'] }}"
                               id="{{ $switch['id'] }}"
                               class="d-none toggle-input"
                               {{ $switch['checked'] ? 'checked' : '' }}>

                        <div class="d-flex justify-content-between align-items-center toggle-card shadow-sm border p-3" style="border-radius: 15px;">
                            <div>
                                <div class="fw-bold smallest text-dark uppercase letter-spacing-1">{{ $switch['label'] }}</div>
                                <div class="smallest text-muted uppercase">{{ $switch['desc'] }}</div>
                            </div>
                            <div class="toggle-indicator"></div>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
    </div>
</div>
