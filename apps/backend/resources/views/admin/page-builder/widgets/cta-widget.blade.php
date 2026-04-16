<script>
    document.addEventListener("DOMContentLoaded", function () {
        if (typeof grapesjs !== "undefined") {
            var editor = grapesjs.editors[0]; // Get existing GrapesJS instance

            if (editor) {
                // ✅ REGISTER CUSTOM CTA BLOCK
                editor.BlockManager.add('cta-block', {
                    label: 'Call to Action',
                    category: 'Widgets',
                    content: { type: 'cta' }
                });

                // ✅ CREATE CUSTOM CTA COMPONENT
                editor.DomComponents.addType('cta', {
                    model: {
                        defaults: {
                            tagName: 'div',
                            classes: ['cta-block'],
                            components: `
                                <div class="cta-wrapper">
                                    <h2 class="cta-heading">Join Us Today!</h2>
                                    <p class="cta-text">Sign up now and get exclusive benefits.</p>
                                    <a href="#" class="cta-button">Get Started</a>
                                </div>
                            `,
                            traits: [
                                { name: 'heading', label: 'Heading', type: 'text', changeProp: 1 },
                                { name: 'text', label: 'Description', type: 'textarea', changeProp: 1 },
                                { name: 'button_text', label: 'Button Text', type: 'text', changeProp: 1 },
                                { name: 'button_link', label: 'Button URL', type: 'text', changeProp: 1 }
                            ],
                            styles: `
                                .cta-block { text-align: center; padding: 30px; background: #007BFF; color: white; border-radius: 10px; }
                                .cta-heading { font-size: 24px; margin-bottom: 10px; }
                                .cta-text { font-size: 16px; margin-bottom: 15px; }
                                .cta-button { background: white; color: #007BFF; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; }
                                .cta-button:hover { background: #f0f0f0; }
                            `,
                        }
                    },
                    view: {
                        onRender() {
                            var model = this.model;
                            this.listenTo(model, 'change:heading change:text change:button_text change:button_link', function () {
                                this.el.querySelector('.cta-heading').innerText = model.get('heading');
                                this.el.querySelector('.cta-text').innerText = model.get('text');
                                this.el.querySelector('.cta-button').innerText = model.get('button_text');
                                this.el.querySelector('.cta-button').href = model.get('button_link');
                            });
                        }
                    }
                });
            }
        }
    });
</script>
