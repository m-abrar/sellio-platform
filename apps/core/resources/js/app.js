import './bootstrap';
import './echo';

// 1. Frameworks & Libraries
import jQuery from 'jquery';
import Alpine from 'alpinejs';
import AOS from 'aos';
import 'bootstrap';
import flatpickr from "flatpickr";


// Set Global Scope
window.$ = window.jQuery = jQuery;
window.Alpine = Alpine;
window.AOS = AOS;
window.flatpickr = flatpickr;

/**
 * Optimized Global UI Logic
 */
const AppJS = {
    /**
     * Remove 'no-js' class and add 'js' to <html>
     * Fixes the Flash of Unstyled Content (FOUC) and handles layout direction
     */
    initDocumentState() {
        document.documentElement.classList.replace('no-js', 'js');
    },

    /**
     * Initialize AOS Animation Suite
     */
    initAnimations() {
        if (window.AOS) {
            window.AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                disable: 'mobile',
                mirror: false
            });
        }
    },

    /**
     * Global Event Listeners
     */
    bindEvents() {
        // Handle Livewire navigation if present
        document.addEventListener('livewire:navigated', () => {
            this.initAnimations();
        });

        $(() => {
            this.initAnimations();
            // Add high-level jQuery UI interactions here
        });
    }
};

// Execute Core Logic
AppJS.initDocumentState();
AppJS.bindEvents();

// Start Alpine last to ensure DOM and listeners are ready
Alpine.start();

/**
 * Global Helpers
 */
window.refreshAnimations = () => {
    if (window.AOS) window.AOS.refresh();
};


// In resources/js/app.js
const adminBar = document.getElementById('admin-bar');
if (adminBar) {
    const adjustPadding = () => document.body.style.paddingTop = `${adminBar.offsetHeight}px`;
    adjustPadding();
    window.addEventListener('resize', adjustPadding);
}