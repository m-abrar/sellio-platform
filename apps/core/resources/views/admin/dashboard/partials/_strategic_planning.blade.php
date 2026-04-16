<div class="row">
    <div class="col-lg-5"> 
        <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white py-3">
                <h6 class="m-0 font-weight-bold"><i class="fas fa-award mr-2 text-success"></i>High Performance Inventory</h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light small font-weight-bold">
                            <tr><th>Rank</th><th>Inventory Title</th><th class="text-center">Bookings</th></tr>
                        </thead>
                        <tbody>
                            @foreach ($metrics['top_sales']['items'] as $item)
                            <tr>
                                <td width="50"><span class="badge badge-pill badge-light border">{{ $item['rank'] }}</span></td>
                                <td class="small font-weight-bold text-dark">{{ $item['title'] }}</td>
                                <td class="text-center"><span class="badge badge-success-light px-3">{{ $item['bookings'] }}</span></td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white text-center">
                <a href="{{ route('admin.bookings.index')}}" class="btn btn-sm btn-link font-weight-bold">Download Comprehensive Report</a>
            </div>
        </div>
    </div>

    <div class="col-lg-7"> 
        <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold"><i class="fas fa-map-marked-alt mr-2 text-primary"></i>Geospatial Demand Heatmap</h6>
                <div class="badge badge-pill badge-primary-light text-primary small">Live Data</div>
            </div>
            <div class="card-body p-0">
                <div id="heatmap" style="height: 380px;"></div> 
            </div>
            <div class="card-footer bg-white py-2 d-flex justify-content-between">
                <small class="text-muted">Radius focus: 25km</small>
                <a href="{{ route('admin.locations.index')}}" class="small font-weight-bold">Manage Territory Zones</a>
            </div>
        </div>
    </div>
</div>
