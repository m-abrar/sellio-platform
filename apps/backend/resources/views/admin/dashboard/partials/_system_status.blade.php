<div class="row">
    <div class="col-12">
        <div class="card border-0 shadow-sm" style="border-radius: 16px; background: #f8f9fa;">
            <div class="card-body p-4">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <div class="icon-box-soft bg-success-soft mr-3" style="width: 50px; height: 50px; font-size: 1.5rem;">
                                <i class="fas fa-server"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 font-weight-bold text-dark">System Status</h6>
                                <span class="badge badge-success-light px-2 py-1" style="font-size: 0.65rem;">
                                    <i class="fas fa-check-circle mr-1"></i> All Systems Operational
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="row text-center text-md-left">
                            <div class="col-6 col-md-2 mb-3 mb-md-0">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">PHP Version</small>
                                <span class="font-weight-bold text-dark">{{ $metrics['system_health']['php_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2 mb-3 mb-md-0">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">Laravel</small>
                                <span class="font-weight-bold text-dark">v{{ $metrics['system_health']['laravel_version'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">Environment</small>
                                <span class="badge badge-primary px-2 text-capitalize">{{ $metrics['system_health']['environment'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">Database</small>
                                <span class="text-success font-weight-bold"><i class="fas fa-database mr-1"></i> {{ $metrics['system_health']['db_status'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">Cache</small>
                                <span class="text-primary font-weight-bold text-uppercase">{{ $metrics['system_health']['cache_status'] }}</span>
                            </div>
                            <div class="col-6 col-md-2">
                                <small class="text-muted d-block mb-1 font-weight-bold uppercase" style="font-size: 0.7rem;">IP Address</small>
                                <span class="text-muted small font-weight-bold">{{ $metrics['system_health']['server_ip'] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
