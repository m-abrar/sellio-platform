<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'content'        => $this->content,
            'excerpt'        => $this->excerpt,
            
            // Spatie Media & Custom Attributes
            'featured_image' => $this->primary_image_url, 
            'gallery'        => $this->whenLoaded('media', fn() => $this->getMedia('gallery')->map(fn($media) => [
                'url'   => $media->getUrl(),
                'title' => $media->name // Fix: Spatie Media uses 'name' not 'title' by default
            ])),

            // Relationships with null-safety
            'category'       => $this->whenLoaded('category', fn() => $this->category->title), 
            'tags'           => $this->whenLoaded('tags', fn() => $this->tags->pluck('title')),
            'author'         => $this->whenLoaded('user', fn() => [
                'name'   => $this->user->name ?? 'Admin',
                'avatar' => $this->user->avatar_url ?: null
            ], [
                'name' => 'Admin' // Fallback for when user is not loaded
            ]),
            
            'view_count'     => $this->view_count,
            'published_at'   => $this->published_at,
            'created_at'     => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
