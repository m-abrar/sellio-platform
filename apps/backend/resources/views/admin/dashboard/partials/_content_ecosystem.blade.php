<div class="row">
    {{-- 1. SUBMISSIONS QUEUE --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-file-signature mr-2 text-warning opacity-50"></i> Submissions Queue
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush">
                    @foreach ($metrics['recent_listings']['items'] as $item)
                    <div class="list-group-item bg-transparent border-0 py-3 px-4 border-bottom d-flex align-items-center transition-all hover-shadow-sm">
                        <div class="icon-box-soft bg-light-soft text-muted mr-3 shadow-xs" style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas {{ $item['icon_class'] }}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="mb-0 small font-weight-bold text-dark">{{ $item['title'] }}</p>
                            <span class="badge {{ str_replace('bg-', 'badge-', $item['tag_class']) }}-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase">
                                {{ $item['tag'] }}
                            </span>
                        </div>
                        <a href="{{ route('admin.listings.edit.type', ['type' => $item['tag'], 'id' => $item['id']]) }}" class="btn btn-sm btn-white rounded-circle shadow-xs border d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" title="Review Submission">
                            <i class="fas fa-eye text-primary smallest"></i>
                        </a>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    {{-- 2. SYSTEM INTELLIGENCE --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 bg-dark overflow-hidden" style="border-radius: 24px;">
            <div class="card-header border-0 bg-transparent py-4 px-4">
                <h3 class="card-title font-weight-bold text-white mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-shield-alt mr-2 text-danger opacity-50"></i> Intelligence Pulse
                </h3>
            </div>
            <div class="card-body p-0">
                @foreach ($metrics['notifications']['items'] as $item)
                <div class="px-4 py-3 border-bottom border-white border-opacity-10 d-flex align-items-center transition-all" style="background: rgba(255,255,255,0.02);">
                    <div class="icon-box-soft bg-danger-soft text-danger mr-3" style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas {{ $item['icon_class'] }}"></i>
                    </div>
                    <div>
                        <p class="text-white small mb-0 font-weight-bold">{{ $item['title'] }}</p>
                        <small class="text-white-50 font-weight-bold uppercase smallest letter-spacing-1">{{ $item['tag'] }}</small>
                    </div>
                </div>
                @endforeach
            </div>
            <div class="card-footer border-0 text-center py-3" style="background: rgba(0,0,0,0.2) !important;">
                <p class="mb-0 smallest text-white-50 font-weight-bold uppercase letter-spacing-1">Secured Operational Stream</p>
            </div>
        </div>
    </div>

    {{-- 3. PERFORMANCE LEADERS --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-crown mr-2 text-warning opacity-50"></i> Ecosystem Leaders
                </h3>
            </div>
            <div class="card-body p-0">
                {{-- Top Partner --}}
                <div class="px-4 py-3 bg-light-soft border-bottom d-flex align-items-center">
                    <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user-tie fa-lg"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Top Performing Partner</small>
                        <span class="font-weight-bold text-dark d-block">{{ $metrics['top_partners']['partner_name'] }}</span>
                        <div class="d-flex align-items-center mt-1">
                            <span class="badge badge-success-light px-2 py-1 rounded-pill font-weight-bold smallest">
                                <i class="fas fa-star mr-1"></i>{{ $metrics['top_partners']['partner_rating'] }} RATING
                            </span>
                        </div>
                    </div>
                </div>

                {{-- Elite Listing --}}
                <div class="px-4 py-3 bg-white border-bottom d-flex align-items-center">
                    <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-award fa-lg"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Elite Marketplace Asset</small>
                        <span class="font-weight-bold text-dark d-block text-truncate" style="max-width: 200px;">{{ $metrics['top_partners']['listing_title'] }}</span>
                        <div class="d-flex align-items-center mt-1">
                            <span class="badge badge-primary-light px-2 py-1 rounded-pill font-weight-bold smallest">
                                <i class="fas fa-medal mr-1"></i>{{ $metrics['top_partners']['listing_rating'] }} SCORE
                            </span>
                        </div>
                    </div>
                </div>

                {{-- Volume Leader --}}
                <div class="px-4 py-3 bg-white d-flex align-items-center">
                    <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-chart-line fa-lg"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Peak Volume Engine</small>
                        <span class="font-weight-bold text-dark d-block">{{ $metrics['top_partners']['booked_listing'] }}</span>
                        <div class="d-flex align-items-center mt-1">
                            <span class="badge badge-info-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase">
                                <i class="fas fa-calendar-check mr-1"></i>{{ $metrics['top_partners']['booked_count'] }} BOOKINGS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
