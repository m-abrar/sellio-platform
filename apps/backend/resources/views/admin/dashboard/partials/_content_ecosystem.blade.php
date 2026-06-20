{{--
    Dashboard Partial: Content & Partner Ecosystem
    
    This component visualizes the operational health of the platform content.
    It tracks the listing submission queue, security intelligence notifications,
    and identifies top-performing partners and marketplace assets.
    
    @param array $metrics Pre-aggregated data including recent listings and partner stats.
--}}
<div class="row">
    {{-- 1. SUBMISSIONS QUEUE --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-file-signature mr-2 text-warning opacity-50"></i> {{ __('Submissions Queue') }}
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="list-group list-group-flush">
                    @foreach ($metrics['recent_listings']['items'] as $item)
                    <div class="list-group-item bg-transparent border-0 py-3 px-4 border-bottom d-flex align-items-center transition-all hover-shadow-sm">
                        <div class="icon-box-soft md bg-light-soft text-muted mr-3 shadow-xs">
                            <i class="fas {{ $item['icon_class'] }}"></i>
                        </div>
                        <div class="flex-grow-1">
                            <p class="mb-0 small font-weight-bold text-dark">{{ $item['title'] }}</p>
                            <span class="badge {{ str_replace('bg-', 'badge-', $item['tag_class']) }}-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase">
                                {{ $item['tag'] }}
                            </span>
                        </div>
                        <a href="{{ route('admin.listings.edit.type', ['listing_type' => $item['listing_type'] ?? $item['tag'], 'listing_id' => $item['id']]) }}" class="btn btn-sm btn-white rounded-circle shadow-xs border d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" title="{{ __('Review Submission') }}">
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
        <div class="card border-0 shadow-premium h-100 bg-dark overflow-hidden rounded-xl">
            <div class="card-header border-0 bg-transparent py-4 px-4">
                <h3 class="card-title font-weight-bold text-white mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-shield-alt mr-2 text-danger opacity-50"></i> {{ __('Notifications') }}
                </h3>
            </div>
            <div class="card-body p-0">
                @foreach ($metrics['notifications']['items'] as $item)
                <div class="px-4 py-3 border-bottom border-white border-opacity-10 d-flex align-items-center transition-all" style="background: rgba(255,255,255,0.02);">
                    <div class="icon-box-soft md bg-danger-soft text-danger mr-3">
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
                <p class="mb-0 smallest text-white-50 font-weight-bold uppercase letter-spacing-1">{{ __('Activity') }}</p>
            </div>
        </div>
    </div>

    {{-- 3. PERFORMANCE LEADERS --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-crown mr-2 text-warning opacity-50"></i> {{ __('Top Sellers') }}
                </h3>
            </div>
            <div class="card-body p-0">
                {{-- Leader Item Helper Pattern --}}
                @php
                    $leaders = [
                        ['label' => __('Top Performing Partner'), 'val' => $metrics['top_partners']['partner_name'], 'sub' => $metrics['top_partners']['partner_rating'] . ' ' . __('RATING'), 'icon' => 'fa-user-tie', 'bg' => 'success'],
                        ['label' => __('Elite Marketplace Asset'), 'val' => $metrics['top_partners']['listing_title'], 'sub' => $metrics['top_partners']['listing_rating'] . ' ' . __('SCORE'), 'icon' => 'fa-award', 'bg' => 'primary'],
                        ['label' => __('Peak Volume Engine'), 'val' => $metrics['top_partners']['booked_listing'], 'sub' => $metrics['top_partners']['booked_count'] . ' ' . __('BOOKINGS'), 'icon' => 'fa-chart-line', 'bg' => 'info'],
                    ];
                @endphp

                @foreach($leaders as $l)
                <div class="px-4 py-3 {{ $loop->first ? 'bg-light-soft' : 'bg-white' }} {{ !$loop->last ? 'border-bottom' : '' }} d-flex align-items-center">
                    <div class="icon-box-soft md bg-{{ $l['bg'] }}-soft text-{{ $l['bg'] }} mr-3 shadow-xs">
                        <i class="fas {{ $l['icon'] }} fa-lg"></i>
                    </div>
                    <div class="flex-grow-1">
                        <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ $l['label'] }}</small>
                        <span class="font-weight-bold text-dark d-block text-truncate" style="max-width: 220px;">{{ $l['val'] }}</span>
                        <div class="d-flex align-items-center mt-1">
                            <span class="badge badge-{{ $l['bg'] }}-light px-2 py-1 rounded-pill font-weight-bold smallest text-uppercase">
                                <i class="fas fa-check-circle mr-1"></i>{{ $l['sub'] }}
                            </span>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
