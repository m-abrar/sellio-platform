<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\FavoriteResource;

/**
 * Class FavoriteController
 * Orchestrates the user-facing discovery and management of favorited entities,
 * providing centralized access to interest metrics and polymorphic relationship metadata.
 */
class FavoriteController extends Controller
{
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
