<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Payout Withdrawals
 *
 * This factory generates test data for the financial disbursement system,
 * simulating vendor payout requests with various payment methods,
 * approval workflows, and rejection auditing.
 */
class WithdrawalFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Withdrawal::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'approved', 'rejected']);
        $amount = $this->faker->randomFloat(2, 50, 5000); // Between $50 and $5000
        $method = $this->faker->randomElement(['PayPal', 'Bank Transfer', 'Cryptocurrency']);
        
        $approved_at = null;
        $rejected_at = null;
        $admin_note = null;
        
        if ($status === 'approved') {
            $approved_at = $this->faker->dateTimeBetween('-1 year', 'now');
        } elseif ($status === 'rejected') {
            $rejected_at = $this->faker->dateTimeBetween('-1 year', 'now');
            $admin_note = $this->faker->sentence();
        }

        return [
            // Ensure User::factory() exists or you have existing users in your database
            'user_id' => User::factory(), 
            'amount' => $amount,
            'method' => $method,
            'details' => $this->faker->word() . ' Account ID ' . $this->faker->randomNumber(5),
            'status' => $status,
            'admin_note' => $admin_note,
            'approved_at' => $approved_at,
            'rejected_at' => $rejected_at,
        ];
    }
    
    // Optional: State to quickly create a pending request
    public function pending(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'rejected_at' => null,
            'admin_note' => null,
        ]);
    }
}