@php
    $viteManifestExists = file_exists(public_path('build/manifest.json'));
@endphp

@if ($viteManifestExists)
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@else
    {{-- Shipped vendor assets so auth pages stay styled before npm run build on the host --}}
    <link rel="stylesheet" href="{{ asset('vendor/npm/fontsource/bundle.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/npm/bootstrap/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/npm/bootstrap-icons/bootstrap-icons.css') }}">
@endif

<link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
