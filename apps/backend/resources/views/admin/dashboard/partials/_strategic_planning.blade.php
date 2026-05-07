{{--
    Dashboard Partial: Strategic Planning & Geospatial Insights
    
    This component identifies high-performance inventory through weighted 
    engagement metrics and visualizes geographic demand distribution 
    via a Leaflet-driven heat map. It facilitates long-term resource 
    allocation and territory architecture decisions.
    
    @param array $metrics Pre-aggregated data including top-selling items and coordinate clusters.
--}}
<div class="row">
    {{-- 1. PERFORMANCE INVENTORY --}}
    <div class="col-lg-5 mb-4"> 
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-award mr-2 text-success opacity-50"></i> High Performance Inventory
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light-soft">
                            <tr>
                                <th class="pl-4 smallest font-weight-bold uppercase letter-spacing-1">Rank</th>
                                <th class="smallest font-weight-bold uppercase letter-spacing-1">Inventory Identity</th>
                                <th class="text-center pr-4 smallest font-weight-bold uppercase letter-spacing-1">Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($metrics['top_sales']['items'] as $item)
                            <tr>
                                <td class="pl-4" width="80">
                                    <span class="badge badge-primary-soft text-primary px-3 py-1 rounded-pill font-weight-bold smallest">#{{ $item['rank'] }}</span>
                                </td>
                                <td class="py-3">
                                    <span class="font-weight-bold text-dark d-block text-truncate" style="max-width: 200px; font-size: 0.9rem;">{{ $item['title'] }}</span>
                                </td>
                                <td class="text-center pr-4">
                                    <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest">
                                        <i class="fas fa-chart-line mr-1"></i> {{ $item['bookings'] }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white border-0 text-center py-3">
                <a href="{{ route('admin.bookings.index')}}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    Export Comprehensive Dataset <i class="fas fa-download ml-1"></i>
                </a>
            </div>
        </div>
    </div>

    {{-- 2. GEOSPATIAL HEATMAP --}}
    <div class="col-lg-7 mb-4"> 
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-map-marked-alt mr-2 text-primary opacity-50"></i> Geospatial Demand Heatmap
                </h3>
                <span class="badge badge-primary-light ml-auto px-3 py-2 rounded-pill font-weight-bold smallest uppercase animate-pulse">Live Transmission</span>
            </div>
            <div class="card-body p-0">
                <div id="heatmap" style="height: 400px; filter: grayscale(0.2) contrast(1.1);"></div> 
            </div>
            <div class="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center border-0">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-crosshairs mr-1"></i> Resolution focus: 25km Cluster
                </p>
                <a href="{{ route('admin.locations.index')}}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    Manage Territory Architecture <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    </div>
</div>
