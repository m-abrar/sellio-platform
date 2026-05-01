<div class="row">
    <div class="col-12">
        <div class="card border-0 shadow-premium" style="border-radius: 24px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5);">
            <div class="card-body p-4">
                <div class="row align-items-center">
                    <div class="col-md-3 border-right border-light-soft">
                        <div class="d-flex align-items-center">
                            <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs" style="width: 60px; height: 60px; font-size: 1.8rem; border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-server text-primary"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 font-weight-bold text-dark" style="letter-spacing: -0.5px; font-size: 1rem;">Core Engine</h6>
                                <span class="badge badge-success-light text-success px-2 py-1 border-0 smallest font-weight-bold" style="letter-spacing: 0.5px;">
                                    <i class="fas fa-heartbeat mr-1 animate-pulse"></i> LIVE PULSE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9 mt-4 mt-md-0 pl-md-5">
                        <div class="row text-center text-md-left gy-4">
                            <div class="col-6 col-md-2">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Environment</label>
                                <span class="badge badge-primary-soft text-primary px-3 py-1 font-weight-bold text-uppercase border-0 shadow-none rounded-pill" style="font-size: 0.65rem;">
                                    {{ $metrics['system_health']['environment'] }}
                                </span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Runtime</label>
                                <span class="font-weight-bold text-dark" style="font-size: 0.9rem;">PHP {{ $metrics['system_health']['php_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Registry</label>
                                <span class="font-weight-bold text-dark" style="font-size: 0.9rem;">v{{ $metrics['system_health']['laravel_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Database</label>
                                <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                    <div class="bg-success rounded-circle mr-2" style="width: 8px; height: 8px;"></div>
                                    <span class="text-dark font-weight-bold small text-uppercase letter-spacing-1" style="font-size: 0.75rem;">CONNECTED</span>
                                </div>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Storage</label>
                                <span class="text-primary font-weight-bold text-uppercase smallest letter-spacing-1">{{ $metrics['system_health']['cache_status'] }} DRIVE</span>
                            </div>
                            <div class="col-6 col-md-2 border-left border-light-soft">
                                <label class="smallest text-muted d-block mb-1 font-weight-bold text-uppercase letter-spacing-1">Network</label>
                                <span class="text-muted smallest font-weight-bold">{{ $metrics['system_health']['server_ip'] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .border-light-soft { border-color: rgba(0,0,0,0.04) !important; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
</style>
