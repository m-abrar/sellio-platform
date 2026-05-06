<div class="card border-0 shadow-premium rounded-24 overflow-hidden">
    <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
        <h3 class="card-title font-weight-bold text-dark mb-0">
            <i class="fas fa-key mr-2 text-primary opacity-50"></i> Permission Spectrum
        </h3>
        <div class="card-tools">
            <button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-3 font-weight-bold shadow-xs" id="globalToggle">
                <i class="fas fa-sync-alt mr-1"></i> TOGGLE ALL
            </button>
        </div>
    </div>
    <div class="card-body p-4 bg-light-soft">
        @php
            $grouped = $permissions->groupBy(function($p) {
                return explode('-', $p->name)[0]; 
            });
        @endphp

        <div class="row">
            @foreach($grouped as $group => $items)
                <div class="col-md-6 col-xl-4 mb-4">
                    <div class="bg-white p-3 rounded-xl border shadow-xs h-100 transition-all hover-shadow-premium">
                        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h6 class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                                <i class="fas fa-folder-open mr-2 text-primary opacity-50"></i> {{ $group }}
                            </h6>
                            <div class="custom-control custom-switch custom-switch-sm">
                                <input type="checkbox" class="custom-control-input group-toggler" id="group_{{ $group }}">
                                <label class="custom-control-label smallest font-weight-bold text-muted" for="group_{{ $group }}">FULL ACCESS</label>
                            </div>
                        </div>
                        <div class="permission-items pl-1">
                            @foreach($items as $permission)
                                <div class="custom-control custom-checkbox mb-2">
                                    <input type="checkbox" name="permissions[]" value="{{ $permission->id }}" 
                                        class="custom-control-input permission-item"
                                        id="perm_{{ $permission->id }}"
                                        @if(isset($currentRole) && $currentRole->hasPermissionTo($permission->name)) checked @endif>
                                    <label class="custom-control-label font-weight-600 text-secondary font-0-85 cursor-pointer" for="perm_{{ $permission->id }}">
                                        {{ ucwords(str_replace(['-', $group], [' ', ''], $permission->name)) }}
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

@push('js')
<script>
    $(function() {
        // Toggle specific group
        $('.group-toggler').on('change', function() {
            $(this).closest('.rounded-xl').find('.permission-item').prop('checked', $(this).prop('checked'));
        });

        // Global toggle
        $('#globalToggle').on('click', function() {
            const anyUnchecked = $('.permission-item:not(:checked)').length > 0;
            $('.permission-item, .group-toggler').prop('checked', anyUnchecked);
        });
    });
</script>
@endpush

@endpush
