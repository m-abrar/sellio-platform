<?php
echo "PHP_SAPI: " . PHP_SAPI . "\n";
echo "PHP_BINARY: " . PHP_BINARY . "\n";
echo "register_argc_argv: " . ini_get('register_argc_argv') . "\n";
echo "exec('php -v'): " . shell_exec('php -v') . "\n";
