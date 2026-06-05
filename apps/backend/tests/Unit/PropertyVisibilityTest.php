<?php

namespace Tests\Unit;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_active_scope_only_includes_approved_published_properties(): void
    {
        $approved = Property::factory()->create([
            'status' => 'approved',
            'is_published' => true,
            'approved_at' => now(),
        ]);

        Property::factory()->create([
            'status' => 'active',
            'is_published' => true,
            'approved_at' => now(),
        ]);

        Property::factory()->create([
            'status' => 'approved',
            'is_published' => false,
            'approved_at' => now(),
        ]);

        $this->assertSame([$approved->id], Property::active()->pluck('id')->all());
    }
}
