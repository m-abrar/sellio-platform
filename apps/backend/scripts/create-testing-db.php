<?php

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$database = getenv('DB_DATABASE') ?: 'sellio_testing';

$pdo = new PDO("mysql:host={$host};port={$port}", $user, $pass);
$pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");
echo "Database `{$database}` is ready.\n";
