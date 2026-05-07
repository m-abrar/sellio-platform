{{--
    Administrative Content Widget: Hero Section Orchestration
    
    This component registers the high-impact Hero Section block within 
    the Page Builder environment. It dynamically renders the 
    corresponding view fragment, facilitating the deployment of 
    premium above-the-fold content for platform landing pages.
    
    @context Page Builder Module
--}}
<script>
    editor.BlockManager.add('hero-section-widget', {
        label: 'Hero Section',
        category: 'Widgets',
        content: `{!! view('admin.page-builder.widgets.hero-section.view')->render() !!}`
    });
</script>
