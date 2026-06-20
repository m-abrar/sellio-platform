document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.password-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const container = this.closest('.form-icon-group');
            const input = container.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('bi-eye');
                this.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('bi-eye-slash');
                this.classList.add('bi-eye');
            }
        });
    });
});
