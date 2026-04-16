<div id="feature-box-widget">
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            if (typeof grapesjs !== "undefined") {
                var editor = grapesjs.editors[0]; // Get existing GrapesJS instance

                if (editor) {
                    // ✅ REGISTER CUSTOM FEATURE BOX BLOCK
                    editor.BlockManager.add('feature-box-block', {
                        label: 'Feature Box',
                        category: 'Widgets',
                        content: { type: 'feature-box' }
                    });

                    // ✅ CREATE CUSTOM FEATURE BOX COMPONENT
                    editor.DomComponents.addType('feature-box', {
                        model: {
                            defaults: {
                                tagName: 'div',
                                classes: ['feature-box'],
                                components: `
                                    <div class="feature-box-wrapper">
                                        <img class="feature-icon" src="https://placehold.co/80x80">
                                        <h3 class="feature-title">Awesome Feature</h3>
                                        <p class="feature-description">This feature helps you achieve greatness!</p>
                                        <a href="#" class="feature-button">Learn More</a>
                                    </div>
                                `,
                                traits: [
                                    { name: 'icon', label: 'Icon URL', type: 'text', changeProp: 1 },
                                    { name: 'title', label: 'Title', type: 'text', changeProp: 1 },
                                    { name: 'description', label: 'Description', type: 'textarea', changeProp: 1 },
                                    { name: 'button_text', label: 'Button Text', type: 'text', changeProp: 1 },
                                    { name: 'button_link', label: 'Button URL', type: 'text', changeProp: 1 }
                                ],
                                styles: `
                                    .feature-box { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fff; }
                                    .feature-icon { width: 80px; height: 80px; display: block; margin: 0 auto; }
                                    .feature-title { font-size: 20px; font-weight: bold; margin-top: 10px; }
                                    .feature-description { font-size: 14px; color: #666; margin: 10px 0; }
                                    .feature-button { display: inline-block; padding: 10px 15px; background: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                                    .feature-button:hover { background: #0056b3; }
                                `,
                            }
                        },
                        view: {
                            onRender() {
                                var model = this.model;
                                this.listenTo(model, 'change:icon change:title change:description change:button_text change:button_link', function () {
                                    this.el.querySelector('.feature-icon').src = model.get('icon');
                                    this.el.querySelector('.feature-title').innerText = model.get('title');
                                    this.el.querySelector('.feature-description').innerText = model.get('description');
                                    this.el.querySelector('.feature-button').innerText = model.get('button_text');
                                    this.el.querySelector('.feature-button').href = model.get('button_link');
                                });
                            }
                        }
                    });
                }
            }
        });
    </script>
</div>
