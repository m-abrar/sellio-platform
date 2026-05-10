<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $productId = $this->route('id');
        if ($productId) {
            return \App\Models\Product::where('id', $productId)
                ->where('user_id', auth()->id())
                ->exists();
        }
        return auth()->check();
    }

    public function rules(): array
    {
        $productId = $this->route('id'); // For update routes

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
            // 'manage_stock'      => ['boolean'],
            // 'in_stock'          => ['boolean'],
            
            'main_image'        => [$productId ? 'nullable' : 'required', 'image', 'max:2048'],
            'gallery.*'         => ['nullable', 'image', 'max:2048'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('title') && !$this->has('slug')) {
            $this->merge(['slug' => \Illuminate\Support\Str::slug($this->title)]);
        }
    }
}
