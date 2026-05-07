<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ProductRequest
 * Manages the complex administrative validation for marketplace products, coordinating
 * multi-entity variations (Attributes), supplementary offerings (Addons), and inventory integrity.
 */
class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Implicit route parameter if editing
        $productId = $this->product ? $this->product->id : null;

        return [
            'title' => 'required|string|max:255|unique:products,title,' . $productId,
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $productId,
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $productId,
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'base_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:base_price',
            'stock_quantity' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'is_published' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'on_sale' => 'nullable|boolean',
            'manage_stock' => 'nullable|boolean',
            'is_digital' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            
            // Variations (Attributes)
            'attributes' => 'nullable|array',
            'attributes.*.name' => 'required_with:attributes|string|max:100',
            'attributes.*.value' => 'required_with:attributes|string|max:255',
            'attributes.*.additional_price' => 'nullable|numeric',
            'attributes.*.sku_extension' => 'nullable|string|max:50',
            'attributes.*.stock_quantity' => 'nullable|integer|min:0',
            'attributes.*.is_variation' => 'nullable|boolean',
            
            // Add-ons
            'addons' => 'nullable|array',
            'addons.*.title' => 'required_with:addons|string|max:255',
            'addons.*.price' => 'required_with:addons|numeric|min:0',
            'addons.*.pricing_type' => 'nullable|in:one_time,per_unit',
            'addons.*.is_required' => 'nullable|boolean',
            'addons.*.description' => 'nullable|string|max:500',
        ];
    }
}
