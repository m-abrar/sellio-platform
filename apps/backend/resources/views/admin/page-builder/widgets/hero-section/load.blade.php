<script>
    editor.BlockManager.add('hero-section-widget', {
        label: 'Hero Section',
        category: 'Widgets',
        content: `{!! view('admin.page-builder.widgets.hero-section.view')->render() !!}`
    });
</script>
