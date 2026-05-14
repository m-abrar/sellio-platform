/**
 * Administrative Marketing: Advertisement Configuration Script
 * 
 * Orchestrates the interactive elements of the advertisement form,
 * including geospatial radius feedback and UI tooltips.
 */

$(function () {
    // Initialize standard tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Radius range display synchronization
    const radiusInput = document.getElementById('radius');
    const radiusDisplay = document.getElementById('radius-display');
    
    if (radiusInput && radiusDisplay) {
        const unitLabel = radiusDisplay.getAttribute('data-unit') || 'KM';
        
        radiusInput.addEventListener('input', function() {
            radiusDisplay.textContent = this.value + ' ' + unitLabel;
        });
    }
});
