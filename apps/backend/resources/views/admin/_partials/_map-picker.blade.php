@php
    $mapPickerModel = $model ?? null;
    $mapPickerTitle = $title ?? __('Pinned Location');
    $mapPickerName = $name ?? 'location';
    $mapPickerSlug = \Illuminate\Support\Str::slug($mapPickerName, '_');
    $latitudeName = $latitudeName ?? 'latitude';
    $longitudeName = $longitudeName ?? 'longitude';
    $latitudeId = $latitudeId ?? $mapPickerSlug . '_latitude';
    $longitudeId = $longitudeId ?? $mapPickerSlug . '_longitude';
    $mapId = $mapId ?? $mapPickerSlug . '_map';
    $callbackName = 'init_' . \Illuminate\Support\Str::camel($mapPickerSlug) . '_map';
    $googleMapsApiKey = config('services.google_maps.api_key') ?: setting('google_map_api_key');
    $latitudeValue = old($latitudeName, $mapPickerModel?->{$latitudeName} ?? '');
    $longitudeValue = old($longitudeName, $mapPickerModel?->{$longitudeName} ?? '');
@endphp

<div class="map-picker">
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h4 class="font-weight-bold text-dark small uppercase letter-spacing-1 mb-0">
            <i class="fas fa-map-marker-alt mr-2 text-primary opacity-50"></i>{{ $mapPickerTitle }}
        </h4>
        @if($googleMapsApiKey)
            <span class="badge badge-success-light text-success px-3 py-2 rounded-pill small uppercase letter-spacing-1">{{ __('Map Enabled') }}</span>
        @endif
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="form-group mb-3">
                <label for="{{ $latitudeId }}" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Latitude') }}</label>
                <input type="text"
                       id="{{ $latitudeId }}"
                       name="{{ $latitudeName }}"
                       class="form-control form-control-premium @error($latitudeName) is-invalid @enderror"
                       value="{{ $latitudeValue }}"
                       placeholder="37.774900">
                @error($latitudeName) <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group mb-3">
                <label for="{{ $longitudeId }}" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Longitude') }}</label>
                <input type="text"
                       id="{{ $longitudeId }}"
                       name="{{ $longitudeName }}"
                       class="form-control form-control-premium @error($longitudeName) is-invalid @enderror"
                       value="{{ $longitudeValue }}"
                       placeholder="-122.419400">
                @error($longitudeName) <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
            </div>
        </div>
    </div>

    @if($googleMapsApiKey)
        <div id="{{ $mapId }}" class="admin-map-picker-canvas border rounded-lg shadow-xs overflow-hidden"></div>
    @endif
</div>

@if($googleMapsApiKey)
    @once
        @push('css')
            <style>
                .admin-map-picker-canvas {
                    min-height: 280px;
                    background: #f4f6f9;
                }
            </style>
        @endpush
    @endonce

    @push('js')
        <script>
            window.{{ $callbackName }} = function () {
                const latInput = document.getElementById(@json($latitudeId));
                const lngInput = document.getElementById(@json($longitudeId));
                const mapElement = document.getElementById(@json($mapId));

                if (!latInput || !lngInput || !mapElement || !window.google || !google.maps) {
                    return;
                }

                const readPosition = () => {
                    const lat = parseFloat(latInput.value);
                    const lng = parseFloat(lngInput.value);

                    return {
                        lat: Number.isFinite(lat) ? lat : 0,
                        lng: Number.isFinite(lng) ? lng : 0,
                    };
                };

                const initialPosition = readPosition();
                const hasCoordinates = latInput.value !== '' && lngInput.value !== '';

                const map = new google.maps.Map(mapElement, {
                    center: initialPosition,
                    zoom: hasCoordinates ? 15 : 2,
                    mapTypeControl: false,
                    streetViewControl: false,
                });

                const marker = new google.maps.Marker({
                    position: initialPosition,
                    map,
                    draggable: true,
                    title: @json(__('Drag to set location')),
                });

                const writePosition = (position) => {
                    latInput.value = position.lat().toFixed(7);
                    lngInput.value = position.lng().toFixed(7);
                };

                marker.addListener('dragend', function (event) {
                    writePosition(event.latLng);
                });

                [latInput, lngInput].forEach((input) => {
                    input.addEventListener('change', function () {
                        const position = readPosition();
                        marker.setPosition(position);
                        map.setCenter(position);
                        map.setZoom(15);
                    });
                });
            };
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key={{ urlencode($googleMapsApiKey) }}&callback={{ $callbackName }}" async defer></script>
    @endpush
@endif
