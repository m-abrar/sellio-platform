<?php
// =================================================================================
// Sellio Installer - Module Configuration Step
// File: steps/modules.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
$envPath = $basePath . '/.env';
$errorMessage = null;
$successMessage = null;

// 1. Load DB Credentials from .env
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

// 2. Connect to Database using PDO
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

// 3. Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$errorMessage) {
    try {
        $pdo->beginTransaction();
        
        foreach ($modules as $key => $data) {
            $isEnabled = isset($_POST['module_' . $key]) ? '1' : '0';
            $settingKey = 'is_section.' . $key;
            
            // Update or Insert the setting
            $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");
            $stmt->execute([$settingKey, $isEnabled, $isEnabled]);
        }
        
        $pdo->commit();
        redirect('seeding');
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        $errorMessage = "❌ Failed to save module settings: " . $e->getMessage();
    }
}

// 4. Fetch Current Settings (Default to enabled if not found)
$currentSettings = [];
if (!$errorMessage) {
    try {
        $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` LIKE 'is_section.%'");
        while ($row = $stmt->fetch()) {
            $key = str_replace('is_section.', '', $row['key']);
            $currentSettings[$key] = $row['value'];
        }
    } catch (Exception $e) {
        // Table might not exist yet if migration failed, but we should handle it gracefully
    }
}

$title = 'Configure Modules';
// --- PHP LOGIC END ---

include __DIR__ . '/../layout/header.php';
?>

<h2 class="mb-4">Module Configuration</h2>
<p class="mb-4 text-muted">Select the marketplace modules you want to enable for your platform. You can always change these later in the Admin Dashboard.</p>

<?php if ($errorMessage) display_message($errorMessage, true); ?>

<form method="post" class="mx-auto" style="max-width:650px;">
    
    <div class="row g-3 mb-4">
        <?php foreach ($modules as $key => $data): ?>
            <?php 
                $isChecked = (!isset($currentSettings[$key]) || $currentSettings[$key] === '1');
            ?>
            <div class="col-md-6">
                <div class="card h-100 border shadow-sm hover-shadow transition-all">
                    <div class="card-body d-flex align-items-center p-3">
                        <div class="flex-shrink-0 me-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                            <i class="fa-solid <?= $data['icon'] ?> text-primary fs-5"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h4 class="h6 mb-0 fw-bold"><?= htmlspecialchars($data['title']) ?></h4>
                        </div>
                        <div class="form-check form-switch fs-5">
                            <input class="form-check-input" type="checkbox" role="switch" 
                                   name="module_<?= $key ?>" id="module_<?= $key ?>" 
                                   <?= $isChecked ? 'checked' : '' ?>>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="text-center mt-5 pt-3 border-top">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow">
            Continue to Import Demos <i class="fa-solid fa-chevron-right ms-2"></i>
        </button>
    </div>

</form>

<style>
    .hover-shadow:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
    }
    .transition-all {
        transition: all 0.3s ease;
    }
    .form-check-input:checked {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }
</style>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>
