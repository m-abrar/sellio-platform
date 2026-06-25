<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', __('Login')) | {{ setting('site_name', config('app.name')) }}</title>
    @php $_gtmId = setting('gtm_container_id'); $_ga4Id = setting('google_analytics'); @endphp
    @if(filled($_gtmId))
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ $_gtmId }}');</script>
    @elseif(filled($_ga4Id))
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $_ga4Id }}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{{ $_ga4Id }}');</script>
    @endif

    {{-- Favicons --}}
    <link rel="icon" type="image/x-icon" href="{{ asset('storage/' . setting('site_favicon')) }}">
    <link rel="apple-touch-icon" href="{{ asset('storage/' . setting('site_favicon')) }}">

    @include('frontend._partials._guest_assets')
    <link rel="stylesheet" href="{{ asset('frontend/css/auth.css') }}">
    
    @stack('styles')
</head>
<body class="@yield('body_class', 'has-body-glow')">
    @if(filled($_gtmId))
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $_gtmId }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    @endif

    <main class="auth-wrapper overflow-hidden">
        <div class="container-fluid p-0">
            <div class="row g-0 min-vh-100">
                @yield('content')
            </div>
        </div>
    </main>

    <script src="{{ asset('frontend/js/auth.js') }}"></script>
    @stack('scripts')
</body>
</html>
