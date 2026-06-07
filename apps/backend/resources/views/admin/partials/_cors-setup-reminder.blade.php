{{--
    Administrative CORS Setup Reminder

    Shown globally in the admin panel when storefront, seller, or buyer
    ecosystem URLs are missing, invalid, or still using placeholder values.
--}}
@php
    $corsSetupReminder = app(\App\Services\Admin\CorsSetupReminderService::class)->getReminder();
@endphp

@if ($corsSetupReminder)
    <div class="alert alert-warning-light alert-premium animate__animated animate__fadeInDown border-0 shadow-sm mb-0 rounded-0 alert-border-warning cors-setup-reminder" role="alert">
        <div class="container-fluid py-3">
            <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                <div class="icon-box-soft bg-warning-soft text-warning mr-0 mr-lg-3 mb-3 mb-lg-0 shadow-xs alert-icon-box">
                    <i class="fas fa-shield-alt fa-lg"></i>
                </div>

                <div class="flex-grow-1">
                    <h6 class="font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1">
                        {{ $corsSetupReminder['title'] }}
                    </h6>
                    <p class="mb-2 text-secondary small font-weight-600">
                        {{ $corsSetupReminder['summary'] }}
                    </p>

                    <ul class="mb-0 pl-3 small text-secondary font-weight-600">
                        @foreach ($corsSetupReminder['issues'] as $issue)
                            <li class="mb-1">
                                <strong>{{ $issue['label'] }}:</strong>
                                <span class="text-muted">{{ $issue['detail'] }}</span>
                                @if ($issue['value'] !== '')
                                    <code class="ml-1">{{ $issue['value'] }}</code>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="ml-lg-auto mt-3 mt-lg-0 text-nowrap">
                    <a href="{{ $corsSetupReminder['settings_url'] }}" class="btn btn-warning btn-sm rounded-pill px-4 font-weight-bold shadow-sm">
                        <i class="fas fa-cog mr-1"></i> {{ __('Open Settings → General') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@endif
