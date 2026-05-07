{{--
    Administrative Financial Module: Payment Gateway Configuration Factory
    
    This component provides a dynamic form generation engine for payment 
    gateway credentials and environment settings. It orchestrates 
    the rendering of configuration blueprints, managing input types 
    (password, textarea, checkbox), sensitive data masking, and 
    validation feedback for both sandbox and production environments.
    
    @context Financial Management
    @variables Array $config Decrypted configuration parameters.
    @variables String $environment Target environment (sandbox/production).
    @variables Collection $blueprints Schema definitions for gateway inputs.
--}}

<div class="pt-3">
    @foreach ($blueprints as $blueprint)
        @php
            $key = $blueprint->key;
            $name = $environment . '_config[' . $key . ']';
            // Get the value from the existing, decrypted config array
            $value = $config[$key] ?? '';
            $isInvalid = $errors->has($name);
        @endphp

        <div class="form-group row">
            <label for="{{ $name }}" class="col-sm-3 col-form-label">
                {{ $blueprint->label }} 
                @if ($blueprint->is_required) <span class="text-danger">*</span> @endif
            </label>
            <div class="col-sm-9">
                @if ($blueprint->input_type === 'password')
                    <input type="password" name="{{ $name }}" id="{{ $name }}"
                           class="form-control @if($isInvalid) is-invalid @endif"
                           placeholder="Enter {{ $blueprint->label }}"
                           {{ $blueprint->is_required ? 'required' : '' }}
                           autocomplete="new-password">
                    <small class="form-text text-muted">
                        {{ $blueprint->is_sensitive ? 'Sensitive: Leave blank to keep existing value.' : '' }}
                    </small>
                @elseif ($blueprint->input_type === 'textarea')
                    <textarea name="{{ $name }}" id="{{ $name }}"
                              class="form-control @if($isInvalid) is-invalid @endif"
                              rows="3" {{ $blueprint->is_required ? 'required' : '' }}>{{ old($name, $value) }}</textarea>
                @elseif ($blueprint->input_type === 'checkbox')
                    <div class="custom-control custom-checkbox pt-2">
                        <input type="hidden" name="{{ $name }}" value="0">
                        <input class="custom-control-input" type="checkbox" id="{{ $name }}" name="{{ $name }}" value="1" 
                               {{ old($name, $value) == 1 ? 'checked' : '' }}>
                        <label for="{{ $name }}" class="custom-control-label">{{ $blueprint->description ?? 'Enable this feature.' }}</label>
                    </div>
                @else
                    <input type="text" name="{{ $name }}" id="{{ $name }}"
                           class="form-control @if($isInvalid) is-invalid @endif"
                           value="{{ old($name, $value) }}"
                           {{ $blueprint->is_required ? 'required' : '' }}>
                @endif
                
                @error($name) <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                @if ($blueprint->description && $blueprint->input_type !== 'checkbox')
                    <small class="form-text text-muted">{{ $blueprint->description }}</small>
                @endif
            </div>
        </div>
    @endforeach
</div>
