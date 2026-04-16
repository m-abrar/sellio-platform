<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorites.
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
     * Remove the specified favorite from storage.
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
