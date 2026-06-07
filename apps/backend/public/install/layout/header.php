<?php
// =================================================================================
// Sellio Installer - HTML Header & Layout Shell (Premium Edition)
// File: layout/header.php
// =================================================================================
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars(($title ?? 'Installation Wizard') . ' | Sellio') ?></title>
    
    <link href="/vendor/npm/fontsource/bundle.css" rel="stylesheet">
    <link href="/vendor/npm/fontawesome/css/all.min.css" rel="stylesheet">
    <link href="/vendor/npm/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
    
</head>
<body>
<div class="container container-installer">
    <div class="install-card fade-in">
        <h1 class="text-center mb-5 fw-bold">Sellio Setup Wizard</h1>
        
        <div class="stepper">
        <?php
        if (!empty($steps) && !empty($currentStepKey)) {
            $stepKeys = array_keys($steps);
            $currentIndex = array_search($currentStepKey, $stepKeys);

            foreach ($steps as $key => $data) {
                $name = $data[0];
                $icon = $data[1];
                $class = '';
                $stepIndex = array_search($key, $stepKeys);

                if ($key === $currentStepKey) {
                    $class = 'active';
                } elseif ($stepIndex < $currentIndex) {
                    $class = 'completed';
                }

                echo "<div class='step {$class}'>";
                echo "<div class='step-icon'><i class='fa-solid {$icon}'></i></div>";
                echo "<div class='step-name'>" . htmlspecialchars($name) . "</div>";
                echo "</div>";
            }
        }
        ?>
        </div>
