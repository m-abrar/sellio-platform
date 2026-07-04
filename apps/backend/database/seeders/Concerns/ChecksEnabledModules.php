<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\DB;

/**
 * Shared module-enablement check for seeders that seed data belonging to
 * (or partly belonging to) an optional marketplace vertical, so buyers who
 * disable a module during installation don't get its demo rows/images.
 */
trait ChecksEnabledModules
{
    protected function isModuleEnabled(string $module): bool
    {
        return DB::table('settings')
            ->where('key', 'is_section.' . $module)
            ->where('value', '1')
            ->exists();
    }
}
