<div class="position-relative my-4 my-md-5">
    <hr class="text-muted opacity-25">
    <span class="position-absolute top-50 start-50 translate-middle px-3 py-1 rounded-2 small text-muted fw-semibold auth-divider-badge" style="background: #fff; border: 1px solid rgba(15,23,42,.07);">
        {{ __('Or continue with') }}
    </span>
</div>

<div class="row g-3">
    <div class="col-6">
        <a href="{{ route('login.social', 'google') }}"
           class="btn btn-outline-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
            <span class="small">{{ __('Google') }}</span>
        </a>
    </div>
    <div class="col-6">
        <a href="{{ route('login.social', 'facebook') }}"
           class="btn btn-outline-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
            </svg>
            <span class="small">{{ __('Facebook') }}</span>
        </a>
    </div>
</div>
