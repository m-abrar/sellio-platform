<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isOwner = $user && $user->id === $this->user_id;
        $isPartner = $user && $this->relationLoaded('job') && $this->job && $user->id === $this->job->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        return [
            'id' => $this->id,
            'job_listing_id' => $this->job_listing_id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'cover_letter' => $this->cover_letter,
            'resume_path' => $this->resume_path,
            'portfolio_url' => $this->portfolio_url,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'job' => $this->whenLoaded('job', fn () => [
                'id' => $this->job->id,
                'title' => $this->job->title,
                'slug' => $this->job->slug,
                'salary_min' => $this->job->salary_min,
                'salary_max' => $this->job->salary_max,
                'workplace_type' => $this->job->workplace_type,
                'primary_image_url' => $this->job->primary_image_url,
            ]),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ]),
            'full_name' => $this->when(
                $canViewPii,
                $this->relationLoaded('user') ? ($this->user?->name ?? 'Candidate') : 'Candidate'
            ),
            'email' => $this->when($canViewPii, $this->relationLoaded('user') ? $this->user?->email : null),
            'phone' => $this->when($canViewPii, $this->relationLoaded('user') ? $this->user?->phone : null),
        ];
    }
}
