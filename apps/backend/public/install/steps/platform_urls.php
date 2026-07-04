<?php
// =================================================================================
// Sellio Installer - Platform URLs Step
// File: steps/platform_urls.php
// =================================================================================
global $basePath;

$envPath = $basePath . '/.env';
$errorMessage = null;

$envConfig = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            [$key, $value] = explode('=', $line, 2);
            $envConfig[trim($key)] = trim($value, "\"' ");
        }
    }
}

try {
    $dsn = "mysql:host={$envConfig['DB_HOST']};port={$envConfig['DB_PORT']};dbname={$envConfig['DB_DATABASE']};charset=utf8mb4";
    $pdo = new PDO($dsn, $envConfig['DB_USERNAME'], $envConfig['DB_PASSWORD'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    $errorMessage = "❌ Database connection failed: " . $e->getMessage();
}

// Base URL this Laravel install answers on — the monolith serves both the
// public storefront and /admin, so it seeds sensible defaults for both.
$appUrl = rtrim($envConfig['APP_URL'] ?? '', '/');
if ($appUrl === '') {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    $appUrl = rtrim($protocol . ($_SERVER['HTTP_HOST'] ?? 'localhost') . rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/\\'), '/');
}

$apiUrl = $appUrl . '/api';

$fields = [
    'url_frontend' => ['label' => 'Public Storefront URL', 'icon' => 'fa-store', 'default' => $appUrl, 'placeholder' => 'https://yourdomain.com'],
    'url_admin'    => ['label' => 'Admin Control Panel URL', 'icon' => 'fa-user-shield', 'default' => $appUrl . '/admin', 'placeholder' => 'https://yourdomain.com/admin'],
    'url_partner'  => ['label' => 'Partner Portal URL', 'icon' => 'fa-store-alt', 'default' => '', 'placeholder' => 'https://seller-panel.yourdomain.com'],
    'url_user'     => ['label' => 'Customer App URL', 'icon' => 'fa-mobile-screen', 'default' => '', 'placeholder' => 'https://buyer-panel.yourdomain.com'],
];

$currentSettings = [];
if (!$errorMessage) {
    try {
        $placeholders = implode(',', array_fill(0, count($fields), '?'));
        $stmt = $pdo->prepare("SELECT `key`, `value` FROM settings WHERE `key` IN ({$placeholders})");
        $stmt->execute(array_keys($fields));
        while ($row = $stmt->fetch()) {
            $currentSettings[$row['key']] = $row['value'];
        }
    } catch (Exception $e) {
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$errorMessage) {
    if (empty($_POST['api_url_copied'])) {
        $errorMessage = '❌ Please confirm you copied the API URL before continuing — the seller and buyer apps need it to connect.';
    } else {
        try {
            $pdo->beginTransaction();

            foreach ($fields as $key => $meta) {
                $value = trim($_POST[$key] ?? '');

                if ($value !== '' && !preg_match('#^https?://#i', $value)) {
                    $value = 'https://' . $value;
                }

                $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");
                $stmt->execute([$key, $value, $value]);
            }

            $pdo->commit();
            redirect('finished');
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $errorMessage = "❌ Failed to save platform URLs: " . $e->getMessage();
        }
    }
}

$title = 'Platform URLs';
include __DIR__ . '/../layout/header.php';

installer_step_intro(
    'Connect your apps',
    'Tell Sellio where each part of your platform lives. This wires up CORS automatically and prevents “Not set” warnings on your dashboard later.'
);

if ($errorMessage) {
    display_message($errorMessage, true);
}
?>

<div class="info-panel info-panel-info mx-auto mb-4" style="max-width: 720px;">
    <p class="text-brand small mb-2 fw-bold">
        <i class="fa-solid fa-plug me-2"></i> API URL for the Seller &amp; Buyer apps
    </p>
    <p class="text-muted small mb-3">
        If you're deploying the React seller/buyer portals separately, paste this into each app's
        <code>public/config.js</code> as the <code>apiUrl</code> value:
    </p>
    <div class="copy-field mb-2">
        <code id="api-url-value" class="copy-field-value"><?= htmlspecialchars($apiUrl) ?></code>
        <button type="button" class="btn btn-sm btn-outline-secondary copy-field-btn" data-copy-target="api-url-value">
            <i class="fa-regular fa-copy me-1"></i> Copy
        </button>
    </div>
    <p class="smallest text-muted mb-0" id="copy-confirm-hint">
        <i class="fa-solid fa-circle-info me-1"></i> Copy the URL above, then check the box below to continue.
    </p>
</div>

<div class="info-panel mx-auto mb-4" style="max-width: 720px;">
    <form method="post" id="platform-urls-form">
        <div class="row g-3 mb-2">
            <?php foreach ($fields as $key => $meta): ?>
                <?php $value = $currentSettings[$key] ?? $meta['default']; ?>
                <div class="col-md-6">
                    <label class="form-label"><?= htmlspecialchars($meta['label']) ?></label>
                    <div class="input-group">
                        <span class="input-group-text text-muted"><i class="fas <?= $meta['icon'] ?>"></i></span>
                        <input type="text" name="<?= htmlspecialchars($key) ?>" class="form-control"
                               placeholder="<?= htmlspecialchars($meta['placeholder']) ?>"
                               value="<?= htmlspecialchars($_POST[$key] ?? $value) ?>">
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <p class="small text-muted mt-3 mb-4">
            <i class="fas fa-circle-info me-1 text-brand"></i>
            Don't have the partner/customer app domains yet? Leave them blank — you can fill these in anytime from
            <strong>Admin → Settings → System</strong>.
        </p>

        <div class="form-check mb-4">
            <input class="form-check-input" type="checkbox" name="api_url_copied" id="api_url_copied" value="1"
                   <?= !empty($_POST['api_url_copied']) ? 'checked' : '' ?> required>
            <label class="form-check-label small fw-semibold" for="api_url_copied">
                I have copied the API URL above for my seller/buyer app configuration.
            </label>
        </div>

        <?php installer_step_nav('admin', '#', 'Save & Continue', true); ?>
    </form>
</div>

<?php include __DIR__ . '/../layout/footer.php'; ?>
