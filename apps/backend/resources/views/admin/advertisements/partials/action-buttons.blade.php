<div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-0">
    <div class="card-header bg-dark py-3" style="border-bottom: 3px solid var(--primary) !important;">
        <h3 class="card-title text-white font-weight-bold">
            <i class="fas fa-rocket mr-2 text-primary"></i> Publishing
        </h3>
    </div>
    <div class="card-body bg-white p-4">
        
        <div class="mb-4">
            <label class="w-100 cursor-pointer">
                <input type="hidden" name="status" value="0">
                <input type="checkbox" name="status" value="1" id="statusSwitch"
                       class="d-none toggle-input" 
                       {{ ($advertisement->exists && $advertisement->status) ? 'checked' : '' }}>
                
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Ad Status</div>
                            {{ ($advertisement->exists && $advertisement->status) ? 'Active' : 'Inactive' }}
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <button form="ad-form" type="submit" class="btn btn-primary btn-block py-2 mb-3 shadow-sm rounded-pill">
            <i class="fas fa-save mr-2"></i> <strong>Save Advertisement</strong>
        </button>

        @if($advertisement->exists)
            <form action="{{ route('admin.advertisements.destroy', $advertisement->id) }}" method="POST" onsubmit="return confirm('Delete this ad?');">
                @csrf @method('DELETE')
                <button type="submit" class="btn btn-outline-danger btn-sm btn-block">
                    <i class="fas fa-trash mr-1"></i> Delete Permanent
                </button>
            </form>
        @endif
    </div>
</div>

@push('css')
<style>
    /* Modern Toggle CSS */
    .toggle-card { transition: all 0.3s ease; background-color: #f8f9fa; cursor: pointer; }
    .toggle-input:checked + .toggle-card { background-color: #e9f7ef; border-color: #28a745 !important; }
    .toggle-indicator { width: 36px; height: 20px; border-radius: 10px; background-color: #ccc; position: relative; }
    .toggle-indicator::after { 
        content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; 
        border-radius: 50%; background-color: white; transition: all 0.3s ease; 
    }
    .toggle-input:checked + .toggle-card .toggle-indicator { background-color: #28a745; }
    .toggle-input:checked + .toggle-card .toggle-indicator::after { transform: translateX(16px); }
</style>
@endpush
