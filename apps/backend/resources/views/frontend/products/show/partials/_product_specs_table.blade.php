@php
    $specAttributes = $product->attributes
        ->where('is_variation', false)
        ->sortBy('sort_order');
@endphp

@if($specAttributes->isNotEmpty())
    <div class="table-responsive">
        <table class="table table-borderless align-middle mb-0 product-specs-table">
            <tbody>
                @foreach($specAttributes as $attribute)
                    <tr class="border-bottom border-color-light">
                        <th scope="row" class="text-muted fw-600 small py-3" style="width:40%">
                            {{ $attribute->name }}
                        </th>
                        <td class="fw-800 text-dark py-3">
                            {{ $attribute->value }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endif
