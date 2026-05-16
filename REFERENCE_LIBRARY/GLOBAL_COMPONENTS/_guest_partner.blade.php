<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Login')</title>

    {{-- Bootstrap & Icons CDN (same as app layout) --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
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
            font-family: 'Inter', sans-serif;
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

        {{-- Authentication content section --}}
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>