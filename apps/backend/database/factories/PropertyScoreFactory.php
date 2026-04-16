<?php

namespace Database\Factories;

use App\Models\PropertyScore;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyScoreFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PropertyScore::class;

    /**
     * Statically defined data for available scores.
     *
     * @return array<int, array<string, string|float>>
     */
    public static function getAvailableScores(): array
    {
        return [
            ['title' => 'Walk Score', 'min_score' => 45.00, 'max_score' => 98.00, 'units' => '/100'],
            ['title' => 'Transit Score', 'min_score' => 30.00, 'max_score' => 90.00, 'units' => '/100'],
            ['title' => 'School Rating', 'min_score' => 6.00, 'max_score' => 10.00, 'units' => '/10'],
            ['title' => 'Bike Score', 'min_score' => 20.00, 'max_score' => 85.00, 'units' => '/100'],
            ['title' => 'Safety Index', 'min_score' => 5.00, 'max_score' => 9.50, 'units' => '/10'],
        ];
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Fallback: If not using the custom state, randomly select one score from the list.
        $availableScores = self::getAvailableScores();
        $scoreData = $this->faker->randomElement($availableScores);
        
        // Generate the score based on the defined range
        $scoreValue = $this->faker->randomFloat(
            2, 
            $scoreData['min_score'], 
            $scoreData['max_score']
        );

        return [
            // property_id will be provided when calling the factory
            'title' => $scoreData['title'],
            'score' => $scoreValue,
            'units' => $scoreData['units'],
            // 40% chance of including a description
            'description' => $this->faker->boolean(40) ? $this->faker->sentence(1) : null,
        ];
    }

    /**
     * State for generating a specific score type and value based on a definition array.
     */
    public function withSpecificScore(array $scoreDefinition): static
    {
        $scoreValue = $this->faker->randomFloat(
            2, 
            $scoreDefinition['min_score'], 
            $scoreDefinition['max_score']
        );

        return $this->state(fn (array $attributes) => [
            'title' => $scoreDefinition['title'],
            'score' => $scoreValue,
            'units' => $scoreDefinition['units'],
            // Description is still randomly generated via the default definition's definition closure
        ]);
    }
}