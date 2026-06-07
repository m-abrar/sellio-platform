<?php

/**
 * Parse key/value pairs from a Laravel-style .env file.
 *
 * @return array<string, string>
 */
function parse_installer_env_file(string $path): array
{
    if (! file_exists($path)) {
        return [];
    }

    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $values[trim($key)] = trim($value, "\"' ");
    }

    return $values;
}

/**
 * Whether PHP errors should be rendered in the browser during installation.
 */
function should_installer_display_errors(bool $lockExists, bool $debugRequested): bool
{
    if ($lockExists) {
        return false;
    }

    return $debugRequested;
}

/**
 * Resolve installer debug mode from .env or the current request context.
 */
function installer_debug_requested(?array $env, bool $isLocal): bool
{
    if ($env !== null && array_key_exists('INSTALLER_DEBUG', $env)) {
        return filter_var($env['INSTALLER_DEBUG'], FILTER_VALIDATE_BOOLEAN);
    }

    return $isLocal;
}
