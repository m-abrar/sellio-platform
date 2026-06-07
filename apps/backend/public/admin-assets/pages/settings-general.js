/**
 * Administrative Infrastructure: General Identity Orchestration
 *
 * Brand asset uploads and platform URL connection testing.
 */
$(document).ready(function() {
    // Brand Logo Logic
    const logoInput = $('#site-logo-input');
    const logoWrapper = $('#logo-dropzone');
    const logoPreviewContainer = $('#logo-preview-container');

    if (logoInput.length && logoWrapper.length) {
        const updateLogoPreview = (file) => {
            if (file) {
                const url = URL.createObjectURL(file);
                logoPreviewContainer.html(`<img src="${url}" class="img-fluid drop-shadow-sm mb-3 max-h-80" alt="Logo Preview">`);
            }
        };

        logoWrapper.on('click', function() {
            logoInput.click();
        });

        logoInput.on('change', function(e) {
            updateLogoPreview(e.target.files[0]);
        });

        logoWrapper.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('bg-primary-soft border-primary').removeClass('bg-light');
        }).on('dragleave drop', function(e) {
            e.preventDefault();
            $(this).removeClass('bg-primary-soft border-primary').addClass('bg-light');
            if (e.type === 'drop') {
                const files = e.originalEvent.dataTransfer.files;
                logoInput[0].files = files;
                updateLogoPreview(files[0]);
            }
        });
    }

    // Favicon Logic
    const faviconInput = $('#site-favicon-input');
    const faviconWrapper = $('#favicon-dropzone');
    const faviconPreviewContainer = $('#favicon-preview-container');

    if (faviconInput.length && faviconWrapper.length) {
        const updateFaviconPreview = (file) => {
            if (file) {
                const url = URL.createObjectURL(file);
                faviconPreviewContainer.html(`<img src="${url}" width="56" height="56" class="drop-shadow-sm rounded shadow-xs" alt="Favicon Preview">`);
            }
        };

        faviconWrapper.on('click', function() {
            faviconInput.click();
        });

        faviconInput.on('change', function(e) {
            updateFaviconPreview(e.target.files[0]);
        });

        faviconWrapper.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('bg-info-soft border-info').removeClass('bg-light');
        }).on('dragleave drop', function(e) {
            e.preventDefault();
            $(this).removeClass('bg-info-soft border-info').addClass('bg-light');
            if (e.type === 'drop') {
                const files = e.originalEvent.dataTransfer.files;
                faviconInput[0].files = files;
                updateFaviconPreview(files[0]);
            }
        });
    }

    const platformUrlSettings = $('#platform-url-settings');

    if (!platformUrlSettings.length) {
        return;
    }

    const verifyUrl = platformUrlSettings.data('verify-url');
    const csrfToken = $('input[name="_token"]').first().val();

    const normalizeUrl = (value) => {
        const trimmed = (value || '').trim().replace(/\/+$/, '');
        if (!trimmed) {
            return '';
        }

        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const setFieldStatus = ($fieldWrap, status, message) => {
        const $badge = $fieldWrap.find('.platform-url-status');
        const $feedback = $fieldWrap.find('.platform-url-feedback');

        $badge
            .removeClass('badge-success badge-warning badge-secondary badge-danger')
            .attr('data-status', status);

        if (status === 'connected') {
            $badge.addClass('badge-success').html('<i class="fas fa-check-circle mr-1"></i> Connected');
        } else if (status === 'empty') {
            $badge.addClass('badge-secondary').html('<i class="fas fa-circle mr-1"></i> Not configured');
        } else if (status === 'checking') {
            $badge.addClass('badge-warning').html('<i class="fas fa-spinner fa-spin mr-1"></i> Checking');
        } else if (status === 'failed') {
            $badge.addClass('badge-danger').html('<i class="fas fa-times-circle mr-1"></i> Failed');
        } else {
            $badge.addClass('badge-warning').html('<i class="fas fa-exclamation-circle mr-1"></i> Not verified');
        }

        if (message) {
            $feedback.text(message);
        }
    };

    const markFieldUnverified = ($fieldWrap) => {
        const value = $fieldWrap.find('.platform-url-input').val().trim();
        setFieldStatus(
            $fieldWrap,
            value === '' ? 'empty' : 'unverified',
            value === '' ? 'Not configured' : 'Not verified — test the URL before saving'
        );
    };

    platformUrlSettings.on('input', '.platform-url-input', function() {
        const $fieldWrap = $(this).closest('.platform-url-field');
        const currentValue = normalizeUrl($(this).val());
        const verifiedValue = normalizeUrl($(this).data('verified-value'));

        if (currentValue !== verifiedValue) {
            markFieldUnverified($fieldWrap);
        }
    });

    platformUrlSettings.on('click', '.btn-verify-platform-url', function() {
        const $button = $(this);
        const field = $button.data('field');
        const $fieldWrap = $button.closest('.platform-url-field');
        const $input = $fieldWrap.find('.platform-url-input');
        const url = normalizeUrl($input.val());

        if (!url) {
            setFieldStatus($fieldWrap, 'empty', 'Enter a URL before testing the connection.');
            $input.focus();
            return;
        }

        $input.val(url);
        setFieldStatus($fieldWrap, 'checking', 'Testing connection...');
        $button.prop('disabled', true);

        $.ajax({
            url: verifyUrl,
            method: 'POST',
            dataType: 'json',
            data: {
                _token: csrfToken,
                field: field,
                url: url,
            },
        })
            .done(function(response) {
                if (response.connected) {
                    $input.data('verified-value', url);
                    setFieldStatus($fieldWrap, 'connected', response.message || 'Connected');
                } else {
                    $input.data('verified-value', '');
                    setFieldStatus($fieldWrap, 'failed', response.message || 'Connection failed');
                }
            })
            .fail(function(xhr) {
                const message = xhr.responseJSON && xhr.responseJSON.message
                    ? xhr.responseJSON.message
                    : 'Could not verify this URL. Check the value and try again.';

                $input.data('verified-value', '');
                setFieldStatus($fieldWrap, 'failed', message);
            })
            .always(function() {
                $button.prop('disabled', false);
            });
    });
});
