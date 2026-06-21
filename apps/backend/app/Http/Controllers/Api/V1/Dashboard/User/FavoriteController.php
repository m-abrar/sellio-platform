<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\User\FavoriteBatchStatusRequest;
use App\Http\Requests\Dashboard\User\FavoriteListingRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Auto;
use App\Models\Classified;
use App\Models\Event;
use App\Models\Favorite;
use App\Models\JobListing;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Class FavoriteController
 * Orchestrates the user-facing discovery and management of favorited entities,
 * providing centralized access to interest metrics and polymorphic relationship metadata.
 */
class FavoriteController extends Controller
{
    /** @var array<string, class-string<Model>> */
    private const FAVORITABLE_TYPES = [
        'products' => Product::class,
        'properties' => Property::class,
        'autos' => Auto::class,
        'events' => Event::class,
        'jobs' => JobListing::class,
        'services' => Service::class,
        'classifieds' => Classified::class,
    ];

    /**
     * Retrieve a paginated collection of favorites for the authenticated user.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index() {
        $user = Auth::user();

        $favorites = Favorite::where('user_id', $user->id)
            ->with(['favoritable'])
            ->latest()
            ->paginate(9);

        return FavoriteResource::collection($favorites);
    }

    /**
     * Save a listing to the authenticated buyer's favorites.
     */
    public function store(FavoriteListingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $modelClass = self::FAVORITABLE_TYPES[$validated['vertical']];
        $listing = $modelClass::query()->findOrFail($validated['listing_id']);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $favorite = $user->userFavorites()->firstOrCreate([
            'favoritable_type' => $modelClass,
            'favoritable_id' => $listing->getKey(),
        ]);

        $status = $favorite->wasRecentlyCreated ? 201 : 200;
        $message = $favorite->wasRecentlyCreated
            ? 'Listing added to favorites.'
            : 'Listing is already in favorites.';

        return $this->successResponse(
            new FavoriteResource($favorite->load('favoritable')),
            $message,
            $status,
        );
    }

    /**
     * Report whether a listing is already saved by the authenticated buyer.
     */
    public function status(FavoriteListingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $modelClass = self::FAVORITABLE_TYPES[$validated['vertical']];
        $listing = $modelClass::query()->findOrFail($validated['listing_id']);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $favorite = $user->userFavorites()
            ->where('favoritable_type', $modelClass)
            ->where('favoritable_id', $listing->getKey())
            ->first();

        return $this->successResponse([
            'is_favorite' => $favorite !== null,
            'favorite_id' => $favorite?->id,
        ]);
    }

    /**
     * Return favorite state for a collection of marketplace cards in one request.
     */
    public function statuses(FavoriteBatchStatusRequest $request): JsonResponse
    {
        $items = collect($request->validated('items'))
            ->unique(fn (array $item) => $item['vertical'] . ':' . $item['listing_id'])
            ->values();

        /** @var \App\Models\User $user */
        $user = $request->user();
        $favorites = $user->userFavorites()
            ->where(function ($query) use ($items) {
                foreach ($items as $item) {
                    $query->orWhere(function ($itemQuery) use ($item) {
                        $itemQuery
                            ->where('favoritable_type', self::FAVORITABLE_TYPES[$item['vertical']])
                            ->where('favoritable_id', $item['listing_id']);
                    });
                }
            })
            ->get()
            ->keyBy(fn (Favorite $favorite) => $favorite->favoritable_type . ':' . $favorite->favoritable_id);

        return $this->successResponse([
            'items' => $items->map(function (array $item) use ($favorites) {
                $favorite = $favorites->get(
                    self::FAVORITABLE_TYPES[$item['vertical']] . ':' . $item['listing_id'],
                );

                return [
                    'vertical' => $item['vertical'],
                    'listing_id' => (int) $item['listing_id'],
                    'is_favorite' => $favorite !== null,
                    'favorite_id' => $favorite?->id,
                ];
            })->values(),
        ]);
    }

    /**
     * Terminate the specified favorite relationship.
     *
     * @param  \App\Models\Favorite  $favorite
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove(Favorite $favorite) {
        // Ensure the favorite belongs to the authenticated user
        if ($favorite->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $favorite->delete();

        return $this->successResponse(null, 'Item successfully removed from your favorites.');
    }
}
