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
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class PropertyService
 * * Centralized business logic for Property search, pricing, and booking transactions.
 */
class PropertyService
{
    /**
     * Get all data required for the search view.
     */
    public function getSearchPageData(array $filters, ?User $user): array
    {
        // 1. Calculate Max Price (Cached for 1 hour to prevent heavy aggregate query on every search)
        $maxAllowedPrice = \Illuminate\Support\Facades\Cache::remember('property_max_price', 3600, function() {
            $rawMax = Property::active()
                ->selectRaw('MAX(COALESCE(sale_price, base_price)) as max_price')
                ->value('max_price');
            return $this->roundUpPrice($rawMax) ?? 1000000;
        });

        $checkIn = isset($filters['check_in']) ? Carbon::createFromFormat('m-d-Y', $filters['check_in']) : null;
        $checkOut = isset($filters['check_out']) ? Carbon::createFromFormat('m-d-Y', $filters['check_out']) : null;

        // 2. Execute Search
        $properties = $this->applyFilters(Property::query(), $filters, $checkIn, $checkOut, $user)->paginate(12);

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

        // 3. Retrieve Taxonomies (Cached for 1 hour)
        $categories = \Illuminate\Support\Facades\Cache::remember('property_categories', 3600, fn() => Category::where('is_property', true)->get());
        $locations  = \Illuminate\Support\Facades\Cache::remember('property_locations', 3600, fn() => Location::where('is_property', true)->get());
        $amenities  = \Illuminate\Support\Facades\Cache::remember('property_amenities', 3600, fn() => \App\Models\Amenity::where('is_property', true)->pluck('title', 'id'));
        $features   = \Illuminate\Support\Facades\Cache::remember('property_features', 3600, fn() => \App\Models\Feature::where('is_property', true)->pluck('title', 'id'));
        $tags       = \Illuminate\Support\Facades\Cache::remember('property_tags', 3600, fn() => \App\Models\Tag::where('is_property', true)->pluck('title', 'id'));
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
     * Core filtering logic for properties.
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

        return $query->with('prices');
    }

    /**
     * Calculate seasonal pricing sum.
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
     * Log listing view activity (Spatie ActivityLog).
     */
    public function logListingView(Property $property): void
    {
        $property->increment('view_count');

        activity('listings')
            ->performedOn($property)
            ->causedBy(auth()->user())
            ->withProperties(['ip' => request()->ip()])
            ->log('viewed_listing');
    }

    /**
     * Retrieve a property by its slug, ensuring it is visible to the current user.
     */
    public function findVisibleBySlug(string $slug, ?User $user): Property
    {
        return Property::where('slug', $slug)
            ->visibleTo($user)
            ->with([
                'user', 'category', 'location', 'amenities', 'features',
                'fees', 'addons', 'neighborhoods', 'scores'
            ])
            ->firstOrFail();
    }

    /**
     * Data for the property detail page.
     */
    public function getPropertyDetailsData(Property $property): array
    {
        $bookings = collect();
        if ($property->is_rental) {
            $statusColors = ['confirmed' => '#ef4444', 'pending' => '#fde68a'];
            
            // Paginate or limit reviews to prevent memory exhaustion
            $property->load(['reviews' => function($query) {
                $query->with('user')->latest()->take(10);
            }]);

            $bookings = PropertyBooking::where('property_id', $property->id)
                ->where('status', '!=', 'cancelled')
                ->get()
                ->map(fn($b) => [
                    'start' => Carbon::parse($b->check_in_date)->toDateString(),
                    'end'   => Carbon::parse($b->check_out_date)->subDay()->toDateString(),
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                ]);
        }

        return [
            'property'          => $property,
            'bookings'          => $bookings,
            'relatedProperties' => $this->getRelatedProperties($property),
        ];
    }

    /**
     * Simple estimation for AJAX price calculators.
     */
    public function calculateEstimatedLodging(Property $property, string $in, string $out): array
    {
        $checkIn = Carbon::parse($in);
        $checkOut = Carbon::parse($out);
        return [
            'total_nights' => $checkIn->diffInDays($checkOut, true),
            'estimated_lodging_total' => number_format($this->calculateLodgingAmount($property, $checkIn, $checkOut), 2, '.', ''),
        ];
    }

    /**
     * Handles DB transaction for booking registration and ledger entry.
     * Incorporates PropertyFees and selected Addons dynamically.
     */
    public function createOrRetrieveBooking(array $data): array
    {
        $property = Property::with(['fees', 'addons'])->findOrFail($data['property_id']);
        $checkIn  = Carbon::parse($data['check_in']);
        $checkOut = Carbon::parse($data['check_out']);
        $nights   = max(1, $checkIn->diffInDays($checkOut));

        return DB::transaction(function () use ($property, $data, $checkIn, $checkOut, $nights) {
            
            // 1. Calculate the dynamic breakdown (Lodging + Fees)
            $breakdown = $this->calculateBookingBreakdown($property, $data['check_in'], $data['check_out'], (int)$data['guests']);
            $totalPrice = $breakdown['initial_total'];

            // 2. Process Add-ons
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
                                'cost'  => $addonCost
                            ];
                        }
                    }
                }
            }

            // 3. Create or Update Booking
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
            $booking->save();

            // 4. Wipe existing lines to ensure a clean sync of the new price breakdown
            $booking->transactionLines()->delete();

            // 5. Save Lodging & Fee Lines
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

            // 6. Save Add-on Lines
            foreach ($selectedAddons as $item) {
                $transactionLine = $booking->transactionLines()->make([
                    'property_id'      => $property->id,
                    'description'      => "Add-on: {$item['title']} (x{$item['qty']})",
                    'transaction_date' => now()->toDateString(),
                ]);
                $transactionLine->amount = $item['cost'];
                $transactionLine->type = 'revenue';
                $transactionLine->save();
            }

            return [
                'booking' => $booking, 
                'property' => $property, 
                'isExisting' => !$booking->wasRecentlyCreated
            ];
        });
    }

    /**
     * Confirm a booking payment.
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
     * Calculate a full booking breakdown including fees and taxes.
     */
    public function calculateBookingBreakdown(Property $property, string $startDate, string $endDate, int $guestCount): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $nights = $start->diffInDays($end);

        $lines = collect();

        // 1. Calculate Base Lodging
        $lodgingAmount = $this->calculateLodgingAmount($property, $start, $end);
        $lines->push([
            'title'  => "Base Rental ($nights nights)",
            'amount' => round($lodgingAmount, 2),
            'type'   => 'lodging'
        ]);

        // 2. Add Flat Fees (e.g., Cleaning Fee, Security Deposit)
        // We separate these so percentages can be calculated on top of them if needed
        foreach ($property->fees->where('charge_type', 'flat') as $fee) {
            $lines->push([
                'title'  => $fee->title,
                'amount' => (float) $fee->amount,
                'type'   => $fee->type // refundable / non_refundable
            ]);
        }

        // 3. Calculate Percentage Fees (e.g., Taxes, Service Fees)
        // We calculate these based on the sum of lodging + flat fees
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

    protected function roundUpPrice(?float $price): ?int
    {
        if (!$price || $price <= 0) return null;
        $base = pow(10, floor(log10($price)));
        $rounded = ceil($price / $base) * $base;
        return (int) ($rounded < 100000 ? ceil($price / 50000) * 50000 : $rounded);
    }
}
