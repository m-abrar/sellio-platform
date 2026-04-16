<div class="row">
    <!-- Top Sellers -->
    <div class="col-lg-8 mb-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Top Performance Products</h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="border-0 px-4">Rank</th>
                                <th class="border-0 px-4">Product</th>
                                <th class="border-0 px-4 text-right">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($metrics['top_sellers']['items'] as $item)
                            <tr>
                                <td class="px-4 py-3"><span class="badge badge-primary rounded-pill">{{ $item['rank'] }}</span></td>
                                <td class="px-4 py-3 font-weight-bold">{{ $item['title'] }}</td>
                                <td class="px-4 py-3 text-right text-success font-weight-bold">{{ $item['bookings'] }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Category Distribution -->
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Sales By Category</h6>
            </div>
            <div class="card-body">
                <div class="chart-pie pt-4 pb-2" style="height: 300px;">
                    <canvas id="propertyTypeChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
