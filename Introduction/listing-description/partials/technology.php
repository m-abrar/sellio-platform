<?php
$technologyIcons = [
    'Laravel' => 'assets/icons/laravel.svg',
    'PHP' => 'assets/icons/php.svg',
    'Next.js' => 'assets/icons/nextjs.svg',
    'React' => 'assets/icons/react.svg',
    'Expo' => 'assets/icons/expo.svg',
    'MySQL' => 'assets/icons/mysql.svg',
    'Echo / Pusher' => 'assets/icons/pusher.svg',
];
$gatewayIcons = [
    'Stripe' => 'assets/icons/stripe.svg',
    'PayPal' => 'assets/icons/paypal.svg',
    'Razorpay' => 'assets/icons/razorpay.svg',
];
?>
<section class="section tech" id="technology"><div class="wrap"><div class="eyebrow">Technology</div><h2>Modern tools, fully open in the source code.</h2><p class="lead">A Laravel backend powers APIs and operations, while React applications, Next.js storefronts, and an Expo mobile client serve different audiences.</p><div class="tech-grid">
<?php foreach ($publicContent['stack'] as $technology): ?>
  <div class="tech-item">
    <?php if (isset($technologyIcons[$technology['name']])): ?><img src="<?= htmlspecialchars($technologyIcons[$technology['name']]) ?>" alt="<?= htmlspecialchars($technology['name']) ?>" loading="lazy"><?php else: ?><svg viewBox="0 0 24 24" aria-label="<?= htmlspecialchars($technology['name']) ?>"><rect x="5" y="11" width="14" height="9" fill="none" stroke="#76c043" stroke-width="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#76c043" stroke-width="1.5"/></svg><?php endif; ?>
    <small><?= htmlspecialchars($technology['layer']) ?></small><b><?= htmlspecialchars(trim($technology['name'] . ' ' . ($technology['version'] ?? ''))) ?></b>
  </div>
<?php endforeach; ?>
</div><div class="gateway-row">
<?php foreach ($publicContent['gateways'] as $gateway): ?>
  <span><?php if (isset($gatewayIcons[$gateway])): ?><img src="<?= htmlspecialchars($gatewayIcons[$gateway]) ?>" alt="<?= htmlspecialchars($gateway) ?>" loading="lazy"><?php else: ?><svg viewBox="0 0 20 20" aria-label="<?= htmlspecialchars($gateway) ?>"><rect width="20" height="20" rx="4" fill="#eef2e9"/><text x="10" y="14" font-size="10" font-weight="800" text-anchor="middle" fill="#477d25"><?= htmlspecialchars(substr($gateway, 0, 1)) ?></text></svg><?php endif; ?><?= htmlspecialchars($gateway) ?></span>
<?php endforeach; ?>
</div></div></section>
