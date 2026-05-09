<?php

namespace App\Services\Admin;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class ProductManagementService
 *
 * Orchestrates the business logic for the E-commerce vertical, managing 
 * listing lifecycles, attributes, addons, and administrative workflows.
 */
class ProductManagementService
{
    /**
     * Create or update a product listing.
     *
     * @param array $data
     * @param Product|null $product
     * @return Product
     */
    public function saveProduct(array $data, ?Product $product = null): Product
    {
        return DB::transaction(function () use ($data, $product) {
            if (empty($data['slug']) && !empty($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $productData = collect($data)->except(['tags', 'attributes', 'addons'])->toArray();

            if ($product) {
                $product->update($productData);
            } else {
                $productData['user_id'] = auth()->id();
                $product = Product::create($productData);
            }

            // Sync Tags
            $product->tags()->sync($data['tags'] ?? []);

            // Sync Attributes
            $product->attributes()->delete();
            if (!empty($data['attributes'])) {
                foreach ($data['attributes'] as $attr) {
                    $product->attributes()->create($attr);
                }
            }

            // Sync Addons
            $product->addons()->delete();
            if (!empty($data['addons'])) {
                foreach ($data['addons'] as $addon) {
                    $product->addons()->create($addon);
                }
            }

            return $product;
        });
    }

    /**
     * Replicate an existing product listing as a draft copy.
     *
     * @param Product $product
     * @return Product
     */
    public function duplicateProduct(Product $product): Product
    {
        return DB::transaction(function () use ($product) {
            $clone = $product->replicate();
            $clone->title .= ' ' . __('(Copy)');
            $clone->sku   .= '-COPY';
            $clone->slug   = Str::slug($clone->title) . '-' . uniqid();
            $clone->save();

            $clone->tags()->sync($product->tags->pluck('id')->toArray());

            // Recursive Asset Replication
            foreach ($product->getMedia(Product::GALLERY_MEDIA) as $media) {
                $media->copy($clone, Product::GALLERY_MEDIA);
            }

            return $clone;
        });
    }
}
