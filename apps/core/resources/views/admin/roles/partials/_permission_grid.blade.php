<div class="card shadow-sm border-0">
    <div class="card-header bg-white">
        <h3 class="card-title font-weight-bold">Module Permissions</h3>
        <div class="card-tools">
            <button type="button" class="btn btn-xs btn-outline-secondary" id="globalToggle">Toggle All</button>
        </div>
    </div>
    <div class="card-body">
        @php
            $grouped = $permissions->groupBy(function($p) {
                return explode('-', $p->name)[0]; 
            });
        @endphp

        <div class="row">
            @foreach($grouped as $group => $items)
                <div class="col-md-6 mb-3">
                    <div class="p-3 border rounded bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
                            <h6 class="font-weight-bold text-primary text-uppercase small mb-0">{{ $group }}</h6>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input group-toggler" id="group_{{ $group }}">
                                <label class="custom-control-label small" for="group_{{ $group }}">All</label>
                            </div>
                        </div>
                        @foreach($items as $permission)
                            <div class="custom-control custom-checkbox mb-1">
                                <input type="checkbox" name="permissions[]" value="{{ $permission->id }}" 
                                    class="custom-control-input permission-item"
                                    id="perm_{{ $permission->id }}"
                                    @if(isset($currentRole) && $currentRole->hasPermissionTo($permission->name)) checked @endif>
                                <label class="custom-control-label font-weight-normal" for="perm_{{ $permission->id }}">
                                    {{ ucwords(str_replace(['-', $group], [' ', ''], $permission->name)) }}
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

@section('js')
<script>
    $(function() {
        // Toggle specific group
        $('.group-toggler').on('change', function() {
            $(this).closest('.p-3').find('.permission-item').prop('checked', $(this).prop('checked'));
        });

        // Global toggle
        $('#globalToggle').on('click', function() {
            const anyUnchecked = $('.permission-item:not(:checked)').length > 0;
            $('.permission-item, .group-toggler').prop('checked', anyUnchecked);
        });
    });
</script>
@stop
