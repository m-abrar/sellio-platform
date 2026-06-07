<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Error | Sellio </title>
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-400.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-600.css" rel="stylesheet">
    <link href="/vendor/npm/fontsource/plus-jakarta-sans-800.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: radial-gradient(circle at top left, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
        }
        .card {
            max-width: 42rem;
            width: 100%;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 32px;
            padding: 3rem;
            box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .icon-wrap { position: relative; display: inline-block; margin-bottom: 2rem; }
        .icon-box {
            width: 6rem; height: 6rem; background: #fff; border-radius: 1.5rem;
            display: flex; align-items: center; justify-content: center; margin: 0 auto;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,.1);
        }
        .icon-badge {
            position: absolute; bottom: -.5rem; right: -.5rem; width: 2.5rem; height: 2.5rem;
            background: #ef4444; border-radius: 1rem; border: 4px solid #fff;
            display: flex; align-items: center; justify-content: center;
        }
        h1 { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem; }
        p { color: #475569; font-size: 1.125rem; line-height: 1.6; max-width: 28rem; margin: 0 auto 2rem; }
        .btn {
            background: #0f172a; color: #fff; border: 0; border-radius: 1rem;
            padding: 1rem 2rem; font-weight: 700; cursor: pointer;
            box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2);
        }
        .btn:hover { background: #1e293b; }
        .code { color: #0f172a; background: #f1f5f9; padding: .125rem .5rem; border-radius: .25rem; }
        .footer { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(226,232,240,.6); color: #64748b; font-size: .875rem; }
        .brand { margin-top: 2rem; text-align: center; color: #94a3b8; font-size: .875rem; }
    </style>
</head>
<body>
    <div>
        <div class="card">
            <div class="icon-wrap">
                <div class="icon-box">
                    <svg width="48" height="48" class="text-slate-400" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                    </svg>
                </div>
                <div class="icon-badge">
                    <svg width="20" height="20" fill="none" stroke="#fff" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
            </div>

            <h1>Connection Refused</h1>
            <p>Sellio was unable to establish a secure link with the database cluster. This is typically a temporary service disruption.</p>

            <button type="button" class="btn" onclick="window.location.reload()">Retry Connection</button>
            <div class="footer">
                Diagnostic Code: <span class="code">ERR_DB_CON_REFUSED</span>
            </div>
        </div>
        <p class="brand">Powered by <strong>Sellio Core 12.0</strong></p>
    </div>
</body>
</html>
