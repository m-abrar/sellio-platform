@php
    $scorePresets = [
        ['title' => 'Walk Score', 'units' => '/100'],
        ['title' => 'Transit Score', 'units' => '/100'],
        ['title' => 'Bike Score', 'units' => '/100'],
        ['title' => 'School Rating', 'units' => '/10'],
        ['title' => 'Safety Index', 'units' => '/10'],
    ];

    $scoreRows = old('scores');
    if ($scoreRows === null) {
        $scoreRows = ($property->exists && $property->relationLoaded('scores') && $property->scores->isNotEmpty())
            ? $property->scores->map(fn($s) => [
                'title' => $s->title,
                'score' => $s->score,
                'units' => $s->units,
                'description' => $s->description,
            ])->toArray()
            : [];
    }

    $scoreIndex = count($scoreRows);
@endphp

<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center property-editor-card-header">
        <div>
            <h3 class="card-title-main mb-1">{{ __('Livability & Accessibility Scores') }}</h3>
            <p class="text-muted small mb-0">{{ __('Walk Score, transit ratings, school ratings, and other lifestyle metrics shown on the property detail page.') }}</p>
        </div>
        <button type="button" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium small uppercase letter-spacing-1 flex-shrink-0" data-action="add-score">
            <i class="fas fa-plus-circle mr-1"></i> {{ __('Add Score') }}
        </button>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="table-responsive rounded-xl border border-light-soft">
            <table class="table table-premium mb-0 admin-repeatable-table" id="scoresTable" data-next-index="{{ $scoreIndex }}">
                <thead class="bg-light">
                    <tr>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-metric">{{ __('Metric') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-score">{{ __('Score') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-units">{{ __('Units') }}</th>
                        <th class="px-4 py-3 small uppercase letter-spacing-1 col-metric">{{ __('Label') }}</th>
                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1 col-action">{{ __('Action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($scoreRows as $loopIndex => $score)
                        <tr data-index="{{ $loopIndex }}">
                            <td class="px-4 py-3">
                                <input type="text" name="scores[{{ $loopIndex }}][title]" value="{{ $score['title'] ?? '' }}" list="property-score-presets" class="form-control form-control-premium" placeholder="{{ __('Walk Score') }}" required>
                            </td>
                            <td class="px-4 py-3">
                                <input type="number" step="0.01" min="0" name="scores[{{ $loopIndex }}][score]" value="{{ $score['score'] ?? '' }}" class="form-control form-control-premium" placeholder="85" required>
                            </td>
                            <td class="px-4 py-3">
                                <input type="text" name="scores[{{ $loopIndex }}][units]" value="{{ $score['units'] ?? '' }}" class="form-control form-control-premium" placeholder="/100">
                            </td>
                            <td class="px-4 py-3">
                                <input type="text" name="scores[{{ $loopIndex }}][description]" value="{{ $score['description'] ?? '' }}" class="form-control form-control-premium" placeholder="{{ __('Excellent') }}">
                            </td>
                            <td class="px-4 py-3 text-center">
                                <button type="button" class="btn btn-danger btn-xs rounded-circle" data-action="remove-row"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @if($scoreIndex === 0)
            <p class="text-muted small mb-0 mt-3">{{ __('No scores added yet. Use common presets like Walk Score or School Rating, or enter a custom metric.') }}</p>
        @endif
    </div>
</div>

<datalist id="property-score-presets">
    @foreach($scorePresets as $preset)
        <option value="{{ $preset['title'] }}">{{ $preset['units'] }}</option>
    @endforeach
</datalist>
