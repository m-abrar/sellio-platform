{{--
    Dashboard Partial: System Infrastructure Health
    
    This component provides a real-time diagnostic overview of the platform's 
    infrastructure. It monitors the operational environment, runtime versions 
    (PHP/Laravel), database connectivity, and storage driver status to 
    ensure high-availability.
    
    @param array $metrics Pre-aggregated diagnostic data from the system kernel.
--}}
<div class="row">
    <div class="col-12 mb-4">
        <div class="card card-glass overflow-hidden">
            <div class="card-body p-4">
                <div class="row align-items-center">
                    <div class="col-md-3 border-right border-light-soft">
                        <div class="d-flex align-items-center">
                            <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs rounded-lg icon-box-60 fs-1-05">
                                <i class="fas fa-server"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 font-weight-bold text-dark smallest text-uppercase letter-spacing-1">{{ __('Core Engine') }}</h6>
                                <span class="badge badge-success-light px-3 py-2 rounded-pill border-0 smallest font-weight-bold animate-pulse-soft ls-05">
                                    <i class="fas fa-heartbeat mr-1"></i> {{ __('LIVE PULSE') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9 mt-4 mt-md-0 pl-md-5">
                        <div class="row text-center text-md-left gy-4">
                            <div class="col-6 col-md">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Environment') }}</span>
                                <span class="badge badge-primary-soft px-3 py-1 font-weight-bold text-uppercase border-0 shadow-none rounded-pill fs-065">
                                    {{ $metrics['system_health']['environment'] }}
                                </span>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Runtime') }}</span>
                                <span class="font-weight-bold text-dark fs-095 font-outfit">PHP {{ $metrics['system_health']['php_version'] }}</span>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('ID') }}</span>
                                <span class="font-weight-bold text-dark fs-095 font-outfit">v{{ $metrics['system_health']['laravel_version'] }}</span>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Database') }}</span>
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                    <div class="bg-success rounded-circle mr-2 pulse-glow-dot"></div>
                                    <span class="text-dark font-weight-bold smallest text-uppercase letter-spacing-1">{{ __('CONNECTED') }}</span>
                                </div>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Storage') }}</span>
                                <span class="text-primary font-weight-bold text-uppercase smallest letter-spacing-1">{{ $metrics['system_health']['cache_status'] }} {{ __('DRIVE') }}</span>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Network') }}</span>
                                <span class="text-muted smallest font-weight-bold letter-spacing-1">{{ $metrics['system_health']['server_ip'] }}</span>
                            </div>
                            <div class="col-6 col-md border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">
                                    {{ __('Queue Worker') }}
                                    <a href="#queue-worker-help" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="queue-worker-help" class="text-primary ml-1" title="{{ __('How to activate the queue worker') }}">
                                        <i class="far fa-question-circle" aria-hidden="true"></i>
                                        <span class="sr-only">{{ __('Show queue worker setup help') }}</span>
                                    </a>
                                </span>
                                @if($queueHealth['worker_up'])
                                    <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                        <div class="bg-success rounded-circle mr-2 pulse-glow-dot"></div>
                                        <span class="text-dark font-weight-bold smallest text-uppercase letter-spacing-1">{{ __('ACTIVE') }}</span>
                                    </div>
                                    @if($queueHealth['failed_jobs'] > 0)
                                        <span class="smallest text-danger d-block mt-1 font-weight-bold">
                                            {{ $queueHealth['failed_jobs'] }} {{ __('failed') }}
                                        </span>
                                    @endif
                                @else
                                    <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                        <div class="bg-warning rounded-circle mr-2" style="width:8px;height:8px;"></div>
                                        <span class="text-warning font-weight-bold smallest text-uppercase letter-spacing-1">{{ __('DOWN') }}</span>
                                    </div>
                                    <span class="smallest text-muted d-block mt-1">
                                        {{ $queueHealth['stale_jobs'] }} {{ __('pending') }}
                                    </span>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <div class="collapse mt-4" id="queue-worker-help">
                    <div class="alert alert-info border-0 rounded-lg mb-0 px-4 py-3 text-left">
                        <div class="d-flex align-items-start">
                            <i class="fas fa-lightbulb text-info mr-3 mt-1" aria-hidden="true"></i>
                            <div class="small">
                                <strong class="d-block text-dark mb-2">{{ __('How to activate the queue worker') }}</strong>
                                <p class="mb-2 text-muted">
                                    {{ __('Set QUEUE_CONNECTION=database in .env, then clear cached configuration with:') }}
                                    <code class="d-block mt-1">php artisan config:clear</code>
                                </p>
                                <p class="mb-2 text-muted">
                                    {{ __('VPS or dedicated server (keep this running with Supervisor or another process manager):') }}
                                    <code class="d-block mt-1">php artisan queue:work --sleep=3 --tries=3 --timeout=600</code>
                                </p>
                                <p class="mb-0 text-muted">
                                    {{ __('Shared hosting: create a cron job that runs every minute:') }}
                                    <code class="d-block mt-1">cd {{ base_path() }} &amp;&amp; php artisan queue:work --stop-when-empty --tries=3 --timeout=600</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
