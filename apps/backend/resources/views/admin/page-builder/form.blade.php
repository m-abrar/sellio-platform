{{--
    Administrative Content: High-Fidelity Page Composition Engine
    
    This view serves as the primary visual orchestration environment for 
    dynamic landing pages. It leverages the GrapesJS framework to 
    provide a professional-grade drag-and-drop experience, integrating 
    custom platform widgets (CTA, Features, Hero, Testimonials) while 
    maintaining real-time CSS/HTML persistence.
    
    @context Page Builder Module
    @variables PageBuilder $page The page model being composed.
--}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Page Builder') }} | {{ $page->title }}</title>
    
    <!-- Premium Font Orchestration -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    
    <!-- GrapesJS Core & Plugins -->
    <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css">
    <script src="https://unpkg.com/grapesjs"></script>
    <script src="https://unpkg.com/grapesjs-blocks-basic"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        :root {
            --primary: #46a5ac;
            --primary-dark: #2c6b70;
            --dark: #0f172a;
            --dark-navy: #0c1222;
            --surface: #ffffff;
            --border: #e2e8f0;
            --font-main: 'Inter', sans-serif;
            --font-heading: 'Outfit', sans-serif;
        }

        body, html {
            height: 100%;
            margin: 0;
            overflow: hidden;
            font-family: var(--font-main);
            background-color: var(--dark-navy);
        }

        /* --- Elite Builder Top Bar --- */
        .builder-header {
            height: 60px;
            background: var(--dark-navy);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 25px;
            z-index: 1000;
            position: relative;
        }

        .builder-brand {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .btn-builder-back {
            color: #cbd5e1; /* Lighter Slate 300 for better contrast */
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-builder-back:hover {
            color: #ffffff;
            transform: translateX(-3px);
        }

        .builder-title {
            color: #ffffff;
            font-family: var(--font-heading);
            font-size: 1.1rem;
            margin: 0;
            border-left: 1px solid rgba(255,255,255,0.2);
            padding-left: 15px;
        }

        .builder-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn-builder-save {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 24px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(70, 165, 172, 0.3);
        }

        .btn-builder-save:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(70, 165, 172, 0.4);
        }

        .btn-builder-save:active {
            transform: translateY(0);
        }

        .btn-builder-save.is-saving {
            opacity: 0.7;
            pointer-events: none;
        }

        /* --- GrapesJS Skin Polish --- */
        .gjs-cv-canvas {
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #f1f5f9;
        }

        .gjs-one-bg {
            background-color: var(--dark-navy) !important;
        }

        .gjs-two-color {
            color: #94a3b8 !important;
        }

        .gjs-three-color {
            color: var(--primary) !important;
        }

        .gjs-four-color, .gjs-four-color-h:hover {
            color: #ffffff !important;
        }

        .gjs-pn-panels {
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }

        .gjs-block {
            background-color: rgba(255,255,255,0.03) !important;
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
            padding: 15px !important;
            color: #cbd5e1 !important;
        }

        .gjs-block:hover {
            border-color: var(--primary) !important;
            color: var(--primary) !important;
            background-color: rgba(255,255,255,0.05) !important;
        }

        .gjs-sm-header, .gjs-clm-header {
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            font-size: 0.75rem !important;
            color: #64748b !important;
        }

        .gjs-sm-sector-title {
            background-color: rgba(255,255,255,0.02) !important;
        }

        .gjs-field {
            background-color: rgba(0,0,0,0.2) !important;
            border-radius: 4px !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }

        #dynamic-css { display: none; }
    </style>

</head>
<body>

    <header class="builder-header">
        <div class="builder-brand">
            <a href="{{ route('admin.pages.index') }}" class="btn-builder-back">
                <i class="fas fa-chevron-left"></i> {{ __('Exit') }}
            </a>
            <h1 class="builder-title">{{ $page->title }} <span class="opacity-50 ml-2" style="font-size: 0.8rem; font-family: sans-serif;">{{ __('Composition Mode') }}</span></h1>
        </div>

        <div class="builder-actions">
            <div id="save-indicator" class="mr-3 small font-weight-bold d-none" style="color: var(--primary); text-shadow: 0 0 10px rgba(70, 165, 172, 0.2);">
                <i class="fas fa-sync fa-spin mr-1"></i> SYNCING...
            </div>
            <button id="savePage" class="btn-builder-save">
                <i class="fas fa-cloud-upload-alt"></i> {{ __('Synchronize Changes') }}
            </button>
        </div>
    </header>

    <div id="gjs">{!! $page->html !!}</div>

    <script>
        var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        var savePageUrl = "{{ route('admin.page-builder.update', ['page' => $page->id]) }}";
        var pageCSS = {!! json_encode($page->css) !!};
        
        // Premium Alerts Wrapper
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#0c1222',
            color: '#fff'
        });
    </script>

    <script>
        var editor = grapesjs.init({
            container: '#gjs',
            height: 'calc(100vh - 60px)',
            fromElement: true,
            storageManager: false,
            plugins: ['gjs-blocks-basic'],
            pluginsOpts: { 'gjs-blocks-basic': {} },
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap'
                ]
            }
        });

        // Apply saved CSS to GrapesJS editor
        if (pageCSS) {
            editor.setStyle(pageCSS);
        }

        // Compatability for widgets using grapesjs.editors[0]
        window.grapesjs = window.grapesjs || {};
        window.grapesjs.editors = [editor];

        // Add Premium Blocks Styling Override
        const blockManager = editor.BlockManager;
        // You can add custom blocks here later
    </script>

    {{-- Load Widgets --}}
    @include('admin.page-builder.widgets.cta-widget')
    @include('admin.page-builder.widgets.feature-box-widget')
    @include('admin.page-builder.widgets.hero-section.load')
    @include('admin.page-builder.widgets.dynamic-testimonials-widget')

    <script>
        // Save Page to Database Orchestration
        document.getElementById('savePage').addEventListener('click', function () {
            const btn = this;
            const indicator = document.getElementById('save-indicator');
            
            var html = editor.getHtml();
            var css = editor.getCss();

            // Visual Feedback: Start
            btn.classList.add('is-saving');
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> {{ __('SAVING...') }}';
            indicator.classList.remove('d-none');

            fetch(savePageUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken
                },
                body: JSON.stringify({ html: html, css: css })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Toast.fire({
                        icon: 'success',
                        title: data.message || 'Page structure synchronized!'
                    });
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error("Error saving page:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Sync Failed',
                    text: error.message || 'Failed to save the page structure.',
                    confirmButtonColor: '#46a5ac'
                });
            })
            .finally(() => {
                // Visual Feedback: End
                btn.classList.remove('is-saving');
                btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> {{ __('Synchronize Changes') }}';
                indicator.classList.add('d-none');
            });
        });

        // Shortcut Key: Ctrl + S (GrapesJS Keymap)
        editor.Keymaps.add('save-page', 'ctrl+s', e => {
            e.preventDefault();
            document.getElementById('savePage').click();
        });
    </script>

</body>
</html>
