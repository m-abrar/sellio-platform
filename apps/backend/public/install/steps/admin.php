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
<div class="mb-5">
    <h2 class="fw-bold text-dark">Administrator Provisioning</h2>
    <p class="text-muted">Establish the primary supervisor account with full platform access and management rights.</p>
</div>

<?php if ($message) display_message($message, $error); ?>

<div class="card border-0 shadow-premium mx-auto mb-5 overflow-hidden" style="max-width: 550px; border-radius: 24px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px);">
    <div class="card-body p-5">
        <form method="post">
            <div class="mb-4">
                <label class="form-label">Full Name</label>
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="fas fa-id-card"></i></span>
                    <input type="text" name="name" class="form-control border-start-0" placeholder="e.g. John Doe" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" required>
                </div>
            </div>
            
            <div class="mb-4">
                <label class="form-label">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="fas fa-envelope"></i></span>
                    <input type="email" name="email" class="form-control border-start-0" placeholder="admin@sellio.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" placeholder="••••••••" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" name="password_confirmation" class="form-control" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-3 shadow-lg">
                <i class="fas fa-user-shield me-2"></i> Create Account & Finish Setup
            </button>
        </form>
    </div>
</div>

<?php if ($output): ?>
<div class="mt-4">
    <h6 class="text-muted fw-bold uppercase letter-spacing-1 smallest mb-3">
        <i class="fas fa-terminal me-2"></i> System Output Log
    </h6>
    <pre class="bg-dark text-light p-4 rounded-4 small border border-secondary shadow-lg" style="font-family: 'Fira Code', monospace; line-height: 1.6;"><?= htmlspecialchars($output) ?></pre>
</div>
<?php endif; ?>

<?php include __DIR__ . '/../layout/footer.php'; ?>