<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

/**
 * Creates configured public/storage symlinks without relying on Laravel's
 * storage:link command, which calls exec() when symlink() is unavailable.
 */
class StorageLinkService
{
    /**
     * Ensure all configured storage symlinks exist.
     *
     * @return array<int, array{link: string, target: string, success: bool, message: string}>
     */
    public function ensureLinks(bool $force = false): array
    {
        $results = [];

        foreach ($this->configuredLinks() as $link => $target) {
            $results[] = $this->ensureLink($link, $target, $force);
        }

        return $results;
    }

    /**
     * Ensure a single storage symlink exists.
     *
     * @return array{link: string, target: string, success: bool, message: string}
     */
    public function ensureLink(string $link, string $target, bool $force = false): array
    {
        if (! is_dir($target)) {
            File::makeDirectory($target, 0755, true);
        }

        $resolvedTarget = realpath($target) ?: $target;

        if (file_exists($link)) {
            if ($this->isValidLink($link, $resolvedTarget)) {
                return [
                    'link' => $link,
                    'target' => $resolvedTarget,
                    'success' => true,
                    'message' => "Storage link already exists: {$link}",
                ];
            }

            if (is_link($link) && $force) {
                @unlink($link);
            } else {
                return [
                    'link' => $link,
                    'target' => $resolvedTarget,
                    'success' => false,
                    'message' => "Path already exists and is not a valid storage symlink: {$link}",
                ];
            }
        }

        if ($this->createLink($resolvedTarget, $link)) {
            return [
                'link' => $link,
                'target' => $resolvedTarget,
                'success' => true,
                'message' => "Storage link created: {$link} -> {$resolvedTarget}",
            ];
        }

        return [
            'link' => $link,
            'target' => $resolvedTarget,
            'success' => false,
            'message' => "Unable to create storage link (symlink() and exec() are unavailable). "
                . "Create it manually: {$link} -> {$resolvedTarget}",
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function configuredLinks(): array
    {
        return config('filesystems.links') ?? [
            public_path('storage') => storage_path('app/public'),
        ];
    }

    protected function isValidLink(string $link, string $target): bool
    {
        if (! is_link($link)) {
            return false;
        }

        $resolvedLink = realpath($link);
        $resolvedTarget = realpath($target);

        return $resolvedLink !== false
            && $resolvedTarget !== false
            && $resolvedLink === $resolvedTarget;
    }

    protected function createLink(string $target, string $link): bool
    {
        if (function_exists('symlink')) {
            return @symlink($target, $link);
        }

        if (! function_exists('exec')) {
            return false;
        }

        if (windows_os()) {
            $mode = is_dir($target) ? 'J' : 'H';
            exec("mklink /{$mode} " . escapeshellarg($link) . ' ' . escapeshellarg($target));

            return file_exists($link) || is_link($link);
        }

        exec('ln -s ' . escapeshellarg($target) . ' ' . escapeshellarg($link));

        return file_exists($link) || is_link($link);
    }
}
