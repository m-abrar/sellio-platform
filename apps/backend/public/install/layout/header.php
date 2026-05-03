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
    
    <!-- Premium Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    
    <!-- Framework -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    
    <!-- Premium Installer Styles -->
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