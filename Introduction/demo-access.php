<section id="live-demo" class="py-100 bg-white border-top border-bottom reveal" data-animation="animate__fadeInUp">
    <div class="container">
        <div class="text-center mb-5">
            <span class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-3">LIVE DEMO ACCESS</span>
            <h2 class="display-5 fw-800 mb-3">Explore the <span class="text-sellio">Dashboards</span></h2>
            <p class="text-muted lead mb-0 mx-auto" style="max-width: 720px;">
                Click through the admin, seller, and buyer experiences with the seeded demo accounts below.
            </p>
        </div>

        <div class="row g-4 mb-5">
            <?php foreach ($sites['demo_accounts'] as $account): ?>
                <?php $portalUrl = $sites['demo'][$account['url_key']] ?? '#'; ?>
                <div class="col-lg-4">
                    <div class="p-4 p-lg-5 rounded-5 border h-100 shadow-premium-sm bg-white">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="icon-circle bg-<?= $account['color'] ?>-soft text-<?= $account['color'] ?>">
                                <i class="fas <?= $account['icon'] ?>"></i>
                            </div>
                            <div>
                                <h4 class="fw-800 mb-0"><?= htmlspecialchars($account['role']) ?> Portal</h4>
                                <small class="text-muted">One-click demo login</small>
                            </div>
                        </div>
                        <dl class="demo-credentials mb-4">
                            <dt>Email</dt>
                            <dd><code><?= htmlspecialchars($account['email']) ?></code></dd>
                            <dt>Password</dt>
                            <dd><code><?= htmlspecialchars($account['password']) ?></code></dd>
                        </dl>
                        <a href="<?= htmlspecialchars($portalUrl) ?>" target="_blank" rel="noopener" class="btn btn-main w-100">
                            Open <?= htmlspecialchars($account['role']) ?> Dashboard
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="p-4 rounded-5 bg-light border d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div>
                <h5 class="fw-800 mb-1">Public storefront & docs</h5>
                <p class="text-muted small mb-0">Browse the Laravel Blade frontend, installer, and technical documentation.</p>
            </div>
            <div class="d-flex flex-wrap gap-2">
                <a href="<?= htmlspecialchars($sites['demo']['storefront']) ?>" target="_blank" rel="noopener" class="btn btn-premium-outline btn-sm">Blade Storefront</a>
                <a href="<?= htmlspecialchars($sites['demo']['nextjs']) ?>" target="_blank" rel="noopener" class="btn btn-premium-outline btn-sm">Next.js Storefront</a>
                <a href="<?= htmlspecialchars($sites['demo']['install']) ?>" target="_blank" rel="noopener" class="btn btn-premium-outline btn-sm">Installer</a>
                <a href="<?= htmlspecialchars($sites['documentation']) ?>" target="_blank" rel="noopener" class="btn btn-premium-outline btn-sm">Documentation</a>
            </div>
        </div>
    </div>
</section>

<style>
    .demo-credentials dt {
        font-size: 0.7rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #64748b;
        margin-bottom: 0.15rem;
    }
    .demo-credentials dd {
        margin-bottom: 0.85rem;
    }
    .demo-credentials code {
        font-size: 0.85rem;
        color: #0f172a;
        background: #f8fafc;
        padding: 0.2rem 0.45rem;
        border-radius: 0.4rem;
    }
</style>
