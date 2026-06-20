<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Down for Maintenance | Sellio</title>
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
            background: #fffbeb;
            border: 1.5px solid #fde68a;
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d97706;
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
        .pulse-dot {
            display: inline-flex;
            align-items: center;
            gap: .5rem;
            background: #fffbeb;
            border: 1px solid #fde68a;
            color: #92400e;
            font-size: .8rem;
            font-weight: 700;
            padding: .4rem 1rem;
            border-radius: 999px;
            margin-bottom: 1.5rem;
        }
        .dot {
            width: .5rem; height: .5rem;
            background: #d97706;
            border-radius: 50%;
            animation: blink 1.4s infinite;
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span class="code">503</span>
            </div>

            <div class="pulse-dot">
                <span class="dot"></span> Maintenance in progress
            </div>

            <h1>Down for Maintenance</h1>
            <p>We're making some improvements. Sellio will be back shortly. Thanks for your patience.</p>

            <button class="btn btn-dark" onclick="window.location.reload()">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Check Again
            </button>
        </div>
        <p class="brand">Powered by <strong>Sellio v{{ config('app.version', '2.4.0') }}</strong></p>
    </div>
</body>
</html>
