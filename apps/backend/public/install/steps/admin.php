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
            redirect('platform_urls');
        } else {
            $error = true;
            $message = "❌ Could not create admin account. See log for details.";
        }
    }
}

$title = 'Create Admin Account';
include __DIR__ . '/../layout/header.php';

installer_step_intro(
    'Administrator account',
    'Create the primary supervisor account with full platform access.'
);

if ($message) {
    display_message($message, $error);
}
?>

<div class="info-panel mx-auto mb-4" style="max-width: 560px;">
    <form method="post">
        <div class="mb-4">
            <label class="form-label">Full name</label>
            <div class="input-group">
                <span class="input-group-text text-muted"><i class="fas fa-id-card"></i></span>
                <input type="text" name="name" class="form-control" placeholder="e.g. John Doe" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" required>
            </div>
        </div>

        <div class="mb-4">
            <label class="form-label">Email address</label>
            <div class="input-group">
                <span class="input-group-text text-muted"><i class="fas fa-envelope"></i></span>
                <input type="email" name="email" class="form-control" placeholder="admin@yourdomain.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-6">
                <label class="form-label">Password</label>
                <div class="password-field">
                    <input type="password" id="admin_password" name="password" class="form-control pe-5" placeholder="Min. 8 characters" required>
                    <button type="button" class="password-toggle-btn" data-password-toggle="admin_password" aria-label="Show password">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Confirm password</label>
                <div class="password-field">
                    <input type="password" id="admin_password_confirmation" name="password_confirmation" class="form-control pe-5" placeholder="Repeat password" required>
                    <button type="button" class="password-toggle-btn" data-password-toggle="admin_password_confirmation" aria-label="Show password">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>

        <p class="small text-muted mb-4"><i class="fas fa-shield-halved me-1 text-brand"></i> Use a strong unique password. You can add more staff accounts later from the admin panel.</p>

        <?php installer_step_nav('seeding', '#', 'Create Account & Finish Setup', true); ?>
    </form>
</div>

<?php if ($output): ?>
<div class="mt-4 mx-auto" style="max-width: 560px;">
    <h6 class="text-muted fw-bold uppercase letter-spacing-1 smallest mb-3">
        <i class="fas fa-terminal me-2"></i> System output
    </h6>
    <div class="terminal-window">
        <div class="terminal-header">
            <div class="terminal-dots">
                <span class="terminal-dot terminal-dot-red"></span>
                <span class="terminal-dot terminal-dot-amber"></span>
                <span class="terminal-dot terminal-dot-green"></span>
            </div>
            <span class="terminal-title">admin_provision.log</span>
        </div>
        <pre class="terminal-body"><?= htmlspecialchars($output) ?></pre>
    </div>
</div>
<?php endif; ?>

<?php include __DIR__ . '/../layout/footer.php'; ?>
