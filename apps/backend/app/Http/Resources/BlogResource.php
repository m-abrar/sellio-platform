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
            'gallery'        => $this->getMedia('gallery')->map(fn($media) => [
                'url'  => $media->getUrl(),
                'title' => $media->title
            ]),

            // Relationships with null-safety
            'category'       => $this->category?->title, 
            'tags'           => $this->tags->pluck('title'),
            'authorrr'         => [
                'name'   => $this->user?->name ?? 'Admin',
                'avatar' => $this->user?->avatar_url ?: null
            ],
            
            'view_count'     => $this->view_count,
            'published_at'   => $this->published_at,
            'created_at'     => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
