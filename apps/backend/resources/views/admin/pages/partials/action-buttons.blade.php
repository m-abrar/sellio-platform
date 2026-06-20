{{--
    Administrative Content Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for static 
    page persistence and publication status management. It orchestrates 
    visibility toggles, primary persistence operations, and 
    destructive disposals (delete), designed for a streamlined 
    editorial workflow.
    
    @context Page Management Module
    @variables Page $page The page model instance being managed.
--}}
<div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-0">
    <div class="card-header bg-dark py-3 border-bottom-3-primary">
        <h3 class="card-title text-white font-weight-bold">
            <i class="fas fa-rocket mr-2 text-primary"></i> Publishing
        </h3>
    </div>
    <div class="card-body bg-white p-4">
        
        {{-- Custom Status Toggle --}}
        <div class="mb-4">
            <label class="w-100 cursor-pointer">
                <input type="hidden" name="status" value="inactive">
                <input type="checkbox" name="status" value="active" 
                       class="d-none toggle-input" 
                       {{ ($page->exists && $page->status == 'active') || !$page->exists ? 'checked' : '' }}>
                
                <div class="border rounded px-3 py-2 d-flex justify-content-between align-items-center toggle-card shadow-sm">
                    <div>
                        <div class="fw-bold small text-dark">Page Status</div>
                            {{ ($page->exists && $page->status == 'active') || !$page->exists ? 'Active' : 'Inactive' }}
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <button form="page-form" type="submit" class="btn btn-primary btn-block py-2 mb-3 shadow-sm rounded-pill">
            <i class="fas fa-save mr-2"></i> <strong>Save Changes</strong>
        </button>

        @if($page->exists)
            <div class="d-flex justify-content-between align-items-center border-top pt-3">
                <a href="{{ url($page->slug ?? '/') }}" target="_blank" class="btn btn-link btn-sm text-primary p-0">
                    <i class="fas fa-external-link-alt mr-1"></i> Preview Page
                </a>
                
                <form id="delete-form-page-{{ $page->id }}" action="{{ route('admin.pages.destroy', $page->id) }}" method="POST">
                    @csrf @method('DELETE')
                    <button type="button" class="btn btn-outline-danger btn-sm rounded-circle shadow-sm icon-box-35"
                            data-action="delete-trigger"
                            data-form-id="delete-form-page-{{ $page->id }}"
                            data-confirm-title="{{ __('Delete Page?') }}"
                            data-confirm-text="{{ __('This will permanently remove the page.') }}">
                        <i class="fas fa-trash"></i>
                    </button>
                </form>
            </div>
        @endif
    </div>
</div>



<script>
    // Update toggle status text on click
    document.querySelectorAll('.toggle-input').forEach(input => {
        input.addEventListener('change', function() {
            const statusElement = this.closest('label').querySelector('.toggle-status');
            statusElement.textContent = this.checked ? 'Active' : 'Inactive';
        });
    });
</script>
