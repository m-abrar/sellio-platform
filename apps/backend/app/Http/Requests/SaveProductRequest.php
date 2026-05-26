<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $productId = $this->route('product') ?? $this->route('id');
        if ($productId) {
            return \App\Models\Product::where('id', $productId)
                ->where('user_id', auth()->id())
                ->exists();
        }
        return auth()->check();
    }

    public function rules(): array
    {
        $productId = $this->route('product') ?? $this->route('id'); // For update routes

        return [
            'title'             => ['required', 'string', 'max:255'],
            'slug'              => ['required', 'string', Rule::unique('products')->ignore($productId)],
            'sku'               => ['nullable', 'string', Rule::unique('products')->ignore($productId)],
            'description'       => ['required', 'string'],
            'short_description' => ['nullable', 'string'],
            'category_id'       => ['required', 'exists:categories,id'],
            'brand_id'          => ['nullable', 'exists:brands,id'],
            'type_id'           => ['nullable', 'exists:types,id'],
            
            'base_price'        => ['required', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0'],
            'on_sale'           => ['boolean'],
            
            'stock_quantity'    => ['required_if:manage_stock,true', 'integer'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'manage_stock'      => ['boolean'],
            'in_stock'          => ['boolean'],
            'weight'            => ['nullable', 'numeric', 'min:0'],
            'length'            => ['nullable', 'numeric', 'min:0'],
            'width'             => ['nullable', 'numeric', 'min:0'],
            'height'            => ['nullable', 'numeric', 'min:0'],
            'is_published'      => ['boolean'],
            'is_featured'       => ['boolean'],
            'is_digital'        => ['boolean'],
            'video'             => ['nullable', 'url', 'max:2048'],
            'meta_title'        => ['nullable', 'string', 'max:255'],
            'meta_description'  => ['nullable', 'string'],
            
            'main_image'        => [$productId ? 'nullable' : 'required', 'image', 'max:2048'],
            'gallery.*'         => ['nullable', 'image', 'max:2048'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('title') && !$this->has('slug')) {
            $this->merge(['slug' => \Illuminate\Support\Str::slug($this->title)]);
        }

        $booleanFields = [
            'on_sale',
            'manage_stock',
            'in_stock',
            'is_published',
            'is_featured',
            'is_digital',
        ];

        $normalized = [];
        foreach ($booleanFields as $field) {
            if ($this->has($field)) {
                $normalized[$field] = filter_var($this->input($field), FILTER_VALIDATE_BOOLEAN);
            }
        }

        if ($this->has('sale_price')) {
            $normalized['on_sale'] = filled($this->input('sale_price')) && (float) $this->input('sale_price') > 0;
        }

        if ($this->has('stock_quantity')) {
            $normalized['in_stock'] = (int) $this->input('stock_quantity') > 0;
        }

        if ($normalized !== []) {
            $this->merge($normalized);
        }
    }
}
