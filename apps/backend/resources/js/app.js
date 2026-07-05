import './bootstrap';

// 1. Frameworks & Libraries
import jQuery from 'jquery';
import Alpine from 'alpinejs';
import AOS from 'aos';
import 'bootstrap';
import { Tab } from 'bootstrap';
import flatpickr from "flatpickr";


// Set Global Scope
window.$ = window.jQuery = jQuery;
window.Alpine = Alpine;
window.AOS = AOS;
window.flatpickr = flatpickr;

import('./echo').catch((error) => {
    console.warn('Realtime client was not initialized.', error);
});

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
        document.body?.classList.replace('no-js', 'js');
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
    initHeroSearchTabs() {
        const tabList = document.getElementById('searchTab');
        if (!tabList) {
            return;
        }

        tabList.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]').forEach((trigger) => {
            Tab.getOrCreateInstance(trigger);
        });
    },

    bindEvents() {
        // Handle Livewire navigation if present
        document.addEventListener('livewire:navigated', () => {
            this.initAnimations();
            this.initHeroSearchTabs();
            this.initNavbarScroll();
            this.initAdminBarOffset();
        });

        $(() => {
            this.initAnimations();
            this.initHeroSearchTabs();
            this.initNavbarScroll();
            this.initAdminBarOffset();
        });
    },

    initNavbarScroll() {
        const nav = document.getElementById('mainNav');
        if (!nav || nav.dataset.navbarScrollBound === 'true') {
            return;
        }

        nav.dataset.navbarScrollBound = 'true';

        const isHome = document.body.classList.contains('frontend-page--home');
        const header = nav.closest('.main-header');
        const threshold = 24;

        const updateNavbar = () => {
            const scrolled = window.scrollY > threshold;

            nav.classList.toggle('scrolled', scrolled);

            if (isHome) {
                nav.classList.toggle('navbar-transparent', !scrolled);
                nav.classList.toggle('navbar-light', true);
                header?.classList.toggle('main-header--pinned', scrolled);
            }
        };

        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    },

    initAdminBarOffset() {
        const adminBar = document.getElementById('admin-bar');
        if (!adminBar) {
            document.body.style.removeProperty('--admin-bar-offset');
            return;
        }

        // Set the custom property directly on <body> (not <html>) — the
        // body.has-admin-bar CSS rule declares this same property on body
        // itself, so an inherited value from <html> would be shadowed by
        // it. An inline style on body always wins over that stylesheet
        // rule, letting the real measured height take effect instead of
        // the fixed --admin-bar-height fallback.
        const applyOffset = () => {
            const height = adminBar.offsetHeight;
            document.body.style.setProperty('--admin-bar-offset', `${height}px`);
            document.body.classList.add('has-admin-bar');
        };

        applyOffset();
        window.addEventListener('resize', applyOffset, { passive: true });
    }
};

// Execute Core Logic
AppJS.initDocumentState();
AppJS.initAdminBarOffset();
AppJS.bindEvents();

// Start Alpine after Blade-pushed scripts have had a chance to register page components.
const startAlpine = () => {
    if (window.__sellioAlpineStarted) {
        return;
    }

    window.__sellioAlpineStarted = true;
    Alpine.start();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAlpine);
} else {
    window.setTimeout(startAlpine, 0);
}

/**
 * Global Helpers
 */
window.refreshAnimations = () => {
    if (window.AOS) window.AOS.refresh();
};
