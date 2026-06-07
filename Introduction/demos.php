<div class="container text-center">
    <h2 class="display-5 fw-800 mb-2 text-white">Explore 50+ Demos</h2>
    <p class="text-white opacity-75 lead mb-5">One license gives you access to every niche imaginable.</p>

    <div class="d-flex flex-wrap justify-content-center gap-2 mb-5">
        <button class="filter-btn active" data-filter="all">
            All Demos <span class="badge-count"><?php echo $total_demos; ?></span>
        </button>
        
        <?php foreach($category_counts as $cat => $count): ?>
            <button class="filter-btn" data-filter="<?php echo strtolower(str_replace(' ', '-', $cat)); ?>">
                <?php echo $cat; ?> <span class="badge-count"><?php echo $count; ?></span>
            </button>
        <?php endforeach; ?>
    </div>

    <div class="row g-4" id="demo-grid">
        <?php foreach($demos as $demo): ?>
            <?php 
                $isSoon = ($demo['status'] === 'soon'); 
                $catSlug = strtolower(str_replace(' ', '-', $demo['cat']));
            ?>
            <div class="col-md-4 demo-item" data-category="<?php echo $catSlug; ?>">
                <div class="demo-card-v2 <?php echo $isSoon ? 'coming-soon' : ''; ?>">
                    
                    <div class="demo-img-wrapper">
                        <img src="<?php echo $demo['img']; ?>" class="scroll-img" alt="<?php echo $demo['name']; ?>">
                        <?php if($isSoon): ?>
                            <div class="soon-badge">Coming Soon</div>
                        <?php endif; ?>
                        <div class="demo-overlay-v2"></div>
                    </div>

                    <div class="p-3 d-flex justify-content-between align-items-center bg-card-footer border-top">
                        <div class="text-start">
                            <h5 class="fw-bold mb-0"><?php echo $demo['name']; ?></h5>
                            <small class="text-muted text-uppercase" style="font-size: 10px; letter-spacing: 1px;">
                                <?php echo str_replace('_', ' ', $demo['slug']); ?>
                            </small>
                        </div>
                        
                        <?php 
                            // Split the slug (e.g., 'unifieds_mega' becomes ['unifieds', 'mega'])
                            $parts = explode('_', $demo['slug']);
                            $catSegment = $parts[0] ?? 'unifieds';
                            $typeSegment = $parts[1] ?? 'default';
                            $previewUrl = rtrim($sites['demo']['storefront'], '/') . '/landing-page/' . $catSegment . '/' . $typeSegment;
                        ?>

                        <?php if($isSoon): ?>
                            <button class="btn btn-sm btn-light rounded-pill px-3 fw-bold" disabled>Soon</button>
                        <?php else: ?>
                            <a href="<?php echo $previewUrl; ?>" class="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold" target="_blank">
                                Live Preview
                            </a>
                        <?php endif; ?>

                    </div>

                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>