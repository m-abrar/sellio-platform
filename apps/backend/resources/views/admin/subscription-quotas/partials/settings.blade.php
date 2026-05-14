{{--
    Administrative Financial Partial: Entitlement Configuration
    
    This component provides the interface for managing subscription-level 
    operational flags. It orchestrates the configuration of active 
    statuses, featured entitlements, trial availabilities, and 
    marketing visibility (popular plan), ensuring precise administrative 
    control over service tier behaviors.
    
    @context Financial Management
    @variables Plan $plan The plan model instance.
--}}

<div class="card shadow-sm rounded-3">
    <div class="card-header border-bottom fw-bold">
        <h3 class="card-title">{{ __('Plan Settings') }}</h3>
    </div>
    <div class="card-body">

        <div class="mb-4">
            <div class="row row-cols-1 row-cols-md-2 g-3">
                @php
                    $switches = [
                        ['name' => 'status', 'id' => 'statusSwitch', 'label' => __('Active'), 'value' => 1, 'checked' => $plan->exists && $plan->status],
                        ['name' => 'is_featured', 'id' => 'featuredSwitch', 'label' => __('Featured'), 'value' => 1, 'checked' => $plan->exists && $plan->is_featured],
                        ['name' => 'trial_available', 'id' => 'trialSwitch', 'label' => __('Trial Available'), 'value' => 1, 'checked' => $plan->exists && $plan->trial_available],
                        ['name' => 'is_popular', 'id' => 'popularSwitch', 'label' => __('Popular Plan'), 'value' => 1, 'checked' => $plan->exists && $plan->is_popular],
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
                                        {{ $switch['checked'] ? __('Enabled') : __('Disabled') }}
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
