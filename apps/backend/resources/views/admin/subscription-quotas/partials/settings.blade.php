{{-- Plan Settings Toggles --}}

<div class="card shadow-sm rounded-3">
    <div class="card-header border-bottom fw-bold">
        <h3 class="card-title">Plan Settings</h3>
    </div>
    <div class="card-body">

        <div class="mb-4">
            <div class="row row-cols-1 row-cols-md-2 g-3">
                @php
                    $switches = [
                        ['name' => 'status', 'id' => 'statusSwitch', 'label' => 'Active', 'value' => 1, 'checked' => $plan->exists && $plan->status],
                        ['name' => 'is_featured', 'id' => 'featuredSwitch', 'label' => 'Featured', 'value' => 1, 'checked' => $plan->exists && $plan->is_featured],
                        ['name' => 'trial_available', 'id' => 'trialSwitch', 'label' => 'Trial Available', 'value' => 1, 'checked' => $plan->exists && $plan->trial_available],
                        ['name' => 'is_popular', 'id' => 'popularSwitch', 'label' => 'Popular Plan', 'value' => 1, 'checked' => $plan->exists && $plan->is_popular],
                    ];
                @endphp

                @foreach ($switches as $switch)
                    <div class="col">
                        <label class="w-100 cursor-pointer">
                            <input type="checkbox" name="{{ $switch['name'] }}" value="{{ $switch['value'] }}"
                                id="{{ $switch['id'] }}"
                                class="d-none toggle-input"
                                {{ $switch['checked'] ? 'checked' : '' }}>

                            <div class="border rounded-3 px-4 py-3 d-flex justify-content-between align-items-center h-100 toggle-card">
                                <div>
                                    <div class="fw-semibold mb-1 text-dark">{{ $switch['label'] }}</div>
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
</div>

<style>
.toggle-card {
    transition: all 0.3s ease;
    background-color: #f8f9fa;
    position: relative;
}

.toggle-input:checked + .toggle-card {
    background-color: #e9f7ef;
    border-color: #28a745;
}

.toggle-card .toggle-indicator {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background-color: #ccc;
    position: relative;
    transition: all 0.3s ease;
}

.toggle-card .toggle-indicator::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-card .toggle-indicator {
    background-color: #28a745;
}

.toggle-input:checked + .toggle-card .toggle-indicator::after {
    transform: translateX(16px);
}

.toggle-input:checked + .toggle-card .toggle-status {
    color: #28a745;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
