/**
 * Infrastructure Module: Global Settings Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Orchestrate high-fidelity card entry animation sequence
        const statCards = $('.stat-card');
        if (statCards.length > 0) {
            statCards.each(function(index) {
                const card = $(this);
                // Initial hidden state established via CSS class 'reveal-on-load'
                // This script handles the staggered transition
                setTimeout(() => {
                    card.addClass('revealed');
                }, index * 80);
            });
        }
    });
})(jQuery);
