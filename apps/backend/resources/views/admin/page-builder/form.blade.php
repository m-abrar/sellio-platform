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
    <title>Page Builder</title>
    <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style id="dynamic-css">
        {{ $page->css }}
    </style>
</head>
<body>

@include('admin.alert')

<button id="savePage">Save Page</button>
<div id="gjs">{!! $page->html !!}</div>

<script>
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var savePageUrl = "{{ route('admin.page-builder.update', ['id' => $page->id]) }}";
    var pageCSS = `{!! $page->css !!}`;
</script>

<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-blocks-basic"></script>

<script>
    var editor = grapesjs.init({
        container: '#gjs',
        height: '100vh',
        fromElement: true,
        storageManager: false,
        plugins: ['gjs-blocks-basic'],
        pluginsOpts: { 'gjs-blocks-basic': {} },
    });

    // Apply saved CSS to GrapesJS editor
    if (pageCSS) {
        editor.setStyle(pageCSS);
    }
</script>

{{-- Load Widgets --}}
<!-- @include('admin.page-builder.widgets.testimonial-widget') -->
@include('admin.page-builder.widgets.cta-widget')
@include('admin.page-builder.widgets.feature-box-widget')
@include('admin.page-builder.widgets.hero-section.load')
@include('admin.page-builder.widgets.dynamic-testimonials-widget')

<script>

    // Save Page to Database
    document.getElementById('savePage').addEventListener('click', function () {
        var html = editor.getHtml();
        var css = editor.getCss();

        fetch(savePageUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify({ html: html, css: css })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => {
            console.error("Error saving page:", error);
            alert("Failed to save the page. Please try again.");
        });
    });
</script>

</body>
</html>
