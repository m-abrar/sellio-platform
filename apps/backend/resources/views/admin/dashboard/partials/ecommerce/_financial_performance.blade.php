{{--
    Ecommerce Dashboard Partial: Revenue & Growth Trajectory
    
    This component visualizes the financial momentum of the e-commerce engine,
    comparing gross sales against fulfillment costs through an interactive 
    time-series chart.
    
    @param array $metrics Pre-aggregated dataset for sales trajectory visualization.
--}}
<div class="row">
    <div class="col-lg-12">
        <div class="card border-0 shadow-sm" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
                <div>
                    <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Revenue Analytics</h6>
                    <p class="text-muted small mb-0">Paid order revenue vs product cost basis</p>
                </div>
                <div class="dropdown no-arrow ml-auto">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div class="chart-area" style="height: 350px;">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
