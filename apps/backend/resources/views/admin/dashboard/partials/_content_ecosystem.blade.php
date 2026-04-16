<div class="row">
    {{-- 1. SUBMISSIONS QUEUE --}}
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white py-3 border-0">
                <h6 class="m-0 font-weight-bold text-uppercase text-secondary" style="letter-spacing: 1px;">
                    <i class="fas fa-file-signature mr-2 text-warning"></i>Submissions Queue
                </h6>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush">
                    @foreach ($metrics['recent_listings']['items'] as $item)
                    <div class="list-group-item bg-transparent border-0 py-3 border-bottom d-flex align-items-center transition-hover">
                        <div class="icon-circle bg-light mr-3" style="width: 35px; height: 35px; font-size: 0.9rem;">
                            <i class="fas {{ $item['icon_class'] }} text-muted"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="mb-0 small font-weight-bold text-dark">{{ $item['title'] }}</p>
                            <span class="badge {{ $item['tag_class'] }}-light text-{{ str_replace('bg-', '', $item['tag_class']) }} rounded-pill" style="font-size: 9px; text-transform: uppercase;">
                                {{ $item['tag'] }}
                            </span>
                        </div>
                        <a href="{{ route('admin.listings.edit.type', ['type' => $item['tag'], 'id' => $item['id']]) }}" class="btn btn-xs btn-outline-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" title="Review Submission">
                            <i class="fas fa-eye" style="font-size: 0.75rem;"></i>
                        </a>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    {{-- 2. SYSTEM ALERTS (DARK THEME) --}}
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 bg-dark">
            <div class="card-header border-0 bg-transparent py-3">
                <h6 class="m-0 font-weight-bold text-white text-uppercase" style="letter-spacing: 1px;">
                    <i class="fas fa-bell mr-2 text-danger"></i>Intelligence Alerts
                </h6>
            </div>
            <div class="card-body p-0">
                @foreach ($metrics['notifications']['items'] as $item)
                <div class="px-3 py-3 border-bottom border-secondary d-flex align-items-center transition-hover" style="background: rgba(255,255,255,0.02);">
                    <div class="icon-circle mr-3 bg-{{ str_replace('bg-', '', $item['tag_class']) }}-light text-{{ str_replace('bg-', '', $item['tag_class']) }}" style="width: 35px; height: 35px; font-size: 0.8rem;">
                        <i class="fas {{ $item['icon_class'] }}"></i>
                    </div>
                    <div>
                        <p class="text-white small mb-0 font-weight-bold">{{ $item['title'] }}</p>
                        <small class="text-muted" style="font-size: 11px;">{{ $item['tag'] }}</small>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- 3. PERFORMANCE LEADERS --}}
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white py-3 border-0">
                <h6 class="m-0 font-weight-bold text-success text-uppercase" style="letter-spacing: 1px;">
                    <i class="fas fa-crown mr-2 text-warning"></i>Performance Leaders
                </h6>
            </div>
            <div class="card-body p-0">
                {{-- Top Partner --}}
                <div class="p-3 bg-light-gray border-bottom transition-hover d-flex align-items-center">
                    <div class="icon-circle bg-success-light text-success mr-3">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted d-block uppercase font-weight-bold" style="font-size: 10px;">Top Partner</small>
                        <span class="font-weight-bold text-dark d-block">{{ $metrics['top_partners']['partner_name'] }}</span>
                        <span class="badge badge-success-light text-success mt-1" style="font-size: 11px;">
                            <i class="fas fa-star mr-1"></i>{{ $metrics['top_partners']['partner_rating'] }}
                        </span>
                    </div>
                </div>

                {{-- Elite Listing --}}
                <div class="p-3 bg-white border-bottom transition-hover d-flex align-items-center">
                    <div class="icon-circle bg-primary-light text-primary mr-3">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted d-block uppercase font-weight-bold" style="font-size: 10px;">Elite Listing</small>
                        <span class="font-weight-bold text-dark d-block text-truncate" style="max-width: 180px;">{{ $metrics['top_partners']['listing_title'] }}</span>
                        <span class="badge badge-primary-light text-primary mt-1" style="font-size: 11px;">
                            <i class="fas fa-medal mr-1"></i>{{ $metrics['top_partners']['listing_rating'] }}
                        </span>
                    </div>
                </div>

                {{-- Volume Leader --}}
                <div class="p-3 bg-white transition-hover d-flex align-items-center">
                    <div class="icon-circle bg-info-light text-info mr-3">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted d-block uppercase font-weight-bold" style="font-size: 10px;">Volume Leader</small>
                        <span class="font-weight-bold text-dark d-block">{{ $metrics['top_partners']['booked_listing'] }}</span>
                        <span class="badge badge-info-light text-info mt-1" style="font-size: 11px;">
                            <i class="fas fa-calendar-check mr-1"></i>{{ $metrics['top_partners']['booked_count'] }} Bookings
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
