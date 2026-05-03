@php
    $moduleMap = [
        'is_property'   => 'properties',
        'is_event'      => 'events',
        'is_job'        => 'jobs',
        'is_auto'       => 'autos',
        'is_service'    => 'services',
        'is_classified' => 'classifieds',
        'is_product'    => 'products',
    ];
@endphp

@foreach($modules as $column => $meta)
    @php
        $moduleKey = $moduleMap[$column] ?? null;
        if ($moduleKey && !module_enabled($moduleKey)) {
            continue;
        }
    @endphp
<div class="col-md-4 mb-3">
    <label class="w-100 cursor-pointer mb-0">
        <input type="hidden" name="{{ $column }}" value="0">
        <input type="checkbox" name="{{ $column }}" value="1" id="check_{{ $column }}" class="d-none toggle-input" 
               {{ old($column, $model->exists && $model->$column ? true : false) ? 'checked' : '' }}>
        <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
            <div class="d-flex align-items-center">
                <div class="icon-box-soft mr-3 bg-light text-muted d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 12px;">
                    <i class="{{ $meta['icon'] }} h5 mb-0 opacity-75"></i>
                </div>
                <div>
                    <div class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1">
                        {{ $meta['label'] }}
                    </div>
                    <span class="smallest text-muted toggle-status">
                        {{ old($column, $model->exists && $model->$column ? true : false) ? 'ENABLED' : 'DISABLED' }}
                    </span>
                </div>
            </div>
            <div class="toggle-indicator"></div>
        </div>
    </label>
</div>
@endforeach
