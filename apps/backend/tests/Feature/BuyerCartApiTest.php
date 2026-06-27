<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BuyerCartApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_bearer_authenticated_buyer_adds_product_to_their_own_cart(): void
    {
        $buyer = User::factory()->create();
        $product = Product::factory()->create();
        $token = $buyer->createToken('mobile-cart-test')->plainTextToken;

        $this->withToken($token)
            ->postJson("/api/v1/cart/add/{$product->id}", [
                'quantity' => 1,
            ])
            ->assertOk()
            ->assertJsonPath('data.item_count', 1)
            ->assertJsonPath('data.items.0.product.id', $product->id);

        $this->assertDatabaseHas('carts', [
            'user_id' => $buyer->id,
            'session_id' => null,
        ]);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);
    }
}
