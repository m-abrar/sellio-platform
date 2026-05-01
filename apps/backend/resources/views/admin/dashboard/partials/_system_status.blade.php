<div class="row">
    <div class="col-12">
        <div class="card border-0 shadow-premium" style="border-radius: 24px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.4);">
            <div class="card-body p-4">
                <div class="row align-items-center">
                    <div class="col-md-3 border-right border-light">
                        <div class="d-flex align-items-center">
                            <div class="icon-box-soft bg-success-soft mr-3 shadow-xs" style="width: 54px; height: 54px; font-size: 1.6rem; border-radius: 14px;">
                                <i class="fas fa-microchip text-success"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 font-weight-bold text-dark" style="letter-spacing: -0.3px;">System Core</h6>
                                <span class="badge badge-success-light text-success px-2 py-1 mt-1 border-0" style="font-size: 0.6rem; font-weight: 800; letter-spacing: 0.5px;">
                                    <i class="fas fa-check-circle mr-1"></i> OPTIMIZED
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9 mt-3 mt-md-0">
                        <div class="row text-center text-md-left">
                            <div class="col-6 col-md-2 mb-3 mb-md-0">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Runtime</small>
                                <span class="font-weight-bold text-dark">PHP {{ $metrics['system_health']['php_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 mb-3 mb-md-0">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Framework</small>
                                <span class="font-weight-bold text-dark">Laravel {{ $metrics['system_health']['laravel_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Environment</small>
                                <span class="badge badge-primary-soft text-primary px-2 font-weight-bold text-capitalize border" style="font-size: 0.7rem;">{{ $metrics['system_health']['environment'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Database</small>
                                <span class="text-success font-weight-bold small"><i class="fas fa-database mr-1 text-xs"></i> {{ $metrics['system_health']['db_status'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Caching</small>
                                <span class="text-primary font-weight-bold text-uppercase small">{{ $metrics['system_health']['cache_status'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">Instance IP</small>
                                <span class="text-muted small font-weight-bold font-italic">{{ $metrics['system_health']['server_ip'] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
