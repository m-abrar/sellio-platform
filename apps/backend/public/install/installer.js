document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-password-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-password-toggle');
            const input = targetId ? document.getElementById(targetId) : null;

            if (!input) {
                return;
            }

            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            button.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
            button.innerHTML = isHidden
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';
        });
    });

    document.querySelectorAll('[data-copy-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-copy-target');
            const target = targetId ? document.getElementById(targetId) : null;

            if (!target) {
                return;
            }

            const text = target.textContent || '';
            const restoreLabel = button.innerHTML;

            const markCopied = () => {
                button.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copied';
                setTimeout(() => { button.innerHTML = restoreLabel; }, 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(markCopied).catch(() => {});
            } else {
                const scratch = document.createElement('textarea');
                scratch.value = text;
                scratch.style.position = 'fixed';
                scratch.style.opacity = '0';
                document.body.appendChild(scratch);
                scratch.select();
                document.execCommand('copy');
                document.body.removeChild(scratch);
                markCopied();
            }

            const checkbox = document.getElementById('api_url_copied');
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    });

    document.querySelectorAll('.terminal-body').forEach((terminal) => {
        terminal.scrollTop = terminal.scrollHeight;

        const observer = new MutationObserver(() => {
            terminal.scrollTop = terminal.scrollHeight;
        });

        observer.observe(terminal, { childList: true, subtree: true, characterData: true });
    });
});
