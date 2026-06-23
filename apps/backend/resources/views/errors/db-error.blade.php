<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Error | Sellio</title>
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-400.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-600.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-800.css" rel="stylesheet">
    <link href="/vendor/errors/error-standalone.css" rel="stylesheet">
</head>
<body>
    <div class="wrap">
        <div class="card">
            <div class="icon-row">
                <div class="icon-box icon-box--db">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                </div>
                <span class="code">DB</span>
            </div>

            <h1>Database Unavailable</h1>
            <p>Sellio could not connect to the database. This is usually a temporary disruption — please try again in a moment.</p>

            <div class="actions">
                <button class="btn btn-dark" onclick="window.location.reload()">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry Connection
                </button>
            </div>
        </div>
        <p class="brand">Powered by <strong>Sellio v{{ config('app.version', '2.4.0') }}</strong></p>
    </div>
</body>
</html>
