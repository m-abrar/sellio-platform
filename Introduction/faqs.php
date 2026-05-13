<div class="container reveal" data-animation="animate__fadeIn">
    <div class="text-center mb-5">
        <h6 class="text-sellio fw-bold text-uppercase mb-3">Answers & Insights</h6>
        <h2 class="display-5 fw-800">Frequently Asked <span class="text-sellio">Questions</span></h2>
        <p class="text-muted lead mx-auto" style="max-width: 600px;">Everything you need to know about the Sellio ecosystem and deployment.</p>
    </div>
    <div class="row justify-content-center">
        <div class="col-lg-9">
            <div class="accordion accordion-premium" id="faqAccordion">
                <?php foreach($faqs as $index => $faq): ?>
                <div class="accordion-item mb-3 border-0 rounded-4 overflow-hidden shadow-premium-sm transition-all hover-translate-y">
                    <h2 class="accordion-header">
                        <button class="accordion-button <?php echo $index !== 0 ? 'collapsed' : ''; ?> fw-bold py-4 px-4 bg-white text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#faq<?php echo $index; ?>">
                            <span class="me-3 text-sellio opacity-50">0<?php echo $index + 1; ?>.</span>
                            <?php echo $faq['q']; ?>
                        </button>
                    </h2>
                    <div id="faq<?php echo $index; ?>" class="accordion-collapse collapse <?php echo $index === 0 ? 'show' : ''; ?>" data-bs-parent="#faqAccordion">
                        <div class="accordion-body text-muted px-4 pb-4 pt-0 bg-white">
                            <div class="pt-3 border-top">
                                <?php echo $faq['a']; ?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<style>
    .accordion-premium .accordion-button {
        box-shadow: none;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }
    .accordion-premium .accordion-button:not(.collapsed) {
        color: var(--primary-sellio);
        background-color: #fff;
    }
    .accordion-premium .accordion-button::after {
        background-size: 1rem;
        transition: transform 0.3s ease;
        filter: grayscale(1) opacity(0.5);
    }
    .accordion-premium .accordion-button:not(.collapsed)::after {
        filter: none;
        opacity: 1;
    }
    .accordion-premium .accordion-item {
        border: 1px solid rgba(0,0,0,0.05) !important;
        transition: all 0.3s ease;
    }
    .accordion-premium .accordion-item:hover {
        border-color: var(--primary-sellio) !important;
        box-shadow: var(--shadow-executive) !important;
    }
</style>