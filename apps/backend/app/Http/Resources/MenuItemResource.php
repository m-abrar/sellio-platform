<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->resource['id'] ?? null,
            'title'    => $this->resource['title'],
            'url'      => $this->resource['url'],
            'target'   => $this->resource['target'] ?? '_self',
            'children' => MenuItemResource::collection(collect($this->resource['children'] ?? [])),
        ];
    }
}
