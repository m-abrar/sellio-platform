<?php

namespace App\Jobs;

use App\Models\SearchQuery;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class LogSearchQueryJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly string  $module,
        private readonly ?string $keyword,
        private readonly ?array  $filters,
        private readonly ?int    $resultCount,
        private readonly ?int    $userId,
        private readonly ?string $ipAddress,
    ) {}

    public function handle(): void
    {
        SearchQuery::create([
            'module'       => $this->module,
            'keyword'      => $this->keyword,
            'filters'      => $this->filters ?: null,
            'result_count' => $this->resultCount,
            'user_id'      => $this->userId,
            'ip_address'   => $this->ipAddress,
            'created_at'   => now(),
        ]);
    }
}
