<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error | Sellio</title>
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-400.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-600.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-800.css" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: #f8fafc;
            background-image: radial-gradient(circle at 20% 20%, rgba(99,102,241,.06) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(99,102,241,.04) 0%, transparent 50%);
        }
        .wrap { display: flex; flex-direction: column; align-items: center; gap: 2rem; width: 100%; }
        .card {
            max-width: 32rem;
            width: 100%;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 2rem;
            padding: 3rem 2.5rem;
            text-align: center;
            box-shadow: 0 4px 24px rgba(15,23,42,.07);
        }
        .icon-row {
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.75rem;
        }
        .icon-box {
            width: 5rem;
            height: 5rem;
            background: #f1f5f9;
            border: 1.5px solid #e2e8f0;
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
        }
        .code {
            font-size: 4.5rem;
            font-weight: 900;
            line-height: 1;
            color: #0f172a;
            letter-spacing: -2px;
        }
        h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: .75rem; }
        p { color: #64748b; font-size: 1rem; line-height: 1.65; margin-bottom: 2rem; }
        .actions { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: .5rem;
            padding: .75rem 1.75rem;
            border-radius: 999px;
            font-weight: 700;
            font-size: .95rem;
            cursor: pointer;
            text-decoration: none;
            transition: all .2s;
            border: none;
        }
        .btn-dark {
            background: #0f172a;
            color: #fff;
            box-shadow: 0 4px 12px rgba(15,23,42,.2);
        }
        .btn-dark:hover { background: #1e293b; transform: translateY(-1px); }
        .btn-ghost {
            background: transparent;
            color: #475569;
            border: 1.5px solid #e2e8f0;
        }
        .btn-ghost:hover { border-color: #94a3b8; color: #0f172a; }
        .brand { color: #94a3b8; font-size: .8rem; }
        .brand strong { color: #64748b; }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            <div class="icon-row">
                <div class="icon-box">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <span class="code">500</span>
            </div>

            <h1>Server Error</h1>
            <p>Something went wrong on our end. The team has been notified. Please try again in a few moments.</p>

            <div class="actions">
                <button class="btn btn-dark" onclick="window.location.reload()">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                </button>
                <a href="/" class="btn btn-ghost">Go to Homepage</a>
            </div>
        </div>
        <p class="brand">Powered by <strong>Sellio v{{ config('app.version', '2.4.0') }}</strong></p>
    </div>
</body>
</html>
