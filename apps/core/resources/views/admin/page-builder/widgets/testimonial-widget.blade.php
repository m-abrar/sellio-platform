<script>
    document.addEventListener("DOMContentLoaded", function () {
        if (typeof grapesjs !== "undefined") {
            var editor = grapesjs.editors[0]; // Get existing GrapesJS instance

            if (editor) {
                // ✅ REGISTER CUSTOM TESTIMONIAL BLOCK
                editor.BlockManager.add('testimonial-block', {
                    label: 'Testimonial',
                    category: 'Widgets',
                    content: { type: 'testimonial' }
                });

                // ✅ CREATE CUSTOM TESTIMONIAL COMPONENT
                editor.DomComponents.addType('testimonial', {
                    model: {
                        defaults: {
                            tagName: 'div',
                            classes: ['testimonial'],
                            components: `
                                <div class="testimonial-wrapper">
                                    <img class="testimonial-img" src="https://placehold.co/80x80">
                                    <p class="testimonial-text">"This is a great product!"</p>
                                    <h4 class="testimonial-name">John Doe</h4>
                                </div>
                            `,
                            traits: [
                                { name: 'name', label: 'Name', type: 'text', changeProp: 1 },
                                { name: 'text', label: 'Testimonial', type: 'textarea', changeProp: 1 },
                                { name: 'image', label: 'Image URL', type: 'text', changeProp: 1 }
                            ],
                            styles: `
                                .testimonial { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9; }
                                .testimonial-img { width: 80px; height: 80px; border-radius: 50%; display: block; margin: 0 auto; }
                                .testimonial-text { font-style: italic; margin: 10px 0; }
                                .testimonial-name { font-weight: bold; }
                            `,
                        }
                    },
                    view: {
                        onRender() {
                            var model = this.model;
                            this.listenTo(model, 'change:name change:text change:image', function () {
                                this.el.querySelector('.testimonial-name').innerText = model.get('name');
                                this.el.querySelector('.testimonial-text').innerText = model.get('text');
                                this.el.querySelector('.testimonial-img').src = model.get('image');
                            });
                        }
                    }
                });
            }
        }
    });
</script>
