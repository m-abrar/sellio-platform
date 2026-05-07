{{--
    Administrative Taxonomy Component: Map Context Card
    
    This wrapper component orchestrates the spatial intelligence 
    visualization for location management. It provides the premium 
    container and descriptive headers for the interactive map 
    interface, ensuring design consistency within the sidebar vertical.
    
    @context Taxonomy Management - Location Module
--}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mt-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-side">
            <i class="fas fa-map-marked mr-2 text-primary opacity-50"></i> Map Intelligence
        </h3>
    </div>
    <div class="card-body p-0">
        @include('admin.locations.map')
    </div>
</div>
