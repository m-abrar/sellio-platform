<?php

$_SERVER['APP_ENV'] = 'testing';
putenv('APP_ENV=testing');

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('email', 'admin@sellio.buzz')->first();

if (! $user) {
    echo "missing\n";
    exit(1);
}

$valid = Illuminate\Support\Facades\Hash::check('admin123', $user->password);
echo $valid ? "ok\n" : "bad-password\n";
