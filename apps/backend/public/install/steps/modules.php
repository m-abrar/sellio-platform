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

// 4. Fetch Current Settings
$currentSettings = [];
if (!$errorMessage) {
    try {
        $stmt = $pdo->query("SELECT `key`, `value` FROM settings WHERE `key` LIKE 'is_section.%'");
        while ($row = $stmt->fetch()) {
            $key = str_replace('is_section.', '', $row['key']);
            $currentSettings[$key] = $row['value'];
        }
    } catch (Exception $e) {}
}

$title = 'Configure Modules';
// --- PHP LOGIC END ---

include __DIR__ . '/../layout/header.php';
?>

<div class="mb-5">
    <h2 class="fw-bold text-dark">Platform Specialization</h2>
    <p class="text-muted">Select the marketplace verticals you wish to activate. These can be adjusted anytime via the admin dashboard.</p>
</div>

<?php if ($errorMessage) display_message($errorMessage, true); ?>

<form method="post" class="mx-auto" style="max-width:750px;">
    
    <div class="row g-4 mb-5">
        <?php foreach ($modules as $key => $data): ?>
            <?php 
                $isChecked = (!isset($currentSettings[$key]) || $currentSettings[$key] === '1');
            ?>
            <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm transition-all" style="border-radius: 20px; background: rgba(255,255,255,0.6); backdrop-filter: blur(5px);">
                    <div class="card-body d-flex align-items-center p-3">
                        <div class="flex-shrink-0 me-3 bg-white shadow-xs rounded-4 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px; border: 1px solid #e2e8f0;">
                            <i class="fa-solid <?= $data['icon'] ?> text-primary fs-5"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h4 class="h6 mb-0 fw-bold text-dark"><?= htmlspecialchars($data['title']) ?></h4>
                            <small class="text-muted smallest fw-bold uppercase letter-spacing-1">Module Active</small>
                        </div>
                        <div class="form-check form-switch custom-switch-premium">
                            <input class="form-check-input" type="checkbox" role="switch" 
                                   name="module_<?= $key ?>" id="module_<?= $key ?>" 
                                   <?= $isChecked ? 'checked' : '' ?>>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="text-center mt-5 pt-4 border-top">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow-lg">
            Finalize Configuration <i class="fa-solid fa-chevron-right ms-2"></i>
        </button>
    </div>

</form>

<style>
    .card:hover {
        transform: translateY(-5px);
        background: #fff !important;
        box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
    }
    .custom-switch-premium .form-check-input {
        width: 3rem;
        height: 1.5rem;
        cursor: pointer;
    }
    .custom-switch-premium .form-check-input:checked {
        background-color: var(--primary);
        border-color: var(--primary);
    }
</style>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>
