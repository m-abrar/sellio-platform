<?php
// =================================================================================
// Sellio Installer - Module Configuration Step
// File: steps/modules.php
// =================================================================================
global $basePath;

$envPath = $basePath . '/.env';
$errorMessage = null;

$dbConfig = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            [$key, $value] = explode('=', $line, 2);
            $dbConfig[trim($key)] = trim($value, "\"' ");
        }
    }
}

try {
    $dsn = "mysql:host={$dbConfig['DB_HOST']};port={$dbConfig['DB_PORT']};dbname={$dbConfig['DB_DATABASE']};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    $errorMessage = "❌ Database connection failed: " . $e->getMessage();
}

$modules = [
    'products'    => ['title' => 'Shop / Products',       'icon' => 'fa-cart-shopping'],
    'properties'  => ['title' => 'Real Estate / Property', 'icon' => 'fa-house'],
    'autos'       => ['title' => 'Automotive / Cars',     'icon' => 'fa-car'],
    'events'      => ['title' => 'Events / Tickets',      'icon' => 'fa-ticket'],
    'jobs'        => ['title' => 'Jobs / Recruitment',    'icon' => 'fa-briefcase'],
    'services'    => ['title' => 'Professional Services', 'icon' => 'fa-handshake-angle'],
    'classifieds' => ['title' => 'Classified Ads',        'icon' => 'fa-tags'],
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$errorMessage) {
    try {
        $pdo->beginTransaction();

        foreach ($modules as $key => $data) {
            $isEnabled = isset($_POST['module_' . $key]) ? '1' : '0';
            $settingKey = 'is_section.' . $key;

            $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");
            $stmt->execute([$settingKey, $isEnabled, $isEnabled]);
        }

        $pdo->commit();
        redirect('seeding');
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        $errorMessage = "❌ Failed to save module settings: " . $e->getMessage();
    }
}

$currentSettings = [];
if (!$errorMessage) {
    try {
        $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` LIKE 'is_section.%'");
        while ($row = $stmt->fetch()) {
            $key = str_replace('is_section.', '', $row['key']);
            $currentSettings[$key] = $row['value'];
        }
    } catch (Exception $e) {
    }
}

$title = 'Configure Modules';

include __DIR__ . '/../layout/header.php';

installer_step_intro(
    'Platform specialization',
    'Choose which marketplace verticals to activate. You can change these anytime in Admin → Settings.'
);

if ($errorMessage) {
    display_message($errorMessage, true);
}
?>

<form method="post" class="mx-auto" style="max-width:760px;">
    <div class="row g-3 mb-4">
        <?php foreach ($modules as $key => $data): ?>
            <?php $isChecked = (!isset($currentSettings[$key]) || $currentSettings[$key] === '1'); ?>
            <div class="col-md-6">
                <div class="module-card">
                    <div class="card-body d-flex align-items-center gap-3 p-3">
                        <div class="module-icon flex-shrink-0">
                            <i class="fa-solid <?= $data['icon'] ?>"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h4 class="h6 mb-0 fw-bold text-dark"><?= htmlspecialchars($data['title']) ?></h4>
                            <small class="text-muted smallest">Marketplace module</small>
                        </div>
                        <div class="form-check form-switch custom-switch-premium m-0">
                            <input class="form-check-input" type="checkbox" role="switch"
                                   name="module_<?= $key ?>" id="module_<?= $key ?>"
                                   <?= $isChecked ? 'checked' : '' ?>>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <?php installer_step_nav('migration', '#', 'Finalize Configuration', true); ?>
</form>

<?php
include __DIR__ . '/../layout/footer.php';
