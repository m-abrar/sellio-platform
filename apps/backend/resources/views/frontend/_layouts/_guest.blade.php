<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', __('Login')) | {{ setting('site_name', config('app.name')) }}</title>
    
    {{-- Favicons --}}
    <link rel="icon" type="image/x-icon" href="{{ asset('storage/' . setting('site_favicon')) }}"> 
    <link rel="apple-touch-icon" href="{{ asset('storage/' . setting('site_favicon')) }}">
    
    {{-- Core Assets --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    {{-- Dynamic Theme Fonts --}}
    @if(isset($activeTheme) && $activeTheme->variables)
        @php
            $fonts = [];
            foreach (['--font-family-base', '--font-family-heading'] as $key) {
                if (isset($activeTheme->variables[$key])) {
                    if (preg_match("/'([^']+)'/", $activeTheme->variables[$key], $matches)) {
                        $fonts[] = str_replace(' ', '+', $matches[1]) . ':wght@400;500;600;700;800';
                    }
                }
            }
            $fontQuery = implode('&family=', array_unique($fonts));
        @endphp
        @if($fontQuery)
            <link href="https://fonts.googleapis.com/css2?family={{ $fontQuery }}&display=swap" rel="stylesheet">
        @endif
    @endif

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    {{-- Theme CSS --}}
    <link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
    
    @stack('styles')

    <style>
        :root {
            /* Semantic Tokens */
            --primary: #46a5ac;
            --primary-rgb: 70, 165, 172;
            --primary-dark: #2c6b70;
            --primary-soft: rgba(var(--primary-rgb), 0.08);
            --primary-glow: rgba(var(--primary-rgb), 0.25);
            
            --dark-navy: #0c1222;
            --surface-light: #f8fafc;
            --surface-white: #ffffff;
            
            --text-main: #0f172a;
            --text-muted: #64748b;
            --text-on-dark: rgba(255, 255, 255, 0.9);
            
            --glass-bg: rgba(255, 255, 255, 0.88);
            --glass-border: rgba(255, 255, 255, 0.7);
            --glass-blur: 24px;
            
            --shadow-premium: 0 25px 60px rgba(0, 0, 0, 0.1);
            --shadow-glow: 0 12px 28px -6px rgba(var(--primary-rgb), 0.35);
            
            --radius-pill: 60px;
            --radius-xl: 32px;
            
            --font-main: 'Inter', sans-serif;
            --font-heading: 'Outfit', sans-serif;
            --transition-smooth: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            font-family: var(--font-main);
            color: var(--text-main);
            min-height: 100vh;
            background-color: var(--surface-light);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, .brand-text {
            font-family: var(--font-heading);
            letter-spacing: -0.035em;
            font-weight: 800;
        }

        /* Typography Utilities */
        .text-gradient {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .fw-800 { font-weight: 800; }

        /* Layout Architecture */
        .auth-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 0% 0%, rgba(var(--primary-rgb), 0.04) 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(var(--primary-rgb), 0.04) 0%, transparent 50%);
        }

        .auth-split-marketing {
            background: var(--dark-navy);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: clamp(3rem, 7vw, 7rem) !important;
        }

        .auth-glow {
            position: absolute;
            width: 1000px;
            height: 1000px;
            background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            filter: blur(60px);
        }

        /* Global Component Overrides */
        .btn {
            border-radius: var(--radius-pill) !important;
            font-weight: 700 !important;
            transition: var(--transition-smooth) !important;
            padding: 14px 32px !important;
            letter-spacing: -0.01em;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
            border: none !important;
            box-shadow: var(--shadow-glow) !important;
            color: var(--surface-white) !important;
        }

        .btn-primary:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 40px -8px rgba(var(--primary-rgb), 0.45) !important;
        }

        .btn-light {
            background-color: #f1f5f9 !important;
            border: none !important;
        }

        .btn-light:hover {
            background-color: #e2e8f0 !important;
            transform: translateY(-2px);
        }

        .form-control {
            border-radius: var(--radius-pill) !important;
            height: 60px !important;
            padding-left: 1.85rem !important;
            padding-right: 1.85rem !important;
            border: 1px solid #e2e8f0 !important;
            background-color: var(--surface-light) !important;
            transition: var(--transition-smooth) !important;
            font-weight: 500 !important;
            font-size: 0.95rem !important;
        }

        .form-control:focus {
            background-color: var(--surface-white) !important;
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 5px var(--primary-soft), 0 10px 20px -10px rgba(var(--primary-rgb), 0.1) !important;
            transform: translateY(-2px);
        }

        /* Auth Card System */
        .auth-card {
            background: var(--glass-bg);
            backdrop-filter: blur(var(--glass-blur));
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-premium);
            padding: 4.5rem !important;
            width: 100%;
            max-width: 540px;
            animation: cardEntrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes cardEntrance {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* DRY Utilities for Social Buttons */
        .social-btn {
            border-radius: var(--radius-pill) !important;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.8) !important;
            border: 1px solid #e2e8f0 !important;
            transition: var(--transition-smooth) !important;
        }

        .social-btn:hover {
            background-color: var(--surface-white) !important;
            border-color: var(--primary) !important;
            transform: translateY(-2px);
            box-shadow: var(--shadow-glow) !important;
        }

        /* Icon Boxes */
        .icon-box-soft {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(var(--primary-rgb), 0.1);
            border-radius: 16px;
            color: var(--primary);
            transition: var(--transition-smooth);
        }

        .icon-box-soft:hover {
            background: var(--primary);
            color: var(--surface-white);
            transform: scale(1.1) rotate(5deg);
        }

        /* Input Icon System */
        .form-icon-group {
            position: relative;
        }
        
        .form-icon-group .form-control {
            padding-left: 3.5rem !important;
        }
        
        .form-icon-group .input-icon {
            position: absolute;
            top: 50%;
            left: 1.5rem;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 1.1rem;
            z-index: 10;
            pointer-events: none;
            transition: var(--transition-smooth);
        }
        
        .form-icon-group .form-control:focus + .input-icon {
            color: var(--primary);
            transform: translateY(-50%) scale(1.1);
        }

        /* Global Footer Utility */
        .auth-footer-copyright {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.05em;
            text-transform: uppercase;
            opacity: 0.6;
        }

        /* Responsive Architecture */
        @media (max-width: 991.98px) {
            .auth-card {
                padding: 2.5rem 1.5rem !important;
                box-shadow: none;
                background: transparent;
                border: none;
                backdrop-filter: none;
                animation: none;
            }
            .auth-split-marketing {
                padding: 2.5rem 1.5rem !important;
            }
        }

        /* Alert System Overrides */
        .alert {
            border-radius: 16px !important;
            border: none !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
            padding: 1.25rem 1.5rem !important;
        }
        .alert-danger {
            background-color: #fef2f2 !important;
            color: #991b1b !important;
        }
        .alert-success {
            background-color: #f0fdf4 !important;
            color: #166534 !important;
        }
        .alert-info {
            background-color: #eff6ff !important;
            color: #1e40af !important;
        }
    </style>
</head>
<body class="@yield('body_class', 'has-body-glow')">

    <main class="auth-wrapper overflow-hidden">
        <div class="container-fluid p-0">
            <div class="row g-0 min-vh-100">
                @yield('content')
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
