<section class="section access" id="access"><div class="wrap"><div class="eyebrow">Try every role</div><h2>Log in and try each dashboard yourself.</h2><p class="lead">Published demo accounts for the connected administration, seller, and buyer experiences.</p><div class="cards c3">
<?php foreach ($publicContent['demo_accounts'] as $account): ?>
  <?php $url = $publicContent['urls'][$account['url_key']] ?? $publicContent['urls']['storefront']; ?>
  <a class="card" href="<?= htmlspecialchars($url) ?>" target="_blank" rel="noopener"><span class="card-tag"><?= htmlspecialchars(substr($account['role'], 0, 1)) ?></span><b><?= htmlspecialchars($account['role']) ?> Dashboard</b><p>Open the <?= htmlspecialchars(strtolower($account['role'])) ?> experience using the published demo account.</p><span class="cred"><b>Email</b> <?= htmlspecialchars($account['email']) ?><br><b>Password</b> <?= htmlspecialchars($account['password']) ?></span></a>
<?php endforeach; ?>
</div></div></section>
