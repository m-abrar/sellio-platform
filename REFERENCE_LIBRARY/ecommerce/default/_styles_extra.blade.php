@section('head_extra')
<style>
    /* NOTE: Assuming --primary-color and --primary-light are defined in parent or global CSS */
    
    /* Fixed Image Gallery Styling */
    .main-listing-img {
        width: 100%;
        max-height: 400px;
        object-fit: contain; 
        border-radius: var(--bs-card-border-radius);
        background-color: #f8f9fa; /* Light background for the containment area */
    }
    .gallery-section {
        background-color: transparent;
        border-top-left-radius: var(--bs-card-border-radius);
        border-top-right-radius: var(--bs-card-border-radius);
    }

    /* Thumbnail Styling */
    .thumbnail-img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.2s, opacity 0.2s;
        opacity: 0.7; /* Dim inactive thumbnails */
    }
    .thumbnail-img:hover {
        opacity: 1;
        border-color: rgba(0, 0, 0, 0.2);
    }
    .thumbnail-img.active {
        border-color: var(--primary-color);
        opacity: 1; /* Highlight active thumbnail */
    }

    /* General Styles (Ensuring theme color usage) */
    .btn-primary { 
        background-color: var(--primary-color) !important; 
        border-color: var(--primary-color) !important;
    }
    .btn-outline-secondary {
        background-color: rgba(255, 255, 255, 0.1); 
        border-color: rgba(0, 0, 0, 0.1);
    }
    .text-primary-color {
        color: var(--primary-color) !important;
    }
    .alert-info[role="alert"] {
        /* Overrides the default alert background */
        background-color: var(--primary-light) !important;
        border-color: var(--primary-color) !important;
        color: #333; /* Ensuring readability */
    }

    /* Other Styles */
    .list-group-item.bg-transparent {
        background-color: transparent !important;
    }
    .related-img {
        height: 120px;
        object-fit: cover;
        border-top-left-radius: var(--bs-card-border-radius);
        border-top-right-radius: var(--bs-card-border-radius);
    }
    .map-placeholder {
        height: 100px;
        background-color: rgba(255, 255, 255, 0.5); 
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
</style>
@endsection