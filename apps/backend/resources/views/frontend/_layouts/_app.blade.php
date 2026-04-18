<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ get_layout_direction() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="description" content="{{ strip_tags($__env->yieldContent('meta_description', config('app.name'))) }}">
    <title>@yield('title', __('Welcome')) | {{ $siteName ?? config('app.name') }}</title>

    <link rel="canonical" href="{{ url()->current() }}">
    
    <link rel="icon" type="image/x-icon" href="{{ $siteFavicon }}">
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

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
    
    @auth
        @can('manage-pages')
            @vite(['resources/css/admin-bar.css', 'resources/css/editable-ui.css'])
        @endcan
    @endauth

    @yield('head_extra')
    @stack('styles')

    <style>
        :root {
            @if(isset($activeTheme) && $activeTheme->variables)
                @foreach($activeTheme->variables as $key => $value)
                    {{ $key }}: {{ $value }};
                @endforeach
                {{-- Map theme variables to standard names and generate RGB --}}
                @php 
                    $pColor = $activeTheme->variables['--color-primary'] ?? '#5a57d9';
                    $pColorRgb = hexToRgb($pColor);
                @endphp
                --primary-color: {{ $pColor }};
                --primary-color-rgb: {{ $pColorRgb }};
                --secondary-color: {{ $activeTheme->variables['--color-secondary'] ?? '#6c757d' }};
                --text-main: {{ $activeTheme->variables['--color-text'] ?? '#1f2937' }};
            @endif
        }
        
        @if(isset($activeTheme) && isset($activeTheme->variables['--font-family-base']))
            body {
                font-family: {!! $activeTheme->variables['--font-family-base'] !!}, 'Inter', sans-serif !important;
            }
        @endif
        @if(isset($activeTheme) && isset($activeTheme->variables['--font-family-heading']))
            h1, h2, h3, h4, h5, h6, .navbar-brand, .section-title {
                font-family: {!! $activeTheme->variables['--font-family-heading'] !!}, 'Inter', sans-serif !important;
            }
        @endif
    </style>
</head>

<body class="no-js antialiased @yield('body_class')">

    @auth
        @can('manage-pages')
            @include('admin._partials._adminbar')
        @endcan
    @endauth

    <header class="main-header border-bottom bg-white sticky-top" role="banner">
        {{-- Look how clean this is now --}}
        @includeIf('frontend._partials._header')
    </header>
    
    <main id="main-content" class="min-vh-100" role="main">
        @yield('hero')
        <div class="container-xl">
            @yield('content')
        </div>
    </main>
    
    <footer class="main-footer bg-dark footer-section" role="contentinfo">
        @includeIf('frontend._partials._footer')
    </footer>

    @stack('modals')
    @stack('scripts')
</body>
</html>
