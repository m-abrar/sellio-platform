<div class="row">
    <!-- Top Sellers -->
    <div class="col-lg-8 mb-4">
        <div class="card border-0 shadow-premium overflow-hidden h-100 rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-medal mr-2 text-warning opacity-50"></i> Top Performance Products
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light-soft">
                            <tr>
                                <th class="pl-4 smallest font-weight-bold uppercase letter-spacing-1" width="80">Rank</th>
                                <th class="smallest font-weight-bold uppercase letter-spacing-1">Market Identity</th>
                                <th class="text-center pr-4 smallest font-weight-bold uppercase letter-spacing-1">Sales Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($metrics['top_sellers']['items'] as $item)
                            <tr>
                                <td class="pl-4 py-3">
                                    <span class="badge badge-primary-soft text-primary px-3 py-1 rounded-pill font-weight-bold smallest">#{{ $item['rank'] }}</span>
                                </td>
                                <td class="py-3">
                                    <span class="font-weight-bold text-dark d-block small">{{ $item['title'] }}</span>
                                    <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">SKU Identity: {{ strtoupper(Str::random(6)) }}</span>
                                </td>
                                <td class="text-center pr-4">
                                    <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest">
                                        <i class="fas fa-chart-line mr-1"></i> {{ $item['bookings'] }} UNITS
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white border-0 text-center py-3">
                <a href="{{ route('admin.products.index') }}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    Analyze Product Lifecycle <i class="fas fa-chevron-right ml-1"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- Category Distribution -->
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-chart-pie mr-2 text-info opacity-50"></i> Sales By Category
                </h3>
            </div>
            <div class="card-body py-4 px-4 d-flex flex-column justify-content-center">
                <div class="chart-container-premium">
                    <canvas id="propertyTypeChart"></canvas>
                </div>
            </div>
            <div class="card-footer bg-white border-0 py-3 text-center">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">Segmented revenue distribution</p>
            </div>
        </div>
    </div>
</div>
