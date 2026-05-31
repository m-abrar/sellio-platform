<?php

$backendRoot = dirname(__DIR__);
$lockFile = $backendRoot . '/installed.lock';
$envFile = $backendRoot . '/.env';

if (file_exists($lockFile)) {
    unlink($lockFile);
    echo "Removed installed.lock\n";
}

require __DIR__ . '/create-install-test-db.php';
