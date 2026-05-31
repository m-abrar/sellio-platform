{{--
    Ecommerce Dashboard Partial: Logistics & Order Intelligence
    
    This component provides a high-fidelity view of the real-time order feed,
    facilitating rapid response to new transactions and tracking logistics 
    lifecycles across the e-commerce fulfillment chain.
    
    @param array $metrics Pre-aggregated data including recent order objects and status tags.
--}}
<div class="row">
    <div class="col-lg-12 mb-4">
        <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-shipping-fast mr-2 text-primary opacity-50"></i> Real-Time Order Feed & Logistics
                </h3>
                <a href="{{ route('admin.product-orders.index') }}" class="ml-auto smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    Full Order Registry <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light-soft">
                            <tr>
                                <th class="pl-4 smallest font-weight-bold uppercase letter-spacing-1">Identity</th>
                                <th class="smallest font-weight-bold uppercase letter-spacing-1">Product Details</th>
                                <th class="text-center pr-4 smallest font-weight-bold uppercase letter-spacing-1">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($metrics['recent_orders']['items'] as $item)
                            <tr>
                                <td class="pl-4" width="80">
                                    <div class="icon-box-soft bg-primary-soft text-primary shadow-xs" style="width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <i class="{{ $item['icon_class'] }}"></i>
                                    </div>
                                </td>
                                <td class="py-3">
                                    <span class="font-weight-bold text-dark d-block" style="font-size: 0.9rem;">{{ $item['title'] }}</span>
                                    <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">LOGISTICS ID: {{ $item['logistics_id'] ?? 'Pending Assignment' }}</span>
                                </td>
                                <td class="text-center pr-4">
                                    <span class="badge {{ str_replace('bg-', 'badge-', $item['tag_class']) }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                        {{ $item['tag'] }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white border-0 text-center py-3">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-sync-alt mr-1 fa-spin text-primary"></i> Data stream active: Live Fulfillment sync
                </p>
            </div>
        </div>
    </div>
</div>
