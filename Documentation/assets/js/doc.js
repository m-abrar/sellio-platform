(function () {
    const body = document.body;
    const sidebar = document.getElementById('doc-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const menuBtn = document.querySelector('.doc-menu-btn');
    const backToTop = document.querySelector('.back-to-top');
    const progressBar = document.querySelector('.reading-progress-bar');
    const navLinks = document.querySelectorAll('.nav-item a');
    const sections = document.querySelectorAll('.doc-section');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSidebarOpen(false);
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                setSidebarOpen(false);
            }
        });
    });

    window.showTab = function showTab(tabId, button) {
        document.querySelectorAll('.tab-content').forEach((tab) => {
            tab.classList.remove('active');
            tab.setAttribute('aria-hidden', 'true');
        });

        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        const panel = document.getElementById(tabId);
        if (panel) {
            panel.classList.add('active');
            panel.setAttribute('aria-hidden', 'false');
        }

        if (button) {
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
        }
    };

    document.querySelectorAll('pre').forEach((pre) => {
        const code = pre.querySelector('code') || pre;
        const text = code.textContent?.trim() || '';
        if (!text) {
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'code-wrap';
        pre.parentNode?.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'code-copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
        wrap.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = 'Copied';
                copyBtn.classList.add('is-copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('is-copied');
                }, 1800);
            } catch {
                copyBtn.textContent = 'Failed';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 1800);
            }
        });
    });

    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement && !prefersReducedMotion) {
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
    } else if (typewriterElement) {
        typewriterElement.textContent = 'Marketplace';
    }

    function setActiveNav(id) {
        navLinks.forEach((link) => {
            const item = link.parentElement;
            const href = link.getAttribute('href') || '';
            item?.classList.toggle('active', href === `#${id}`);
        });
    }

    function updateScrollState() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        if (backToTop) {
            const show = scrollTop > 480;
            backToTop.classList.toggle('is-visible', show);
            backToTop.hidden = !show;
        }
    }

    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length) {
                    setActiveNav(visible[0].target.id);
                }
            },
            {
                rootMargin: '-20% 0px -55% 0px',
                threshold: [0, 0.15, 0.35],
            },
        );

        sections.forEach((section) => observer.observe(section));
    } else {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            let current = sections[0]?.getAttribute('id') || '';

            sections.forEach((section) => {
                if (scrollTop >= section.offsetTop - 160) {
                    current = section.getAttribute('id') || current;
                }
            });

            setActiveNav(current);
        }, { passive: true });
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 769px)').matches) {
            setSidebarOpen(false);
        }
    });
})();
