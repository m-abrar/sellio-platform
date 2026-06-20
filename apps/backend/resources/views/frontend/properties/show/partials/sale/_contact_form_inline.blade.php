<div class="card glass-surface p-4 mt-5">
    <h4 class="fw-bold mb-3"><i class="bi bi-envelope-fill me-2 text-primary-color"></i>{{ __('Inquire About This Property') }}</h4>
    <form>
        <div class="mb-3">
            <label class="form-label small fw-semibold" for="inline-contact-name">{{ __('Full Name') }}</label>
            <input id="inline-contact-name" type="text" class="form-control" placeholder="{{ __('Your full name') }}" required>
        </div>
        <div class="mb-3">
            <label class="form-label small fw-semibold" for="inline-contact-email">{{ __('Email Address') }}</label>
            <input id="inline-contact-email" type="email" class="form-control" placeholder="{{ __('you@example.com') }}" required>
        </div>
        <div class="mb-3">
            <label class="form-label small fw-semibold" for="inline-contact-phone">{{ __('Phone Number') }} <span class="text-muted fw-normal">({{ __('optional') }})</span></label>
            <input id="inline-contact-phone" type="tel" class="form-control" placeholder="{{ __('+1 (555) 000-0000') }}">
        </div>
        <div class="mb-3">
            <label class="form-label small fw-semibold" for="inline-contact-message">{{ __('Message') }}</label>
            <textarea id="inline-contact-message" class="form-control" rows="3" placeholder="{{ __('I would like to schedule a viewing or ask a question about this property.') }}" required></textarea>
        </div>
        <div class="d-grid"><button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme">{{ __('Send Message') }}</button></div>
        <p class="small text-center text-muted mt-2">{{ __('By submitting this form, you agree to our terms and privacy policy.') }}</p>
    </form>
</div>
