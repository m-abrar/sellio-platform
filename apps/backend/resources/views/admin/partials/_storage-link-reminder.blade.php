{{--
    Floating storage-link reminder for fresh installs.

    Shown until public/storage is correctly symlinked to storage/app/public.
--}}
@php
    $storageLinkReminder = app(\App\Services\Admin\StorageLinkReminderService::class)->getReminder();
    $onMaintenancePage = request()->routeIs('admin.system.maintenance');
@endphp

@if ($storageLinkReminder && ! $onMaintenancePage)
    <div class="storage-link-reminder shadow-premium animate__animated animate__fadeInUp" role="alert" aria-live="polite">
        <div class="storage-link-reminder__icon bg-danger-soft text-danger">
            <i class="fas fa-unlink fa-lg"></i>
        </div>

        <div class="storage-link-reminder__body">
            <h6 class="font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1">
                {{ $storageLinkReminder['title'] }}
            </h6>
            <p class="mb-2 text-secondary small font-weight-600">
                {{ $storageLinkReminder['summary'] }}
            </p>

            <ul class="mb-0 pl-3 small text-secondary font-weight-600">
                @foreach ($storageLinkReminder['issues'] as $issue)
                    <li class="mb-1">
                        <code>{{ $issue['link'] }}</code>
                        <span class="text-muted d-block">{{ $issue['detail'] }}</span>
                    </li>
                @endforeach
            </ul>
        </div>

        <div class="storage-link-reminder__actions">
            <a href="{{ $storageLinkReminder['maintenance_url'] }}"
                class="btn btn-danger btn-sm rounded-pill px-4 font-weight-bold shadow-sm">
                <i class="fas fa-tools mr-1"></i> {{ __('Open System Maintenance') }}
            </a>
        </div>
    </div>

    <style>
        .storage-link-reminder {
            position: fixed;
            right: 1.5rem;
            bottom: 1.5rem;
            z-index: 1080;
            max-width: 26rem;
            width: calc(100% - 3rem);
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.85rem 1rem;
            padding: 1rem 1.1rem;
            border-radius: 1rem;
            background: #fff;
            border: 1px solid rgba(220, 53, 69, 0.18);
        }

        .storage-link-reminder__icon {
            width: 2.75rem;
            height: 2.75rem;
            border-radius: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .storage-link-reminder__body {
            grid-column: 2;
        }

        .storage-link-reminder__actions {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-end;
        }

        @media (max-width: 575.98px) {
            .storage-link-reminder {
                left: 1rem;
                right: 1rem;
                width: auto;
            }
        }
    </style>
@endif
