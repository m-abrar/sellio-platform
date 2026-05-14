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
                            <div class="col-6 col-md-2">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Environment') }}</span>
                                <span class="badge badge-primary-soft px-3 py-1 font-weight-bold text-uppercase border-0 shadow-none rounded-pill fs-065">
                                    {{ $metrics['system_health']['environment'] }}
                                </span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Runtime') }}</span>
                                <span class="font-weight-bold text-dark fs-095 font-outfit">PHP {{ $metrics['system_health']['php_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Registry') }}</span>
                                <span class="font-weight-bold text-dark fs-095 font-outfit">v{{ $metrics['system_health']['laravel_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Database') }}</span>
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                    <div class="bg-success rounded-circle mr-2 pulse-glow-dot"></div>
                                    <span class="text-dark font-weight-bold smallest text-uppercase letter-spacing-1">{{ __('CONNECTED') }}</span>
                                </div>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Storage') }}</span>
                                <span class="text-primary font-weight-bold text-uppercase smallest letter-spacing-1">{{ $metrics['system_health']['cache_status'] }} {{ __('DRIVE') }}</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <span class="smallest text-muted d-block mb-2 font-weight-bold text-uppercase letter-spacing-1">{{ __('Network') }}</span>
                                <span class="text-muted smallest font-weight-bold letter-spacing-1">{{ $metrics['system_health']['server_ip'] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
