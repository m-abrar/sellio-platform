<div class="row">
    <div class="col-lg-12 mb-4">
        <div class="card border-0 shadow-sm" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Real-Time Order Feed</h6>
                <a href="{{ route('admin.product-orders.index') }}" class="btn btn-sm btn-outline-primary rounded-pill px-3">View All</a>
            </div>
            <div class="card-body p-0">
                <ul class="list-group list-group-flush">
                    @foreach($metrics['recent_orders']['items'] as $item)
                    <li class="list-group-item border-0 d-flex align-items-center justify-content-between px-4 py-3">
                        <div class="d-flex align-items-center">
                            <div class="icon-circle mr-3 shadow-sm bg-light" style="width: 40px; height: 40px;">
                                <i class="{{ $item['icon_class'] }}"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 font-weight-bold text-dark">{{ $item['title'] }}</h6>
                                <p class="text-muted small mb-0">Processed through main gateway</p>
                            </div>
                        </div>
                        <span class="badge {{ $item['tag_class'] }} text-white px-3 py-1 rounded-pill small uppercase">{{ $item['tag'] }}</span>
                    </li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</div>
