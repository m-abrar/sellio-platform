<?php
// =================================================================================
// Sellio Installer - Requirements Check Step
// File: steps/requirements.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---

/**
 * Define requirements list.
 * We use a mix of version checks, extension checks, and directory permission checks.
 */
$requirements = [
    'PHP >= 8.2' => version_compare(PHP_VERSION, '8.2.0', '>='),
    'BCMath Extension' => extension_loaded('bcmath'),
    'Ctype Extension' => extension_loaded('ctype'),
    'Fileinfo Extension' => extension_loaded('fileinfo'),
    'JSON Extension' => extension_loaded('json'),
    'Mbstring Extension' => extension_loaded('mbstring'),
    'OpenSSL Extension' => extension_loaded('openssl'),
    'PDO Extension' => extension_loaded('pdo'),
    'Tokenizer Extension' => extension_loaded('tokenizer'),
    'XML Extension' => extension_loaded('xml'),
    'GD Extension' => extension_loaded('gd'),
    'Intl Extension' => extension_loaded('intl'),
    'Zip Extension' => extension_loaded('zip'),
    'Exif Extension' => extension_loaded('exif'),
    'exec() Function' => function_exists('exec'),
    'passthru() Function' => function_exists('passthru'),
    'Writable storage/' => is_path_writable('storage'),
    'Writable bootstrap/cache/' => is_path_writable('bootstrap/cache'),
];

// Check if all items in the requirements array are true
$allPassed = !in_array(false, $requirements, true);

$title = 'System Requirements';
// --- PHP LOGIC END ---

include __DIR__ . '/../layout/header.php';
?>

<h2 class="mb-4">Server Requirements</h2>

<p class="mb-4 text-muted">
    We're checking your server environment to ensure it meets all necessary dependencies for **Sellio**.
</p>

<div class="table-responsive">
    <table class="table table-hover table-striped border shadow-sm" style="border-radius: 8px; overflow: hidden;">
        <thead class="table-light">
            <tr>
                <th scope="col" class="text-start ps-4">Requirement</th>
                <th scope="col" class="text-center" style="width: 150px;">Status</th>
            </tr>
        </thead>
        <tbody class="border-top-0">
            <?php foreach ($requirements as $label => $ok): ?>
                <tr class="<?= $ok ? '' : 'table-danger' ?>">
                    <td class="ps-4 py-3">
                        <?php if (strpos($label, 'Writable') !== false): ?>
                            <i class="fa-solid fa-folder-open text-muted me-2"></i>
                        <?php elseif (strpos($label, 'PHP') !== false): ?>
                            <i class="fa-brands fa-php text-muted me-2"></i>
                        <?php else: ?>
                            <i class="fa-solid fa-puzzle-piece text-muted me-2"></i>
                        <?php endif; ?>
                        <?= htmlspecialchars($label) ?>
                    </td>
                    <td class="text-center py-3 fw-bold">
                        <?= $ok 
                            ? '<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> OK</span>' 
                            : '<span class="text-danger"><i class="fa-solid fa-circle-xmark me-1"></i> Missing</span>' 
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
    <a href="?step=welcome" class="btn btn-outline-secondary px-4">
        <i class="fa-solid fa-arrow-left me-2"></i>Back
    </a>

    <?php if ($allPassed): ?>
        <a href="?step=environment" class="btn btn-primary btn-lg px-5 shadow">
            Next: Database Setup <i class="fa-solid fa-chevron-right ms-2"></i>
        </a>
    <?php else: ?>
        <div class="text-end">
            <button class="btn btn-secondary btn-lg" onclick="window.location.reload();">
                <i class="fa-solid fa-rotate me-2"></i>Retry Check
            </button>
            <p class="text-danger small mt-2 mb-0">Please resolve the issues highlighted in red to proceed.</p>
        </div>
    <?php endif; ?>
</div>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>