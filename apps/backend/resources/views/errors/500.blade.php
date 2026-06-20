<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error | Sellio</title>
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-400.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-600.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-800.css" rel="stylesheet">
    <link href="/vendor/errors/error-standalone.css" rel="stylesheet">
</head>
<body>
    <div class="wrap">
        <div class="card">
            <div class="icon-row">
                <div class="icon-box icon-box--500">
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
