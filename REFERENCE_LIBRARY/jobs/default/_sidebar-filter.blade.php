<div class="filter-sidebar-wrapper w-100">
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            salaryRange: {{ (int) request('min_salary', 50000) }},
            showCategories: {{ request('categories') ? 'true' : 'false' }}, 
            showTypes: {{ request('type_id') ? 'true' : 'false' }},
            showSkills: {{ request('tags') ? 'true' : 'false' }},
            showExperience: {{ request('experience_level') ? 'true' : 'false' }},
            showWorkplace: {{ request('workplace_type') ? 'true' : 'false' }}
        }"
    >
        {{-- Header --}}
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Refine Search') }}
            </h6>
            <a href="{{ route('jobs.index') }}" class="text-muted small text-decoration-none hover-link">{{ __('Reset') }}</a>
        </div>
        
        <form method="GET" action="{{ route('jobs.index') }}" id="filter-form">
            
            {{-- 1. Keywords (Unified Input) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Keywords') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" name="q" value="{{ request('q') }}" 
                           class="form-control" 
                           placeholder="{{ __('Job title, skills...') }}">
                </div>
            </div>

            {{-- 2. Location (Unified Input with Select) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Location') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text">
                        <i class="bi bi-geo-alt"></i>
                    </span>
                    <select name="location_id" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('Anywhere') }}</option>
                        @foreach($locations as $loc)
                            <option value="{{ $loc->id }}" {{ request('location_id') == $loc->id ? 'selected' : '' }}>
                                {{ $loc->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 3. Min Salary Slider --}}
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="filter-label mb-0">{{ __('Min Salary') }}</label>
                    <span class="badge bg-primary rounded-pill px-3 shadow-sm">
                        $<span x-text="Number(salaryRange).toLocaleString()"></span>
                    </span>
                </div>
                <input type="range" name="min_salary" class="form-range custom-range" 
                       min="0" max="250000" step="5000" x-model="salaryRange">
            </div>

            {{-- 4. Employment Type --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showTypes = !showTypes">
                    <label class="filter-label mb-0 text-dark">{{ __('Employment Type') }}</label>
                    <i class="bi small text-muted" :class="showTypes ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTypes" x-collapse>
                    <div class="pt-1 pb-2">
                        @foreach($types as $type)
                            <div class="form-check mb-2">
                                <input class="form-check-input shadow-none" type="checkbox" name="type_id[]" value="{{ $type->id }}" id="type_{{ $type->id }}" 
                                    {{ is_array(request('type_id')) && in_array($type->id, request('type_id')) ? 'checked' : '' }}>
                                <label class="form-check-label small text-muted" for="type_{{ $type->id }}">{{ $type->title }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- 5. Industries --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showCategories = !showCategories">
                    <label class="filter-label mb-0 text-dark">{{ __('Industries') }}</label>
                    <i class="bi small text-muted" :class="showCategories ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showCategories" x-collapse>
                    <div class="pt-1 pb-2">
                        @foreach($categories as $cat)
                            <div class="form-check mb-2">
                                <input class="form-check-input shadow-none" type="checkbox" name="categories[]" value="{{ $cat->id }}" id="cat_{{ $cat->id }}" 
                                    {{ is_array(request('categories')) && in_array($cat->id, request('categories')) ? 'checked' : '' }}>
                                <label class="form-check-label small text-muted" for="cat_{{ $cat->id }}">{{ $cat->title }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- 6. Experience --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showExperience = !showExperience">
                    <label class="filter-label mb-0 text-dark">{{ __('Experience') }}</label>
                    <i class="bi small text-muted" :class="showExperience ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showExperience" x-collapse>
                    <div class="pt-1 pb-2">
                        <select name="experience_level" class="form-select filter-input shadow-none small">
                            <option value="">{{ __('Any Level') }}</option>
                            @foreach($experienceLevels as $id => $label)
                                <option value="{{ $id }}" {{ request('experience_level') == $id ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            {{-- 7. Workplace Model --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showWorkplace = !showWorkplace">
                    <label class="filter-label mb-0 text-dark">{{ __('Workplace Model') }}</label>
                    <i class="bi small text-muted" :class="showWorkplace ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showWorkplace" x-collapse>
                    <div class="pt-1 pb-2">
                        <select name="workplace_type" class="form-select filter-input shadow-none small">
                            <option value="">{{ __('All Models') }}</option>
                            @foreach($workplaceTypes as $id => $label)
                                <option value="{{ $id }}" {{ request('workplace_type') == $id ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            {{-- 8. Required Skills (Pill Style) --}}
            @isset($tags)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showSkills = !showSkills">
                    <label class="filter-label mb-0 text-dark">{{ __('Required Skills') }}</label>
                    <i class="bi small text-muted" :class="showSkills ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showSkills" x-collapse>
                    <div class="pt-2 d-flex flex-wrap gap-2">
                        @foreach($tags as $tag)
                            <input type="checkbox" class="btn-check" name="tags[]" value="{{ $tag->id }}" id="tag_{{ $tag->id }}" 
                                {{ is_array(request('tags')) && in_array($tag->id, request('tags')) ? 'checked' : '' }}>
                            <label class="btn btn-outline-primary-theme btn-sm rounded-pill px-3 py-1 smallest" for="tag_{{ $tag->id }}">
                                {{ $tag->title }}
                            </label>
                        @endforeach
                    </div>
                </div>
            </div>
            @endisset

            {{-- Submit Button --}}
            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-800 mt-4 border-0">
                <i class="bi bi-search me-2"></i>{{ __('Apply Filters') }}
            </button>
        </form>
    </div>
</div>