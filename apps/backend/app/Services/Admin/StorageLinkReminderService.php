<?php

namespace App\Services\Admin;

use App\Services\StorageLinkService;

class StorageLinkReminderService
{
    public function __construct(
        protected StorageLinkService $storageLinkService,
    ) {}

    /**
     * @return array{
     *     title: string,
     *     summary: string,
     *     issues: list<array{link: string, detail: string}>,
     *     maintenance_url: string,
     *     fix_url: string
     * }|null
     */
    public function getReminder(): ?array
    {
        if (! $this->shouldEvaluate()) {
            return null;
        }

        if ($this->storageLinkService->linksAreHealthy()) {
            return null;
        }

        $issues = [];

        foreach ($this->storageLinkService->diagnoseLinks() as $result) {
            if ($result['healthy']) {
                continue;
            }

            $issues[] = [
                'link' => $result['link'],
                'detail' => $result['detail'],
            ];
        }

        if ($issues === []) {
            return null;
        }

        return [
            'title' => __('Storage link required'),
            'summary' => __('Uploaded logos, listing photos, and documents will not display until public/storage is linked to storage/app/public. Run Fix Storage Link from System Maintenance after every fresh install.'),
            'issues' => $issues,
            'maintenance_url' => route('admin.system.maintenance'),
            'fix_url' => route('admin.system.storage.link'),
        ];
    }

    protected function shouldEvaluate(): bool
    {
        if (! auth()->check()) {
            return false;
        }

        if (! auth()->user()->hasRole(['admin', 'super-admin'])) {
            return false;
        }

        return true;
    }
}
