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

    document.querySelectorAll('.terminal-body').forEach((terminal) => {
        terminal.scrollTop = terminal.scrollHeight;

        const observer = new MutationObserver(() => {
            terminal.scrollTop = terminal.scrollHeight;
        });

        observer.observe(terminal, { childList: true, subtree: true, characterData: true });
    });
});
