<?php

namespace Database\Factories\Concerns;

use App\Models\User;

trait ResolvesExistingRecords
{
    protected function existingUserId(): ?int
    {
        return User::query()->inRandomOrder()->value('id');
    }
}
