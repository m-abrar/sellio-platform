<?php
require_once 'public/install/functions.php';
echo "PHP Binary found: " . get_php_binary() . "\n";
echo "SAPI: " . PHP_SAPI . "\n";
echo "PHP_BINARY: " . PHP_BINARY . "\n";
echo "register_argc_argv: " . ini_get('register_argc_argv') . "\n";
