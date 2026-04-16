@push('css')
<style>
    .toggle-card { 
        transition: all 0.3s ease; 
        background-color: #ffffff; 
        border: 1px solid #e3e6f0 !important;
        border-radius: 8px;
        cursor: pointer; 
    }
    .toggle-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important;
    }
    .toggle-input:checked + .toggle-card { 
        background-color: #f0fdf4; 
        border-color: #28a745 !important; 
    }
    .toggle-card .toggle-indicator {
        width: 32px;
        height: 18px;
        background-color: #e9ecef;
        border-radius: 20px;
        position: relative;
        transition: background-color 0.3s ease;
    }
    .toggle-card .toggle-indicator::after {
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        background-color: #fff;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: transform 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .toggle-input:checked + .toggle-card .toggle-indicator { 
        background-color: #28a745; 
    }
    .toggle-input:checked + .toggle-card .toggle-indicator::after { 
        transform: translateX(14px); 
    }
    .toggle-input:checked + .toggle-card .toggle-status {
        color: #28a745 !important;
        font-weight: 600;
    }
</style>
@endpush
