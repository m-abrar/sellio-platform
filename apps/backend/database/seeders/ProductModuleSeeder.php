<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Faker\Factory as Faker;
use App\Models\Product;
use App\Models\ProductAddon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Carbon\Carbon;

/**
 * Class ProductModuleSeeder
 *
 * Seeds auxiliary e-commerce data (addons, orders, order items, and reviews)
 * for existing Product records, simulating a live transactional marketplace.
 */
class ProductModuleSeeder extends Seeder
{
    private $faker;
    private array $userIds;
    private int $maxUsers;

    // (Addon Definitions remain the same as previous)
    private array $addonDefinitions = [
        'Premium Gift Wrap' => ['pricing_type' => 'per_unit',  'icon' => 'bi-gift', 'is_popular' => true, 'max_qty' => 1],
        'Extended Warranty' => ['pricing_type' => 'one_time',  'icon' => 'bi-shield-check', 'is_popular' => true, 'max_qty' => 1],
        'Priority Express'  => ['pricing_type' => 'one_time',  'icon' => 'bi-lightning-charge', 'is_popular' => false, 'max_qty' => 1],
    ];

    public function run(): void
    {
        $this->faker = Faker::create();
        $this->userIds = DB::table('users')->pluck('id')->toArray();
        $this->maxUsers = count($this->userIds);

        if ($this->maxUsers === 0) return;

        $products = Product::all();
        if ($products->isEmpty()) return;

        $this->seedProductData($products);
        $this->seedRelations($products);
    }

    private function seedProductData(Collection $products): void
    {
        $products->each(function (Product $product) {
            if($product->addons()->count() === 0) {
                $this->seedAddons($product);
            }
        });
    }

    private function seedAddons(Product $product): void
    {
        collect($this->addonDefinitions)->keys()->shuffle()->take(mt_rand(1, 2))->each(function ($title) use ($product) {
            $meta = $this->addonDefinitions[$title];
            ProductAddon::factory()->create([
                'product_id'   => $product->id,
                'title'        => $title,
                'pricing_type' => $meta['pricing_type'],
                'icon'         => $meta['icon'],
                'is_popular'   => $meta['is_popular'],
                'max_qty'      => $meta['max_qty'],
                'is_published' => true,
            ]);
        });
    }

    private function seedRelations(Collection $products): void
    {
        $this->command->info("\n--- 🤝 Seeding Orders & Reviews ---");

        foreach ($products as $product) {
            // 1. Seed Reviews (Matches previous logic)
            $numReviews = $this->faker->numberBetween(1, 3);
            $reviewerIds = $this->faker->randomElements($this->userIds, min($numReviews, $this->maxUsers));
            foreach ($reviewerIds as $rid) {
                $product->reviews()->create(Review::factory()->make(['user_id' => $rid])->toArray());
            }

            // 2. Seed Orders & Order Items
            $numOrders = $this->faker->numberBetween(1, 3);
            for ($i = 0; $i < $numOrders; $i++) {
                $buyerId = $this->faker->randomElement($this->userIds);
                $qty = $this->faker->numberBetween(1, 3);
                $unitPrice = $product->sale_price ?? $product->base_price;

                // Create Order (Header)
                $order = Order::factory()->create([
                    'user_id'      => $buyerId,
                    'subtotal'     => $unitPrice * $qty,
                    'total_amount' => ($unitPrice * $qty) + 10, // Simulating fixed shipping/tax
                ]);

                // Create Order Item (Detail Snapshot)
                OrderItem::create([
                    'order_id'            => $order->id,
                    'product_id'          => $product->id,
                    'product_name'        => $product->title, // Snapshot of name
                    'quantity'            => $qty,
                    'unit_price'          => $unitPrice,
                    'total_price'         => $unitPrice * $qty,
                    'selected_attributes' => json_encode(['Color' => 'Default']),
                    'selected_addons'     => null,
                ]);
            }
        }
    }
}