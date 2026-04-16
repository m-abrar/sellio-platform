<?php
// =================================================================================
// Sellio Installer - HTML Header & Layout Shell
// File: layout/header.php
// =================================================================================
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars(($title ?? 'Installation Wizard') . ' | Sellio') ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    
    <style>
        /* (The complete style block from Section 1 goes here) */
        /* 1. Custom Colors and Accent */
        :root {
            --primary-color: #1a73e8; /* Deep/Vibrant Blue - Main Accent */
            --accent-color: #0d9488; /* Teal/Emerald - Secondary Accent for Completion/Success */
            --text-color: #343a40; /* Dark Gray */
            --light-bg: #f8f9fa; /* Very light gray */
            --border-color: #e9ecef;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--light-bg);
            color: var(--text-color);
            padding-top: 50px;
            padding-bottom: 50px;
        }

        .container-installer {
            max-width: 900px;
        }

        .install-card {
            background-color: #ffffff;
            border-radius: 12px; /* Smoother corners */
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            padding: 3rem;
        }

        /* 2. Stepper Styling (Icon-Based) */
        .stepper {
            display: flex;
            justify-content: space-between;
            align-items: flex-start; /* Align text below icons nicely */
            margin-bottom: 3.5rem;
            position: relative;
        }

        /* Line connector */
        .stepper::before {
            content: '';
            position: absolute;
            top: 22px; /* Center with icon */
            left: 5%;
            right: 5%;
            height: 2px;
            background-color: var(--border-color);
            z-index: 1;
        }

        .step {
            flex-grow: 1;
            text-align: center;
            position: relative;
            color: #6c757d;
            font-weight: 500;
            z-index: 2; /* Keep steps above the line */
        }

        /* Icon Placeholder */
        .step .step-icon {
            width: 44px;
            height: 44px;
            line-height: 40px;
            background-color: #ffffff;
            border: 2px solid var(--border-color);
            border-radius: 50%;
            margin: 0 auto 10px;
            color: #6c757d;
            font-size: 1.1rem;
            transition: all 0.3s;
            box-shadow: 0 0 0 4px var(--light-bg); /* White halo */
        }

        /* Completed Step */
        .step.completed {
            color: var(--accent-color);
        }
        .step.completed .step-icon {
            border-color: var(--accent-color);
            background-color: var(--accent-color);
            color: #ffffff;
        }
        .stepper .step.completed:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 22px;
            left: -50%;
            width: 100%;
            height: 2px;
            background-color: var(--accent-color);
            z-index: 0;
        }

        /* Active Step */
        .step.active {
            color: var(--primary-color);
        }
        .step.active .step-icon {
            border-color: var(--primary-color);
            background-color: var(--primary-color);
            color: #ffffff;
            box-shadow: 0 0 0 4px var(--light-bg), 0 0 10px rgba(26, 115, 232, 0.4);
        }

        /* Forms */
        .form-label {
            font-weight: 600;
            color: var(--text-color);
        }
        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.25rem rgba(26, 115, 232, 0.25);
        }
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            transition: background-color 0.2s;
        }
        .btn-primary:hover {
            background-color: #1764cc;
            border-color: #1764cc;
        }

        /* Log Output */
        pre {
            background-color: #212529;
            color: #f8f9fa;
            border: none;
        }
    </style>
</head>
<body>
<div class="container container-installer">
    <div class="install-card">
        <h1 class="text-center mb-5 fw-bold" style="color: var(--primary-color);">Sellio Setup Wizard</h1>
        
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
                echo "<div>" . htmlspecialchars($name) . "</div>";
                echo "</div>";
            }
        }
        ?>
        </div>