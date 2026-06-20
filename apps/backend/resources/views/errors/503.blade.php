<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Down for Maintenance | Sellio</title>
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-400.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-600.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-800.css" rel="stylesheet">
    <link href="/vendor/errors/error-standalone.css" rel="stylesheet">
</head>
<body>
    <div class="wrap">
        <div class="card">
            <div class="icon-row">
                <div class="icon-box icon-box--503">
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
