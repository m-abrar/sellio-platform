<?php

namespace App\Http\Controllers\Dashboard\Partner\Traits; // Updated Namespace

use App\Models\Property; 
use App\Models\Event; 
use App\Models\Service; 
use App\Models\Classified;
use App\Models\Auto;
use Carbon\Carbon;
use Illuminate\Support\Str;

trait Listings
{
    protected const MIN_TITLE_LENGTH = 15;
    protected const MIN_REQUIRED_PHOTOS = 1; 

    protected function enrichListingData($listing): array
    {
        $humanReadableDate = $listing->created_at ? Carbon::parse($listing->created_at)->diffForHumans() : 'Date N/A';

        $type = 'Listing';
        $editRoute = '#';
        $viewRoute = '#';
        $priceFormatted = null;

        if ($listing instanceof Property) {
            $type = 'Property';
            $editRoute = route('dashboard.partner.properties.edit', $listing->id);
            $viewRoute = route('properties.show', ['property' => $listing->slug]);
            $priceFormatted = isset($listing->price_formatted) ? $listing->price_formatted : null;
        } elseif ($listing instanceof Event) {
            $type = 'Event';
            $editRoute = route('dashboard.partner.events.edit', $listing->id);
            $viewRoute = route('events.show', ['event' => $listing->slug]);
            $priceFormatted = isset($listing->price_formatted) ? $listing->price_formatted : null;
        } elseif ($listing instanceof Auto) {
            $type = 'Auto';
            $editRoute = route('dashboard.partner.autos.edit', $listing->id);
            $viewRoute = route('autos.show', ['auto' => $listing->slug]);
            $priceFormatted = isset($listing->price_formatted) ? $listing->price_formatted : null;
        } elseif ($listing instanceof Service) {
            $type = 'Service';
            $editRoute = route('dashboard.partner.services.edit', $listing->id);
            $viewRoute = route('services.show', ['service' => $listing->slug]);
            $priceFormatted = isset($listing->price_formatted) ? $listing->price_formatted : null;
        } elseif ($listing instanceof Classified) {
            $type = 'Classified';
            $editRoute = route('dashboard.partner.classifieds.edit', $listing->id);
            $viewRoute = route('classifieds.show', ['classified' => $listing->slug]);
            $priceFormatted = isset($listing->price_formatted) ? $listing->price_formatted : null;
        }

        return [
            'id' => $listing->id,
            'title' => Str::limit($listing->title, 50),
            'type' => $type,
            'editRoute' => $editRoute,
            'viewRoute' => $viewRoute,
            'humanReadableDate' => $humanReadableDate,
            'primary_image_url' => $listing->primary_image_url, // Relying on Trait Accessor
            'is_published' => isset($listing->is_published) ? $listing->is_published : false, 
            'price_formatted' => $priceFormatted, 
        ];
    }
}
