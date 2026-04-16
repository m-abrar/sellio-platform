<?php
$output = shell_exec('php artisan route:list --json');
file_put_contents('routes.json', $output);
echo "Routes saved to routes.json as UTF-8\n";
