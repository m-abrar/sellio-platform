<?php

namespace App\Services;

use App\Models\Amenity;
use App\Models\Feature;
use App\Models\Category;
use App\Models\Location;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Tag;
use App\Models\User;
use App\Models\TransactionLine;
use App\Events\Partner\PartnerLeadCreated;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class PropertyService
 *
 * Provides centralized business logic for property discovery, seasonal pricing calculations, 
 * secure booking transactions, and multi-vertical taxonomy retrieval.
 */
class PropertyService
{
    /**
     * Retrieve all data required for the property search page.
     * Uses caching to optimize heavy aggregate queries and taxonomy retrieval.
     *
     * @param array $filters The validated search parameters.
     * @param User|null $user The currently authenticated user (optional).
     * @return array
     */
    public function getSearchPageData(array $filters, ?User $user): array
    {
        // Calculate Max Price (Cached to prevent heavy aggregate query on every search)
        $maxAllowedPrice = \Illuminate\Support\Facades\Cache::remember('property_max_price', 3600, function() {
            $rawMax = Property::active()
                ->selectRaw('MAX(COALESCE(sale_price, base_price)) as max_price')
                ->value('max_price');
            return $this->roundUpPrice($rawMax) ?? 1000000;
        });

        $checkIn = isset($filters['check_in']) ? Carbon::createFromFormat('Y-m-d', $filters['check_in']) : null;
        $checkOut = isset($filters['check_out']) ? Carbon::createFromFormat('Y-m-d', $filters['check_out']) : null;

        // Execute filtered search
        $query = $this->applyFilters(Property::query(), $filters, $checkIn, $checkOut, $user);

        if ($this->shouldUseCuratedDemoLimit($filters, $user)) {
            $curatedIds = (clone $query)
                ->limit(30)
                ->pluck('properties.id');

            $query = $this->applyFilters(Property::query()->whereKey($curatedIds), $filters, $checkIn, $checkOut, $user);
        }

        $properties = $query->paginate(12);

        $numberOfNights = ($checkIn && $checkOut && $checkIn->lt($checkOut)) 
            ? $checkIn->diffInDays($checkOut) 
            : null;

        if ($numberOfNights) {
            foreach ($properties as $property) {
                if ($property->is_rental) {
                    $property->lodging_amount = $this->calculateLodgingAmount($property, $checkIn, $checkOut);
                    $property->number_of_nights = $numberOfNights;
                }
            }
        }

        // Retrieve Taxonomies (Cached)
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        $categories = \Illuminate\Support\Facades\Cache::remember('property_categories', 3600, fn() => Category::where('is_property', true)->withCount($verticals)->get());
        $locations  = \Illuminate\Support\Facades\Cache::remember('property_locations', 3600, fn() => Location::where('is_property', true)->withCount($locationVerticals)->get());
        $amenities  = \Illuminate\Support\Facades\Cache::remember('property_amenities', 3600, fn() => \App\Models\Amenity::where('is_property', true)->pluck('title', 'id'));
        $features   = \Illuminate\Support\Facades\Cache::remember('property_features', 3600, fn() => \App\Models\Feature::where('is_property', true)->pluck('title', 'id'));
        $tags       = \Illuminate\Support\Facades\Cache::remember('property_tags', 3600, fn() => Tag::where('is_property', true)->withCount($tagVerticals)->get());
        $agents     = \Illuminate\Support\Facades\Cache::remember('property_top_agents', 600, fn() => User::orderByRating()->take(6)->with('media')->get());

        return [
            'properties'       => $properties,
            'categories'       => $categories,
            'locations'        => $locations,
            'amenities'        => $amenities,
            'features'         => $features,
            'tags'             => $tags,
            'agents'           => $agents,
            'maxAllowedPrice'  => $maxAllowedPrice,
            'numberOfNights'   => $numberOfNights,
        ];
    }

    /**
     * Internal helper to apply filters to the Property query.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $f
     * @param Carbon|null $checkIn
     * @param Carbon|null $checkOut
     * @param User|null $user
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function applyFilters($query, array $f, ?Carbon $checkIn, ?Carbon $checkOut, ?User $user)
    {
        $query->visibleTo($user)->orderByDesc('is_featured')->latest();

        $query->when($f['search'] ?? null, fn($q, $v) => $q->where(fn($sq) => $sq->where('title', 'like', "%$v%")->orWhere('description', 'like', "%$v%")));
        $query->when($f['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v));
        $query->when($f['location'] ?? null, fn($q, $v) => $q->where('location_id', $v));
        
        if (($f['property_type'] ?? null) === 'rental') {
            $query->where('is_rental', true);
            if ($checkIn && $checkOut) {
                $query->whereDoesntHave('bookings', function ($b) use ($checkIn, $checkOut) {
                    $b->where('status', '!=', 'cancelled')
                      ->where('check_in_date', '<', $checkOut->format('Y-m-d'))
                      ->where('check_out_date', '>', $checkIn->format('Y-m-d'));
                });
            }
        } elseif (($f['property_type'] ?? null) === 'sale') {
            $query->where('is_sale', true);
            $query->when($f['min_price'] ?? null, fn($q, $v) => $q->where(fn($sq) => $sq->where('sale_price', '>=', $v)->orWhere(fn($ssq) => $ssq->whereNull('sale_price')->where('base_price', '>=', $v))));
            $query->when($f['max_price'] ?? null, fn($q, $v) => $q->where(fn($sq) => $sq->where('sale_price', '<=', $v)->orWhere(fn($ssq) => $ssq->whereNull('sale_price')->where('base_price', '<=', $v))));
        }

        return $query->with(['prices', 'location', 'category', 'user', 'media']);
    }

    private function shouldUseCuratedDemoLimit(array $filters, ?User $user): bool
    {
        if ($user !== null) {
            return false;
        }

        return collect($filters)
            ->reject(fn ($value) => $value === null || $value === '' || $value === [])
            ->isEmpty();
    }

    /**
     * Calculate the total lodging amount for a given date range, accounting for seasonal price overrides.
     *
     * @param Property $property
     * @param Carbon $checkIn
     * @param Carbon $checkOut
     * @return float
     */
    public function calculateLodgingAmount(Property $property, Carbon $checkIn, Carbon $checkOut): float
    {
        $lodgingAmount = 0;
        $period = CarbonPeriod::create($checkIn, $checkOut->copy()->subDay());

        foreach ($period as $date) {
            $seasonalPrice = $property->prices->first(fn($p) => $date->between(Carbon::parse($p->start_date), Carbon::parse($p->end_date), true));
            $lodgingAmount += $seasonalPrice->price ?? $property->price_per_night ?? 0;
        }

        return (float) $lodgingAmount;
    }

    /**
     * Log listing view activity using the Spatie ActivityLog framework.
     *
     * @param Property $property
     * @return void
     */
    public function logListingView(Property $property): void
    {
        activity('listings')
            ->performedOn($property)
            ->causedBy(auth()->user())
            ->withProperties(['ip' => request()->ip()])
            ->log('viewed_listing');
    }

    /**
     * Retrieve a property by its slug, ensuring it is visible to the current user and fully hydrated with metadata.
     *
     * @param string $slug
     * @param User|null $user
     * @return Property
     */
    public function findVisibleBySlug(string $slug, ?User $user): Property
    {
        return Property::where('slug', $slug)
            ->visibleTo($user)
            ->with([
                'user' => fn($q) => $q
                    ->withCount([
                        'properties as active_properties_count' => fn($pq) => $pq->active(),
                        'properties as sale_properties_count' => fn($pq) => $pq->active()->where('is_sale', true),
                    ]),
                'category', 'location', 'amenities', 'features',
                'fees', 'addons', 'neighborhoods', 'scores', 'reviews.user', 'media',
                'prices' => fn($q) => $q->orderBy('start_date'),
            ])
            ->firstOrFail();
    }

    /**
     * Compile all data required for the property detail view, including related items and current bookings.
     *
     * @param Property $property
     * @return array
     */
    public function getPropertyDetailsData(Property $property): array
    {
        $bookings = collect();
        $bookedDateRanges = collect();

        if ($property->is_rental) {
            $statusColors = ['confirmed' => '#ef4444', 'pending' => '#fde68a'];
            
            // Limit reviews to prevent memory exhaustion on high-traffic listings
            $property->load(['reviews' => function($query) {
                $query->with('user')->latest()->take(10);
            }]);

            $bookings = PropertyBooking::where('property_id', $property->id)
                ->where('status', '!=', 'cancelled')
                ->get()
                ->map(fn($b) => [
                    'start' => Carbon::parse($b->check_in_date)->toDateString(),
                    'end'   => Carbon::parse($b->check_out_date)->subDay()->toDateString(),
                    'status' => $b->status,
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                ]);

            $bookedDateRanges = $bookings
                ->map(fn(array $booking) => [
                    'from' => $booking['start'],
                    'to' => $booking['end'],
                ])
                ->values();
        }

        return [
            'property'          => $property,
            'bookings'          => $bookings,
            'bookedDateRanges'  => $bookedDateRanges,
            'relatedProperties' => $this->getRelatedProperties($property),
        ];
    }

    /**
     * Generate a quick estimation for AJAX price calculators.
     *
     * @param Property $property
     * @param string $in Check-in date string.
     * @param string $out Check-out date string.
     * @return array
     */
    public function calculateEstimatedLodging(Property $property, string $in, string $out): array
    {
        $checkIn = Carbon::parse($in);
        $checkOut = Carbon::parse($out);
        $lodgingAmount = $this->calculateLodgingAmount($property, $checkIn, $checkOut);

        return [
            'total_nights' => $checkIn->diffInDays($checkOut, true),
            'estimated_lodging_total' => number_format($lodgingAmount, 2, '.', ''),
            'estimated_lodging_total_formatted' => format_currency($lodgingAmount),
        ];
    }

    /**
     * Atomically process a property booking, including financial ledger entries for fees and addons.
     *
     * @param array $data The validated booking request data.
     * @return array
     * @throws \Exception
     */
    public function createOrRetrieveBooking(array $data): array
    {
        $property = Property::with(['fees', 'addons'])->findOrFail($data['property_id']);
        $checkIn  = Carbon::parse($data['check_in']);
        $checkOut = Carbon::parse($data['check_out']);
        $nights   = max(1, $checkIn->diffInDays($checkOut));

        return DB::transaction(function () use ($property, $data, $checkIn, $checkOut, $nights) {
            
            // Calculate the dynamic breakdown (Lodging + Fees)
            $breakdown = $this->calculateBookingBreakdown($property, $data['check_in'], $data['check_out'], (int)$data['guests']);
            $totalPrice = $breakdown['initial_total'];

            // Process Add-ons
            $selectedAddons = [];
            if (!empty($data['add_ons'])) {
                foreach ($data['add_ons'] as $addonId => $input) {
                    $qty = (int) ($input['qty'] ?? 0);
                    if ($qty > 0) {
                        $addon = $property->addons->find($addonId);
                        if ($addon) {
                            $addonCost = ($addon->type === 'per_night') 
                                ? ($addon->price * $qty * $nights) 
                                : ($addon->price * $qty);
                            
                            $totalPrice += $addonCost;
                            $selectedAddons[] = [
                                'title' => $addon->title,
                                'qty'   => $qty,
                                'cost'  => $addonCost,
                            ];
                        }
                    }
                }
            }

            // Create or Update Booking record
            $booking = PropertyBooking::where([
                'property_id'   => $property->id,
                'check_in_date' => $checkIn->toDateString(),
                'check_out_date'=> $checkOut->toDateString(),
                'user_id'       => auth()->id(),
                'status'        => 'pending',
            ])->first();

            if (!$booking) {
                $booking = new PropertyBooking([
                    'property_id'   => $property->id,
                    'check_in_date' => $checkIn->toDateString(),
                    'check_out_date'=> $checkOut->toDateString(),
                ]);
                $booking->user_id = auth()->id();
                $booking->status = 'pending';
            }

            $booking->fill([
                'full_name'   => $data['full_name'],
                'email'       => $data['email'],
                'phone'       => $data['phone'] ?? null,
                'guests'      => $data['guests'],
                'message'     => $data['message'] ?? null,
            ]);
            
            $booking->total_price = $totalPrice;
            $wasRecentlyCreated = !$booking->exists || $booking->wasRecentlyCreated;
            $booking->save();

            if ($wasRecentlyCreated) {
                PartnerLeadCreated::dispatch($booking);
            }

            // Clear old transaction lines for idempotent updates
            $booking->transactionLines()->delete();
            $booking->lineItems()->delete();

            $bookingLineItems = collect($breakdown['lines'])
                ->map(fn(array $line) => [
                    'title' => $line['title'],
                    'quantity' => 1,
                    'price' => round((float) $line['amount'], 2),
                ]);

            // Persist revenue lines for ledger tracking
            foreach ($breakdown['lines'] as $line) {
                $transactionLine = $booking->transactionLines()->make([
                    'property_id'      => $property->id,
                    'description'      => $line['title'],
                    'transaction_date' => now()->toDateString(),
                ]);
                $transactionLine->amount = $line['amount'];
                $transactionLine->type = 'revenue';
                $transactionLine->save();
            }

            // Save Add-on Lines
            foreach ($selectedAddons as $item) {
                $bookingLineItems->push([
                    'title' => "Add-on: {$item['title']} (x{$item['qty']})",
                    'quantity' => 1,
                    'price' => round((float) $item['cost'], 2),
                ]);

                $transactionLine = $booking->transactionLines()->make([
                    'property_id'      => $property->id,
                    'description'      => "Add-on: {$item['title']} (x{$item['qty']})",
                    'transaction_date' => now()->toDateString(),
                ]);
                $transactionLine->amount = $item['cost'];
                $transactionLine->type = 'revenue';
                $transactionLine->save();
            }

            $booking->lineItems()->createMany($bookingLineItems->all());

            return [
                'booking' => $booking, 
                'property' => $property, 
                'isExisting' => !$booking->wasRecentlyCreated
            ];
        });
    }

    /**
     * Mark a booking as confirmed and finalize the transaction.
     *
     * @param PropertyBooking $booking
     * @return void
     */
    public function confirmBookingPayment(PropertyBooking $booking): void
    {
        DB::transaction(function () use ($booking) {
            if (auth()->check() && !$booking->user_id) {
                $booking->user_id = auth()->id();
            }

            $booking->status = 'confirmed';
            $booking->save();
        });
    }

    /**
     * Calculate a full booking breakdown including seasonal rates, flat fees, and percentage taxes.
     *
     * @param Property $property
     * @param string $startDate
     * @param string $endDate
     * @param int $guestCount
     * @return array
     */
    public function calculateBookingBreakdown(Property $property, string $startDate, string $endDate, int $guestCount): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $nights = $start->diffInDays($end);

        $lines = collect();

        // Calculate Base Lodging
        $lodgingAmount = $this->calculateLodgingAmount($property, $start, $end);
        $lines->push([
            'title'  => __("Base Rental (:nights nights)", ['nights' => $nights]),
            'amount' => round($lodgingAmount, 2),
            'type'   => 'lodging'
        ]);

        // Add Flat Fees (e.g., Cleaning Fee)
        foreach ($property->fees->where('charge_type', 'flat') as $fee) {
            $lines->push([
                'title'  => $fee->title,
                'amount' => (float) $fee->amount,
                'type'   => $fee->type
            ]);
        }

        // Calculate Percentage Fees (e.g., Taxes) on top of lodging + flat fees
        $subtotal = $lines->sum('amount');
        
        foreach ($property->fees->where('charge_type', 'percentage') as $fee) {
            $calculatedAmount = $subtotal * (float) $fee->rate;
            $lines->push([
                'title'  => $fee->title . " (" . ($fee->rate * 100) . "%)",
                'amount' => round($calculatedAmount, 2),
                'type'   => 'percentage_fee'
            ]);
        }

        return [
            'property_id'    => $property->id,
            'check_in'       => $start->format('Y-m-d'),
            'check_out'      => $end->format('Y-m-d'),
            'nights'         => $nights,
            'guests'         => $guestCount,
            'lines'          => $lines->toArray(),
            'initial_total'  => round($lines->sum('amount'), 2),
        ];
    }

    /**
     * Retrieve related property listings based on shared category and location.
     *
     * @param Property $property
     * @return Collection
     */
    protected function getRelatedProperties(Property $property): Collection
    {
        $related = Property::where('id', '!=', $property->id)
            ->visibleTo(auth()->user())
            ->where('category_id', $property->category_id)
            ->where('location_id', $property->location_id)
            ->with(['category', 'location', 'prices', 'reviews.user', 'media'])
            ->limit(4)->get();

        if ($related->count() < 4) {
            $extra = Property::where('id', '!=', $property->id)
                ->visibleTo(auth()->user())
                ->where('category_id', $property->category_id)
                ->whereNotIn('id', $related->pluck('id'))
                ->with(['category', 'location', 'prices', 'reviews.user', 'media'])
                ->inRandomOrder()->limit(4 - $related->count())->get();
            $related = $related->merge($extra);
        }

        return $related;
    }

    /**
     * Helper to round up prices to the nearest significant interval for search filter generation.
     *
     * @param float|null $price
     * @return int|null
     */
    protected function roundUpPrice(?float $price): ?int
    {
        if (!$price || $price <= 0) return null;
        $base = pow(10, floor(log10($price)));
        $rounded = ceil($price / $base) * $base;
        return (int) ($rounded < 100000 ? ceil($price / 50000) * 50000 : $rounded);
    }
}
