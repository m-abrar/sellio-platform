<?php

namespace App\Http\Requests\Dashboard\User;

use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        $review = $this->route('review');
        if ($review) {
            $reviewId = $review instanceof Review ? $review->id : $review;
            return Review::where('id', $reviewId)
                ->where('user_id', auth()->id())
                ->exists();
        }
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }
}
