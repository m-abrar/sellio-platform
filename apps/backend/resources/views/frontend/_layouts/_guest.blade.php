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

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    {{-- Theme CSS --}}
    <link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
    
    @stack('styles')

    <style>
        :root {
            @if(isset($activeTheme) && $activeTheme->variables)
                @foreach($activeTheme->variables as $key => $value)
                    {{ $key }}: {{ $value }};
                @endforeach
                {{-- Map theme variables to local auth variables --}}
                @php 
                    $pColor = $activeTheme->variables['--color-primary'] ?? 'hsl(240, 75%, 60%)';
                    $pColorRgb = hexToRgb($pColor);
                @endphp
                --primary-color: {{ $pColor }};
                --primary-color-rgb: {{ $pColorRgb }};
                --primary-dark: {{ $activeTheme->variables['--color-primary-dark'] ?? 'hsl(240, 70%, 50%)' }};
            @else
                --primary-color: hsl(240, 75%, 60%); 
                --primary-dark: hsl(240, 70%, 50%);
            @endif
            
            --text-dark: #1f2937; 
            --text-muted: #6b7280; 
            --card-radius: 20px; 
        }

        body {
            font-family: {!! $activeTheme->variables['--font-family-base'] ?? "'Inter', sans-serif" !!};
            color: var(--text-dark);
            min-height: 100vh;
            background-color: #ffffff;
        }

        .auth-wrapper {
            min-height: 100vh;
        }

        /* Commercial Touch Targets */
        .btn, .form-control {
            min-height: 52px;
            border-radius: 12px;
        }

        .form-control:focus {
            box-shadow: 0 0 0 4px hsla(var(--primary-hue), 75%, 60%, 0.15);
            border-color: var(--primary-color);
        }

        .btn-primary {
            background-color: var(--primary-color);
            border: none;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 8px 15px hsla(var(--primary-hue), 75%, 60%, 0.2);
        }

        .has-body-glow::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 10% 20%, rgba(90, 87, 217, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
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
