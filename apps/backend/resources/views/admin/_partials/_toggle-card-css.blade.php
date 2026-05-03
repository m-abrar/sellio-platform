@push('css')
<style>
    /* Premium Global UI Refinements */
    :root {
        /* Core Dynamic Colors - Override these to change theme */
        --primary: #46a5ac; 
        --primary-rgb: 70, 165, 172;
        --primary-hover: #3d8f95;
        --primary-dark: #2c6b70; /* Deeper shade for gradients */

        /* Derived Soft Palettes */
        --primary-soft: rgba(var(--primary-rgb), 0.12);
        --success-soft: rgba(34, 197, 94, 0.12);
        --warning-soft: rgba(234, 179, 8, 0.12);
        --danger-soft: rgba(239, 68, 68, 0.12);
        --secondary-soft: rgba(107, 114, 128, 0.12);

        /* Light Theme Surface Colors */
        --bg-surface: #fff;
        --bg-body: #f4f6f9;
        --text-main: #334155;
        --border-color: #edf2f7;
    }

    body.dark-mode {
        --bg-surface: #1e293b;
        --bg-body: #0f172a;
        --text-main: #f1f5f9;
        --border-color: #334155;
        --primary-soft: rgba(var(--primary-rgb), 0.25);
    }

    body.dark-mode .content-wrapper {
        background-color: var(--bg-body) !important;
    }

    body.dark-mode .card:not(.bg-dark):not(.bg-primary):not(.bg-success):not(.bg-info):not(.bg-warning):not(.bg-danger) {
        background-color: var(--bg-surface) !important;
        color: var(--text-main) !important;
        border: 1px solid var(--border-color) !important;
    }

    body.dark-mode .card-header {
        border-bottom-color: var(--border-color) !important;
        background-color: transparent !important;
    }

    body.dark-mode .card-footer {
        border-top-color: var(--border-color) !important;
        background-color: rgba(255,255,255,0.02) !important;
    }

    body.dark-mode .text-dark { color: #f1f5f9 !important; }
    body.dark-mode .text-muted { color: #94a3b8 !important; }
    body.dark-mode .bg-white { background-color: var(--bg-surface) !important; }
    body.dark-mode .bg-light { background-color: rgba(255,255,255,0.05) !important; }
    body.dark-mode .border { border-color: var(--border-color) !important; }
    body.dark-mode .table td, body.dark-mode .table th { border-top-color: var(--border-color) !important; color: #cbd5e0 !important; }
    body.dark-mode .table-premium thead th { background-color: rgba(255,255,255,0.02) !important; border-bottom-color: var(--border-color) !important; }

    body.dark-mode .form-control {
        background-color: #0f172a !important;
        border-color: #334155 !important;
        color: #f1f5f9 !important;
    }

    body.dark-mode .input-group-text {
        background-color: #1e293b !important;
        border-color: #334155 !important;
        color: #94a3b8 !important;
    }

    body.dark-mode .select2-container--bootstrap4 .select2-selection {
        background-color: #0f172a !important;
        border-color: #334155 !important;
        color: #f1f5f9 !important;
    }

    body.dark-mode .select2-selection__rendered { color: #f1f5f9 !important; }
    body.dark-mode .select2-dropdown { background-color: #1e293b !important; border-color: #334155 !important; }

    /* Transitions */
    body, .content-wrapper, .card, .form-control, .input-group-text {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
    }

    /* Form Controls */
    .form-control {
        border-radius: 12px !important;
        border: 1.5px solid #edf2f7 !important;
        padding: 0.6rem 1rem !important;
        height: auto !important;
        transition: all 0.2s ease !important;
    }

    .form-control:focus {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 4px var(--primary-soft) !important;
        background-color: #fff !important;
    }

    .form-control-lg {
        border-radius: 14px !important;
        padding: 0.8rem 1.2rem !important;
    }

    /* Premium Card Styling */
    .card-premium {
        border-radius: 24px !important;
        border: none !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: #fff !important;
    }

    .card-premium:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06) !important;
    }

    .card-premium .card-header {
        border-radius: 24px 24px 0 0 !important;
        background-color: transparent !important;
        border-bottom: 1px solid rgba(0,0,0,0.03) !important;
        padding: 1.5rem 1.5rem !important;
    }

    .card-premium .card-footer {
        border-radius: 0 0 24px 24px !important;
        background-color: transparent !important;
        border-top: 1px solid rgba(0,0,0,0.03) !important;
    }

    /* Premium Badges */
    .badge-premium {
        padding: 0.5em 0.8em !important;
        font-weight: 700 !important;
        letter-spacing: 0.5px !important;
        border-radius: 8px !important;
        text-transform: uppercase !important;
        font-size: 0.7rem !important;
    }

    .badge-success-light { background-color: #dcfce7 !important; color: #15803d !important; border: 1px solid #bbf7d0 !important; }
    .badge-info-light { background-color: #e0f2fe !important; color: #0369a1 !important; border: 1px solid #bae6fd !important; }
    .badge-warning-light { background-color: #fef9c3 !important; color: #a16207 !important; border: 1px solid #fef08a !important; }
    .badge-danger-light { background-color: #fee2e2 !important; color: #b91c1c !important; border: 1px solid #fecaca !important; }
    .badge-secondary-light { background-color: #f3f4f6 !important; color: #374151 !important; border: 1px solid #e5e7eb !important; }

    /* Premium Toggle Card Styling */
    .toggle-card { 
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); 
        background-color: #fff; 
        border: 1.5px solid #edf2f7 !important;
        border-radius: 16px;
        cursor: pointer; 
        position: relative;
        padding: 0.85rem 1.25rem !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
    }
    
    .toggle-card:hover {
        border-color: var(--primary-soft) !important;
        background-color: #f8fafc;
        transform: translateY(-2px);
    }

    .toggle-input:checked + .toggle-card { 
        background-color: #fff;
        border-color: var(--primary) !important;
        box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.08) !important;
    }

    .toggle-card .toggle-indicator {
        width: 40px;
        height: 20px;
        background-color: #e2e8f0;
        border-radius: 50px;
        position: relative;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .toggle-card .toggle-indicator::after {
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        background-color: #fff;
        border-radius: 50%;
        top: 3px;
        left: 3px;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    }

    .toggle-input:checked + .toggle-card .toggle-indicator { 
        background-color: var(--primary); 
    }

    .toggle-input:checked + .toggle-card .toggle-indicator::after { 
        transform: translateX(20px); 
    }

    .toggle-input:checked + .toggle-card .text-dark {
        color: var(--primary) !important;
    }

    .toggle-input:checked + .toggle-card .toggle-status {
        color: var(--primary) !important;
        font-weight: 600;
        opacity: 0.8;
    }

    /* Premium Custom Switch Styling */
    .custom-switch-premium {
        padding-left: 3rem;
        min-height: 2.25rem;
    }

    .custom-switch-premium .custom-control-input ~ .custom-control-label::before {
        left: -3rem;
        width: 2.5rem;
        height: 1.25rem;
        pointer-events: all;
        border-radius: 1rem;
        background-color: #e2e8f0;
        border: none !important;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .custom-switch-premium .custom-control-input ~ .custom-control-label::after {
        top: calc(0.25rem + 1.5px);
        left: calc(-3rem + 2px);
        width: calc(1.25rem - 4px);
        height: calc(1.25rem - 4px);
        background-color: #fff;
        border-radius: 1rem;
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), background-color 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .custom-switch-premium .custom-control-input:checked ~ .custom-control-label::before {
        background-color: #22c55e;
    }

    .custom-switch-premium .custom-control-input:checked ~ .custom-control-label::after {
        transform: translateX(1.25rem);
    }

    .custom-switch-premium .custom-control-input:focus ~ .custom-control-label::before {
        box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25);
    }

    /* Standard Checkbox Premium */
    .checkbox-premium {
        position: relative;
        cursor: pointer;
        user-select: none;
        padding-left: 30px;
        margin-bottom: 0;
    }

    .checkbox-premium input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 20px;
        width: 20px;
        background-color: #f1f5f9;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .checkbox-premium:hover input ~ .checkmark {
        border-color: #cbd5e0;
    }

    .checkbox-premium input:checked ~ .checkmark {
        background-color: #22c55e;
        border-color: #22c55e;
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    .checkbox-premium input:checked ~ .checkmark:after {
        display: block;
    }

    .checkbox-premium .checkmark:after {
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    /* Select2 Premium Refinement */
    .select2-container--bootstrap4 .select2-selection--single {
        border-radius: 12px !important;
        border: 1.5px solid #edf2f7 !important;
        height: 50px !important;
        padding: 0.5rem 1rem !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        background-color: #fff !important;
    }

    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered {
        color: #334155 !important;
        font-weight: 500 !important;
        line-height: normal !important;
        padding-left: 0 !important;
    }

    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow {
        height: 48px !important;
        right: 12px !important;
    }

    .select2-container--bootstrap4.select2-container--focus .select2-selection {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 4px var(--primary-soft) !important;
    }

    .select2-dropdown {
        border-radius: 20px !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
        box-shadow: 0 15px 45px rgba(0,0,0,0.12) !important;
        overflow: hidden !important;
        margin-top: 8px !important;
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px);
        z-index: 1061 !important;
    }

    .select2-search--dropdown .select2-search__field {
        border-radius: 10px !important;
        padding: 10px 15px !important;
        border: 1.5px solid #edf2f7 !important;
        margin: 10px !important;
        width: calc(100% - 20px) !important;
    }

    .select2-results__option {
        padding: 12px 20px !important;
        font-size: 0.9rem !important;
        color: #475569 !important;
        transition: all 0.2s ease;
    }

    .select2-container--bootstrap4 .select2-results__option--highlighted {
        background-color: var(--primary-soft) !important;
        color: var(--primary) !important;
    }

    .select2-container--bootstrap4 .select2-results__option[aria-selected=true] {
        background-color: var(--primary) !important;
        color: #fff !important;
    }

    /* Modern Date Input Styling */
    input[type="date"] {
        appearance: none;
        -webkit-appearance: none;
        color: #334155;
        font-family: inherit;
        font-weight: 500;
        border-radius: 12px !important;
        border: 1.5px solid #edf2f7 !important;
        padding: 0.6rem 1rem !important;
    }

    /* Premium Checkbox Refinement for "Feature Applicability" */
    .custom-control-premium {
        padding-left: 2.5rem !important;
        min-height: 1.5rem !important;
    }

    .custom-control-premium .custom-control-label::before {
        left: -2.5rem !important;
        width: 1.5rem !important;
        height: 1.5rem !important;
        border-radius: 8px !important;
        border: 1.5px solid #e2e8f0 !important;
        background-color: #f8fafc !important;
        transition: all 0.2s ease !important;
        top: 0 !important;
    }

    .custom-control-premium .custom-control-label::after {
        left: -2.5rem !important;
        width: 1.5rem !important;
        height: 1.5rem !important;
        top: 0 !important;
        background-size: 60% 60% !important;
    }

    .custom-control-input:checked ~ .custom-control-label::before {
        border-color: var(--primary) !important;
        background-color: var(--primary) !important;
    }

    .custom-control-input:focus ~ .custom-control-label::before {
        box-shadow: 0 0 0 0.2rem var(--primary-soft) !important;
    }

    /* Global Print Optimization */
    @media print {
        .main-sidebar, 
        .main-header, 
        .content-header, 
        .btn, 
        .card-header .card-tools,
        .print-hide {
            display: none !important;
        }
        
        body, .content-wrapper {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .container-fluid {
            max-width: 100% !important;
            padding: 0 !important;
        }

        .card {
            border: none !important;
            box-shadow: none !important;
            break-inside: avoid;
        }

        .card-header {
            background: #f8fafc !important;
            border-bottom: 2px solid #334155 !important;
        }

        .table thead th {
            background-color: #f1f5f9 !important;
            color: #000 !important;
            border-bottom: 2px solid #000 !important;
        }
    }

    /* Premium Button Styling */
    .btn-premium {
        border-radius: 12px !important;
        padding: 0.7rem 1.5rem !important;
        font-weight: 700 !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        font-size: 0.8rem !important;
        border: none !important;
    }

    .btn-submit-premium {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
        color: white !important;
        box-shadow: none !important;
        position: relative;
        overflow: hidden;
    }

    .btn-submit-premium::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: 0.5s;
    }

    .btn-submit-premium:hover::before {
        left: 100%;
    }

    .btn-submit-premium:hover {
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: none !important;
        background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-hover) 100%) !important;
    }

    .btn-submit-premium:active {
        transform: translateY(0) scale(0.98) !important;
    }

    /* Modernizing standard primary buttons */
    .btn-primary {
        border-radius: 12px !important;
        font-weight: 700 !important;
        box-shadow: none !important;
        transition: all 0.2s ease !important;
        border: none !important;
    }

    .btn-primary:hover {
        transform: translateY(-2px) !important;
        box-shadow: none !important;
        background-color: var(--primary-hover) !important;
    }

    /* Premium Shadow Utility - Note: Removed from submit buttons */
    .shadow-premium {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03) !important;
    }
    
    .shadow-premium-lg {
        box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.15) !important;
    }

    button[type="submit"], 
    .btn-primary[type="submit"],
    .btn-submit-premium {
        box-shadow: none !important;
    }

    button[type="submit"]:hover, 
    .btn-primary[type="submit"]:hover,
    .btn-submit-premium:hover {
        box-shadow: none !important;
    }

    /* Premium Back Button */
    .btn-back {
        background: #fff !important;
        color: #64748b !important;
        border: 1.5px solid #edf2f7 !important;
        border-radius: 12px !important;
        padding: 0.6rem 1.2rem !important;
        font-weight: 700 !important;
        font-size: 0.75rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.8px !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        display: inline-flex !important;
        align-items: center !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
    }

    .btn-back:hover {
        background: #f8fafc !important;
        color: var(--primary) !important;
        border-color: var(--primary-soft) !important;
        transform: translateX(-4px) !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    }

    .btn-back i {
        margin-right: 8px;
        transition: transform 0.3s ease;
        font-size: 0.8rem;
    }

    .btn-back:hover i {
        transform: translateX(-3px);
    }

    /* Premium Input Groups */
    .input-group {
        border-radius: 12px !important;
        transition: all 0.2s ease !important;
    }

    .input-group .form-control {
        border-radius: 0 !important;
        border-left: none !important;
        z-index: 1 !important;
    }

    .input-group-prepend .input-group-text,
    .input-group-append .input-group-text {
        background-color: #f8fafc !important;
        border: 1.5px solid #edf2f7 !important;
        color: #94a3b8 !important;
        font-size: 0.85rem !important;
        padding: 0 1.1rem !important;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
    }

    .input-group-prepend {
        margin-right: -1.5px;
        z-index: 2;
    }

    .input-group-prepend .input-group-text {
        border-radius: 12px 0 0 12px !important;
        border-right: none !important;
    }

    .input-group-append .input-group-text {
        border-radius: 0 12px 12px 0 !important;
        border-left: none !important;
    }

    .input-group:focus-within {
        box-shadow: 0 0 0 4px var(--primary-soft) !important;
        border-radius: 12px !important;
    }

    .input-group:focus-within .input-group-text {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
        background-color: #fff !important;
    }

    .input-group:focus-within .form-control {
        border-color: var(--primary) !important;
    }

    /* Premium Table Architecture */
    .table-premium {
        width: 100% !important;
        border-collapse: separate !important;
        border-spacing: 0 !important;
    }

    .table-premium thead th {
        background-color: #f8fafc !important;
        border-bottom: 1.5px solid #edf2f7 !important;
        border-top: none !important;
        padding: 1rem 1rem !important;
        font-weight: 700 !important;
        color: #64748b !important;
        text-transform: uppercase !important;
        font-size: 0.7rem !important;
        letter-spacing: 0.05em !important;
    }

    .table-premium tbody td {
        padding: 1.25rem 1rem !important;
        vertical-align: middle !important;
        border-bottom: 1px solid #f1f5f9 !important;
        transition: all 0.2s ease !important;
        color: #334155;
    }

    .table-premium tbody tr:hover td {
        background-color: rgba(var(--primary-rgb), 0.02) !important;
    }

    /* Table Media Previews */
    .table-img-preview {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        background: #f1f5f9;
        margin: auto;
    }

    .table-img-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Button Group Premium */
    .btn-group-premium {
        background: #fff;
        border-radius: 10px !important;
        overflow: hidden;
        border: 1.5px solid #edf2f7 !important;
    }

    .btn-group-premium .btn {
        border: none !important;
        border-right: 1.5px solid #edf2f7 !important;
        padding: 0.5rem 0.85rem !important;
        background: transparent !important;
    }

    .btn-group-premium .btn:last-child {
        border-right: none !important;
    }

    .btn-group-premium .btn:hover {
        background-color: #f8fafc !important;
    }
</style>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Global listener for premium toggles
        document.body.addEventListener('change', function(e) {
            if (e.target && e.target.classList.contains('toggle-input')) {
                const card = e.target.closest('label');
                if (card) {
                    const statusText = card.querySelector('.toggle-status');
                    if (statusText) {
                        statusText.textContent = e.target.checked ? 'ENABLED' : 'DISABLED';
                    }
                }
            }
        });
    });
</script>
@endpush
