{{--
    Administrative Content Widget: Dynamic Testimonials
    
    This component registers an advanced testimonial section within the 
    Page Builder ecosystem. It orchestrates social proof fragments, 
    allowing administrators to define display counts and skin motifs 
    (light/dark) through a reactive trait-based architecture.
    
    @context Page Builder Module
--}}
<script>


// ✅ REGISTER TESTIMONIALS COMPONENT
editor.DomComponents.addType('testimonials-section', {
        model: {
            defaults: {
                tagName: 'section',
                classes: ['testimonials-section'],
                attributes: {
                    'data-items': '3',
                    'data-skin': 'light'
                },
                propagate: ['items', 'skin'],  // ✅ Ensure traits update properly
                components: `
                    <h2 class="testimonial-title" data-gjs-editable="true">Customer Testimonials</h2>
                    [[section-testimonials-dynamic]]
                `,
                traits: [
                    {
                        name: 'items',
                        label: 'Number of Items',
                        type: 'number',
                        min: 1,
                        max: 10,
                        changeProp: 1  // ✅ This makes sure UI updates
                    },
                    {
                        name: 'skin',
                        label: 'Skin Type',
                        type: 'select',
                        options: [
                            { value: 'light', name: 'Light' },
                            { value: 'dark', name: 'Dark' }
                        ],
                        changeProp: 1
                    }
                ]
            },
            init() {
                // ✅ Load saved attributes when the component is selected
                this.listenTo(this, 'change:items change:skin', this.updateAttributes);
            },
            updateAttributes() {
                this.setAttributes({
                    'data-items': this.get('items'),
                    'data-skin': this.get('skin')
                });
            }
        },
        view: {
            onRender() {
                var model = this.model;
                this.listenTo(model, 'change:items change:skin', function () {
                    model.setAttributes({
                        'data-items': model.get('items'),
                        'data-skin': model.get('skin')
                    });
                });
            }
        }
    });

    // ✅ REGISTER WIDGET IN SIDEBAR
    editor.BlockManager.add('dynamic-testimonials-section', {
        label: 'Dynamic Testimonials',
        category: 'Sections',
        content: { type: 'testimonials-section' }
    });

    // ✅ ENSURE TRAITS ARE VISIBLE WHEN COMPONENT IS LOADED
    editor.on('component:selected', function (model) {
        if (model.get('type') === 'testimonials-section') {
            model.trigger('change:traits');  // ✅ Force show traits
        }
    });

</script>
