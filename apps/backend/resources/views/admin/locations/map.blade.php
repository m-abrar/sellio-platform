<div id="map-container" class="position-relative shadow-xs border rounded" style="overflow: hidden;">
    <div id="map" style="width: 100%; height: 320px; background-color: #e9ecef;">
        {{-- Loading State Placeholder --}}
        <div class="d-flex align-items-center justify-content-center h-100 text-muted">
            <div class="text-center">
                <i class="fas fa-circle-notch fa-spin fa-2x mb-2 text-primary"></i>
                <p class="small font-weight-600 mb-0">Loading Google Maps...</p>
            </div>
        </div>
    </div>
</div>

@push('js')
<script>
    function initMap() {
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        
        // Parse current values or default to a neutral center (e.g., 0,0 or a specific default)
        let lat = parseFloat(latInput.value) || 0;
        let lng = parseFloat(lngInput.value) || 0;
        let initialZoom = (lat === 0 && lng === 0) ? 2 : 15;

        const mapOptions = {
            center: { lat, lng },
            zoom: initialZoom,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
                {
                    "featureType": "poi.business",
                    "stylers": [{ "visibility": "off" }]
                }
            ]
        };

        const map = new google.maps.Map(document.getElementById('map'), mapOptions);

        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            // Customizing the marker color logic via icon if desired
            title: "Drag to set location"
        });

        // Update inputs when marker is moved
        marker.addListener('dragend', function(event) {
            const newLat = event.latLng.lat().toFixed(7);
            const newLng = event.latLng.lng().toFixed(7);
            
            latInput.value = newLat;
            lngInput.value = newLng;
            
            // Subtle UI feedback
            console.log(`Coordinates updated: ${newLat}, ${newLng}`);
        });

        // Optional: Update marker if user types in coordinates manually
        [latInput, lngInput].forEach(input => {
            input.addEventListener('change', function() {
                let updatedLat = parseFloat(latInput.value) || 0;
                let updatedLng = parseFloat(lngInput.value) || 0;
                let newPos = { lat: updatedLat, lng: updatedLng };
                
                marker.setPosition(newPos);
                map.setCenter(newPos);
                map.setZoom(15);
            });
        });
    }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key={{ setting('google_map_api_key') }}&callback=initMap" async defer></script>
@endpush
