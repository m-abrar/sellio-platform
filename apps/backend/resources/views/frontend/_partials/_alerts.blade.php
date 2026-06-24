@php
    $frontendAlerts = collect();

    if (session('success')) {
        $frontendAlerts->push([
            'type' => 'success',
            'icon' => 'bi-check-circle-fill',
            'title' => __('Success'),
            'message' => session('success'),
        ]);
    }

    if (session('warning')) {
        $frontendAlerts->push([
            'type' => 'warning',
            'icon' => 'bi-exclamation-triangle-fill',
            'title' => __('Heads up'),
            'message' => session('warning'),
        ]);
    }

    if (session('error')) {
        $frontendAlerts->push([
            'type' => 'danger',
            'icon' => 'bi-x-circle-fill',
            'title' => __('Something went wrong'),
            'message' => session('error'),
        ]);
    }

    if (session('status')) {
        $statusMessage = match (session('status')) {
            'profile-updated'          => __('Your profile has been successfully updated!'),
            'password-updated'         => __('Your password has been successfully changed!'),
            'avatar-updated'           => __('Your avatar has been successfully updated!'),
            'verification-link-sent'   => __('A new verification link has been sent to your email address.'),
            'account-deleted'          => __('Your account has been deleted.'),
            default                    => session('status'),
        };

        $frontendAlerts->push([
            'type' => 'success',
            'icon' => 'bi-check-circle-fill',
            'title' => __('Success'),
            'message' => $statusMessage,
        ]);
    }

    if ($errors->any()) {
        $frontendAlerts->push([
            'type' => 'danger',
            'icon' => 'bi-exclamation-circle-fill',
            'title' => trans_choice(
                ':count issue needs attention|:count issues need attention',
                $errors->count(),
                ['count' => $errors->count()]
            ),
            'errors' => $errors->all(),
        ]);
    }
@endphp

@if($frontendAlerts->isNotEmpty())
<div class="frontend-toast-stack" role="status" aria-live="polite" aria-atomic="false">
    @foreach($frontendAlerts as $alert)
        <div class="frontend-alert frontend-alert--{{ $alert['type'] }}"
             role="alert"
             data-alert-type="{{ $alert['type'] }}">

            <span class="frontend-alert__icon" aria-hidden="true">
                <i class="bi {{ $alert['icon'] }}"></i>
            </span>

            <div class="frontend-alert__body">
                <p class="frontend-alert__title mb-1">{{ $alert['title'] }}</p>

                @if(! empty($alert['errors']))
                    @if(count($alert['errors']) > 1)
                        <ul class="frontend-alert__list mb-0">
                            @foreach($alert['errors'] as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    @else
                        <p class="frontend-alert__message mb-0">{{ $alert['errors'][0] }}</p>
                    @endif
                @else
                    <p class="frontend-alert__message mb-0">{{ $alert['message'] }}</p>
                @endif
            </div>

            <button type="button" class="frontend-alert__close" aria-label="{{ __('Dismiss') }}">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    @endforeach
</div>

@once
@push('scripts')
<script>
(function () {
    var AUTO_MS = 5000;

    function dismiss(el) {
        el.classList.add('is-dismissing');
        setTimeout(function () { if (el.parentNode) el.remove(); }, 300);
    }

    document.querySelectorAll('.frontend-toast-stack .frontend-alert').forEach(function (toast) {
        var btn = toast.querySelector('.frontend-alert__close');
        if (btn) {
            btn.addEventListener('click', function () { dismiss(toast); });
        }

        var type = toast.dataset.alertType;
        if (type === 'success' || type === 'warning') {
            setTimeout(function () { dismiss(toast); }, AUTO_MS);
        }
    });
})();
</script>
@endpush
@endonce
@endif
