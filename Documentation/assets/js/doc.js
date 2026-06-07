(function () {
    const body = document.body;
    const sidebar = document.getElementById('doc-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const menuBtn = document.querySelector('.doc-menu-btn');
    const backToTop = document.querySelector('.back-to-top');
    const progressBar = document.querySelector('.reading-progress-bar');
    const navLinks = document.querySelectorAll('.nav-item a');
    const sections = document.querySelectorAll('.doc-section');

    function setSidebarOpen(open) {
        body.classList.toggle('sidebar-open', open);

        if (overlay) {
            overlay.classList.toggle('is-visible', open);
            overlay.hidden = !open;
        }

        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuBtn.innerHTML = open
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        }
    }

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            setSidebarOpen(!body.classList.contains('sidebar-open'));
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => setSidebarOpen(false));
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                setSidebarOpen(false);
            }
        });
    });

    window.showTab = function showTab(tabId, button) {
        document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));

        const panel = document.getElementById(tabId);
        if (panel) {
            panel.classList.add('active');
        }

        if (button) {
            button.classList.add('active');
        }
    };

    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ['Marketplace', 'SaaS Engine', 'Multi-Vertical', 'Modular'];
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const currentWord = words[wordIndex];

            if (deleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentWord.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            }

            setTimeout(type, deleting ? 45 : 120);
        }

        type();
    }

    function updateScrollState() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle('is-visible', scrollTop > 480);
            backToTop.hidden = scrollTop <= 480;
        }

        let current = sections[0]?.getAttribute('id') || '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 160;
            if (scrollTop >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const item = link.parentElement;
            const href = link.getAttribute('href') || '';
            item?.classList.toggle('active', href === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 769px)').matches) {
            setSidebarOpen(false);
        }
    });
})();
