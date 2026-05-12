<div class="wheel-container">
    <div class="card-stack" id="stack-container">
        <?php foreach ($screenshots as $index => $item): 
            // This ensures the first card gets pos-1, second pos-2, etc.
            $positionClass = "pos-" . ($index + 1); 
        ?>
            <div class="card-3d <?php echo $positionClass; ?>">
                <div class="browser-chrome">
                    <div class="window-dots">
                        <span class="dot-red"></span>
                        <span class="dot-yellow"></span>
                        <span class="dot-green"></span>
                    </div>
                    <div class="browser-address"><?php echo $item['url']; ?></div>
                </div>
                <div class="window-content">
                    <img src="<?php echo $item['img']; ?>" alt="Project Screenshot">
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>