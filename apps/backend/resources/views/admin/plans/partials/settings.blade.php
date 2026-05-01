<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom fw-bold">
        <h3 class="card-title text-dark">Pricing Display Options</h3>
    </div>
    <div class="card-body">
        <div class="row g-3">
            @php
                $displaySwitches = [
                    ['name' => 'is_featured', 'id' => 'featuredSwitch', 'label' => 'Featured on Pricing', 'value' => 1, 'checked' => $plan->exists && $plan->is_featured],
                    ['name' => 'is_popular', 'id' => 'popularSwitch', 'label' => 'Popular Plan Tag', 'value' => 1, 'checked' => $plan->exists && $plan->is_popular],
                ];
            @endphp

            @foreach ($displaySwitches as $switch)
                <div class="col-md-6 mb-3">
                    <label class="w-100 cursor-pointer">
                        <input type="hidden" name="{{ $switch['name'] }}" value="0">
                        <input type="checkbox" name="{{ $switch['name'] }}" value="{{ $switch['value'] }}"
                               id="{{ $switch['id'] }}"
                               class="d-none toggle-input"
                               {{ $switch['checked'] ? 'checked' : '' }}>

                        <div class="border rounded px-4 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
                            <div>
                                <div class="fw-semibold mb-1 text-dark small font-weight-bold">{{ $switch['label'] }}</div>
                                <div class="small toggle-status text-muted">
                                    {{ $switch['checked'] ? 'Enabled' : 'Disabled' }}
                                </div>
                            </div>
                            <div class="toggle-indicator"></div>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
    </div>
</div>
