<?php
// =================================================================================
// Sellio Installer - Admin User Step
// File: steps/admin.php
// =================================================================================
global $basePath;

$error = false;
$message = '';
$output = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $pass = $_POST['password'] ?? '';
    $pass_conf = $_POST['password_confirmation'] ?? '';

    if (!$name || !$email || !$pass) {
        $error = true;
        $message = "❌ Please fill in all fields.";
    } elseif ($pass !== $pass_conf) {
        $error = true;
        $message = "❌ Passwords do not match.";
    } elseif (strlen($pass) < 8) {
        $error = true;
        $message = "❌ Password must be at least 8 characters.";
    } else {
        chdir($basePath);
        $phpBinary = get_php_binary();

        // Using Artisan Tinker to execute PHP code directly for user creation
        $tinkerCmd = sprintf(
            'artisan tinker --execute="\\App\\Models\\User::updateOrCreate([\'id\' => 1], [\'name\' => \'%s\', \'email\' => \'%s\', \'password\' => bcrypt(\'%s\'), \'is_admin\' => true]);"',
            addslashes($name),
            addslashes($email),
            addslashes($pass)
        );

        $command = "{$phpBinary} {$tinkerCmd} 2>&1";
        
        if (function_exists('exec')) {
            exec($command, $out, $status);
            $output = implode("\n", $out);
        } else {
            $status = 1;
            $output = "❌ [Error] The 'exec' function is disabled on your server. This installer requires it to create the admin account.";
        }

        if ($status === 0) {
            redirect('finished');
        } else {
            $error = true;
            $message = "❌ Could not create admin account. See log for details.";
        }
    }
}

$title = 'Create Admin Account';
include __DIR__ . '/../layout/header.php';
?>
<h2 class="mb-4">Admin Account</h2>
<p class="mb-4 text-muted">Create your primary administrator account to manage your Sellio store.</p>

<?php if ($message) display_message($message, $error); ?>

<div class="card border-0 shadow-sm mx-auto" style="max-width: 480px;">
    <div class="card-body p-4">
        <form method="post">
            <div class="mb-3">
                <label class="form-label fw-bold small">Full Name</label>
                <input type="text" name="name" class="form-control" placeholder="Admin Name" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" required>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold small">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="admin@domain.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold small">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="mb-4">
                <label class="form-label fw-bold small">Confirm Password</label>
                <input type="password" name="password_confirmation" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 py-2">
                Create Admin & Finish <i class="fa-solid fa-arrow-right ms-2"></i>
            </button>
        </form>
    </div>
</div>

<?php if ($output): ?>
<div class="mt-4">
    <h3 class="h6 text-muted">Execution Log:</h3>
    <pre class="bg-dark text-light p-3 rounded small"><?= htmlspecialchars($output) ?></pre>
</div>
<?php endif; ?>

<?php include __DIR__ . '/../layout/footer.php'; ?>