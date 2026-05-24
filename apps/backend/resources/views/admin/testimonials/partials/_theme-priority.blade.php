<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">{{ __('Theme Priority') }}</h3>
        <p class="text-muted small mb-0">{{ __('Leave all themes unchecked to make this testimonial global.') }}</p>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-premium mb-0">
                <thead class="thead-light">
                    <tr>
                        <th class="px-4">{{ __('Theme') }}</th>
                        <th class="text-center">{{ __('Enabled') }}</th>
                        <th>{{ __('Priority') }}</th>
                        <th class="text-center px-4">{{ __('Featured') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($themes as $theme)
                        @php
                            $assignment = $assignedThemes->get($theme->id);
                            $oldEnabled = old("themes.{$theme->id}.enabled", $assignment ? 1 : 0);
                            $oldPriority = old("themes.{$theme->id}.priority", $assignment?->pivot?->priority ?? 0);
                            $oldFeatured = old("themes.{$theme->id}.is_featured", $assignment?->pivot?->is_featured ?? 0);
                        @endphp
                        <tr>
                            <td class="align-middle px-4">
                                <span class="d-block font-weight-bold text-dark mb-0">{{ $theme->title }}</span>
                                <small class="text-muted text-monospace smallest-0-75">{{ $theme->theme_key }}</small>
                            </td>
                            <td class="text-center align-middle">
                                <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                                    <input type="checkbox"
                                           name="themes[{{ $theme->id }}][enabled]"
                                           value="1"
                                           class="custom-control-input"
                                           id="theme-enabled-{{ $theme->id }}"
                                           @checked((bool) $oldEnabled)>
                                    <label class="custom-control-label" for="theme-enabled-{{ $theme->id }}"></label>
                                </div>
                            </td>
                            <td class="align-middle" style="width:160px;">
                                <input type="number" min="0" name="themes[{{ $theme->id }}][priority]" class="form-control form-control-sm form-control-premium" value="{{ $oldPriority }}">
                            </td>
                            <td class="text-center align-middle px-4">
                                <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                                    <input type="checkbox"
                                           name="themes[{{ $theme->id }}][is_featured]"
                                           value="1"
                                           class="custom-control-input"
                                           id="theme-featured-{{ $theme->id }}"
                                           @checked((bool) $oldFeatured)>
                                    <label class="custom-control-label" for="theme-featured-{{ $theme->id }}"></label>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
