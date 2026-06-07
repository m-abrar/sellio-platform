<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Login')</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        :root {
            --color-primary: #007bff;
            --color-primary-hover: #0056b3;
            --color-accent: #ffc107;
            --color-bg-light: #f5f7f9;
            --color-text-dark: #343a40; 
            --shadow-soft: 0 4px 10px rgba(0, 0, 0, 0.05); 
            --radius-card: 0.8rem;
        }
        body {
            background-color: var(--color-bg-light);
            font-family: var(--primary-font, 'Inter', sans-serif);
            color: var(--color-text-dark);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .auth-card {
            width: 100%;
            max-width: 420px;
            padding: 2rem;
            box-shadow: var(--shadow-soft);
            border-radius: var(--radius-card); 
            background-color: white;
        }
    </style>
</head>
<body>
    <div class="auth-card">
        <div class="text-center mb-4">
             <div class="sidebar-heading m-0 d-inline-block">
                <i class="bi bi-tag-fill me-2 fs-4" style="color: var(--color-accent);"></i> 
                <span class="fs-4">Listing Pro</span>
            </div>
        </div>

        @yield('content')
    </div>
</body>
</html>
