<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">Feature Toggles</h3>
    </div>
    <div class="card-body">
        <div class="row row-cols-1 row-cols-md-2">
            @php
                $toggles = [
                    ['name' => 'auto_renew', 'label' => 'Auto-Renew System', 'checked' => $subscription->auto_renew ?? false, 'desc' => 'Allow recurring billing'],
                    ['name' => 'is_trial', 'label' => 'Trial Period', 'checked' => $subscription->is_trial ?? false, 'desc' => 'Mark as temporary trial'],
                    ['name' => 'cancel_at_period_end', 'label' => 'Cancel at End', 'checked' => $subscription->cancel_at_period_end ?? false, 'desc' => 'Do not renew after expiry'],
                ];
            @endphp

            @foreach ($toggles as $toggle)
                <div class="col mb-3">
                    <label class="w-100 cursor-pointer">
                        <input type="hidden" name="{{ $toggle['name'] }}" value="0"> 
                        <input type="checkbox" name="{{ $toggle['name'] }}" value="1" class="d-none toggle-input" {{ $toggle['checked'] ? 'checked' : '' }}>

                        <div class="border rounded px-4 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
                            <div>
                                <div class="font-weight-bold text-dark small mb-0">{{ $toggle['label'] }}</div>
                                <div class="small toggle-status text-muted">{{ $toggle['checked'] ? 'Enabled' : 'Disabled' }}</div>
                            </div>
                            <div class="toggle-indicator"></div>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
    </div>
</div>

<style>
    .toggle-card { transition: all 0.2s ease; background-color: #fcfcfc; border-left: 4px solid #ddd !important; }
    .toggle-input:checked + .toggle-card { background-color: #f0fdf4; border-color: #28a745 !important; border-left-color: #28a745 !important; }
    .toggle-indicator { width: 32px; height: 18px; border-radius: 10px; background-color: #ddd; position: relative; }
    .toggle-indicator::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background-color: white; transition: 0.2s; }
    .toggle-input:checked + .toggle-card .toggle-indicator { background-color: #28a745; }
    .toggle-input:checked + .toggle-card .toggle-indicator::after { transform: translateX(14px); }
</style>
