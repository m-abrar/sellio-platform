@php
    $seasonalRows = old('seasonal_prices');
    if ($seasonalRows === null) {
        $seasonalRows = ($property->exists && $property->relationLoaded('prices') && $property->prices->isNotEmpty())
            ? $property->prices->map(fn($p) => [
                'name' => $p->title,
                'start_date' => $p->start_date?->format('Y-m-d'),
                'end_date' => $p->end_date?->format('Y-m-d'),
                'price' => $p->price,
            ])->toArray()
            : [];
    }

    $seasonalIndex = count($seasonalRows);
@endphp

<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center property-editor-card-header">
        <div>
            <h3 class="card-title-main mb-1">{{ __('Seasonal Rental Rates') }}</h3>
            <p class="text-muted small mb-0">{{ __('Override the nightly rate during peak seasons, holidays, or special date ranges. Shown on rental property detail pages.') }}</p>
        </div>
        <button type="button" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium small uppercase letter-spacing-1 flex-shrink-0" data-action="add-seasonal-price">
            <i class="fas fa-plus-circle mr-1"></i> {{ __('Add Season') }}
        </button>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="table-responsive rounded-xl border border-light-soft">
            <table class="table table-premium mb-0 admin-repeatable-table" id="seasonalPricesTable" data-next-index="{{ $seasonalIndex }}">
                <thead class="bg-light">
                    <tr>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-metric">{{ __('Season Name') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-date">{{ __('Start Date') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-date">{{ __('End Date') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-price">{{ __('Nightly Rate') }}</th>
                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1 col-action">{{ __('Action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($seasonalRows as $loopIndex => $season)
                        <tr data-index="{{ $loopIndex }}">
                            <td class="px-4 py-3">
                                <input type="text" name="seasonal_prices[{{ $loopIndex }}][name]" value="{{ $season['name'] ?? '' }}" class="form-control form-control-premium" placeholder="{{ __('Summer Peak') }}" required>
                            </td>
                            <td class="px-4 py-3">
                                <input type="date" name="seasonal_prices[{{ $loopIndex }}][start_date]" value="{{ $season['start_date'] ?? '' }}" class="form-control form-control-premium" required>
                            </td>
                            <td class="px-4 py-3">
                                <input type="date" name="seasonal_prices[{{ $loopIndex }}][end_date]" value="{{ $season['end_date'] ?? '' }}" class="form-control form-control-premium" required>
                            </td>
                            <td class="px-4 py-3">
                                <input type="number" step="0.01" min="0" name="seasonal_prices[{{ $loopIndex }}][price]" value="{{ $season['price'] ?? '' }}" class="form-control form-control-premium" placeholder="0.00" required>
                            </td>
                            <td class="px-4 py-3 text-center">
                                <button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @if($seasonalIndex === 0)
            <p class="text-muted small mb-0 mt-3">{{ __('No seasonal overrides yet. Rentals will use the standard price per night across all dates.') }}</p>
        @endif
    </div>
</div>
