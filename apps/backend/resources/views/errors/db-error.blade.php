<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Error | Sellio </title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .gradient-bg {
            background: radial-gradient(circle at top left, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
        }
        .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
    </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center p-6">
    <div class="max-w-2xl w-full">
        <div class="glass rounded-[32px] p-12 shadow-2xl text-center space-y-8 relative overflow-hidden">
            <!-- Decorative Accent -->
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <!-- Icon Stack -->
            <div class="relative inline-block">
                <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto transition-transform hover:scale-105 duration-300">
                    <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                    </svg>
                </div>
                <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
            </div>

            <!-- Content -->
            <div class="space-y-4">
                <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Connection Refused
                </h1>
                <p class="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
                    Sellio was unable to establish a secure link with the database cluster. This is typically a temporary service disruption.
                </p>
            </div>

            <!-- Action Area -->
            <div class="pt-6 space-y-4">
                <button onclick="window.location.reload()" class="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98]">
                    Retry Connection
                </button>
                <div class="text-sm text-slate-500 font-medium">
                    Diagnostic Code: <span class="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">ERR_DB_CON_REFUSED</span>
                </div>
            </div>

            <!-- Footer Details -->
            <div class="pt-8 border-t border-slate-200/60 mt-8">
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        MySQL Instance Down
                    </div>
                    <div class="hidden sm:block text-slate-300">|</div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Admin Portal Offline
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Subtle Branding -->
        <p class="mt-8 text-center text-slate-400 text-sm font-medium">
            Powered by <span class="text-slate-500">Sellio Core 12.0</span>
        </p>
    </div>
</body>
</html>
