  <header class="cover">
    <div class="wrap">
      <div class="navline"><div class="brand"><img src="../images/logo.png" alt="Sellio">SELLIO</div><span class="version">VERSION <?= htmlspecialchars($publicContent['product']['version']) ?></span></div>
      <div class="hero-grid">
        <div class="hero-copy"><div class="eyebrow">Everything You Need. All in One Powerful Core.</div><h1>Build Any Experience.<br><span>Endless Possibilities.</span></h1><p class="lead">Sell products, book properties, publish jobs, manage services, run events, list vehicles, or operate classifieds&mdash;with connected admin, seller, buyer, storefront, API, and mobile experiences.</p><div class="cover-actions"><a class="button" href="<?= htmlspecialchars($publicContent['urls']['storefront']) ?>" target="_blank" rel="noopener">Explore Live Demo &rarr;</a></div><div class="stackline"><?php foreach (array_slice($publicContent['stack'], 0, 6) as $technology): ?><span><?= htmlspecialchars($technology['name'] . ' ' . $technology['version']) ?></span><?php endforeach; ?></div></div>
      </div>
      <div class="scope-strip"><?php foreach ($publicContent['verticals'] as $vertical): ?><span><?= htmlspecialchars($vertical['label']) ?></span><?php endforeach; ?></div>
      <div class="search-chat">
        <h3 class="chat-heading">AI Smart Search</h3>
        <div class="chat-timeline">
          <div class="chat-entry chat-left">
            <div class="chat-side"><div class="chat-bubble">&ldquo;I need 2-bedroom house for sale&rdquo;</div></div>
            <span class="chat-node"><img src="assets/avatar-property.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"></div>
          </div>
          <div class="chat-entry chat-right">
            <div class="chat-side"></div>
            <span class="chat-node"><img src="assets/avatar-booking.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"><div class="chat-bubble">&ldquo;Book a 3 nights stay in New York&rdquo;</div></div>
          </div>
          <div class="chat-entry chat-left">
            <div class="chat-side"><div class="chat-bubble">&ldquo;Electric SUV under $20K&rdquo;</div></div>
            <span class="chat-node"><img src="assets/avatar-vehicle.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"></div>
          </div>
          <div class="chat-entry chat-right">
            <div class="chat-side"></div>
            <span class="chat-node"><img src="assets/avatar-product.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"><div class="chat-bubble">&ldquo;Used iPhone 17 Pro&rdquo;</div></div>
          </div>
          <div class="chat-entry chat-left">
            <div class="chat-side"><div class="chat-bubble">&ldquo;AC repair urgent&rdquo;</div></div>
            <span class="chat-node"><img src="assets/avatar-service.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"></div>
          </div>
          <div class="chat-entry chat-right">
            <div class="chat-side"></div>
            <span class="chat-node"><img src="assets/avatar-job.jpg" alt="" loading="lazy"></span>
            <div class="chat-side"><div class="chat-bubble">&ldquo;Remote React Developer&rdquo;</div></div>
          </div>
        </div>
        <div class="chat-close">
          <span class="chat-close-icon" aria-hidden="true">
            <svg class="ai-brain-mark" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="aiCoreFill" x1="32" y1="24" x2="91" y2="96" gradientUnits="userSpaceOnUse"><stop stop-color="#25344d"/><stop offset="1" stop-color="#101827"/></linearGradient>
                <linearGradient id="aiSignal" x1="33" y1="34" x2="87" y2="86" gradientUnits="userSpaceOnUse"><stop stop-color="#a2e871"/><stop offset="1" stop-color="#67b73a"/></linearGradient>
                <filter id="aiCoreShadow" x="16" y="16" width="88" height="92" filterUnits="userSpaceOnUse"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#101827" flood-opacity=".28"/></filter>
              </defs>
              <g class="ai-flow-arrows" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 42A43 43 0 0 1 77 19" stroke="#76c043" stroke-width="2.5"/>
                <path d="m73 14 7 5-8 3" stroke="#76c043" stroke-width="2.5"/>
                <path d="M101 46a43 43 0 0 1-13 48" stroke="#4b67d1" stroke-width="2.5"/>
                <path d="m89 88-1 8 8-2" stroke="#4b67d1" stroke-width="2.5"/>
                <path d="M76 101a43 43 0 0 1-56-25" stroke="#d67232" stroke-width="2.5"/>
                <path d="m25 79-6-5-2 8" stroke="#d67232" stroke-width="2.5"/>
              </g>
              <circle cx="60" cy="60" r="40" fill="url(#aiCoreFill)" filter="url(#aiCoreShadow)"/>
              <path d="M57 39c-3.2-4.5-10-5.2-14-1.3-2.2 2.1-3 5-2.4 7.7-5.7.9-9.8 5.9-9.2 11.8.3 3 1.9 5.6 4.2 7.3-2.3 5.4.2 11.9 5.6 14.3 1.9.9 4 1.1 5.9.6 1.7 4 5.6 6.7 9.9 6.7V39Z" stroke="url(#aiSignal)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M63 39c3.2-4.5 10-5.2 14-1.3 2.2 2.1 3 5 2.4 7.7 5.7.9 9.8 5.9 9.2 11.8-.3 3-1.9 5.6-4.2 7.3 2.3 5.4-.2 11.9-5.6 14.3-1.9.9-4 1.1-5.9.6-1.7 4-5.6 6.7-9.9 6.7V39Z" stroke="url(#aiSignal)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M43 49h8l4 5M39 64h10l6-6M44 75h7l4-5M77 49h-8l-4 5M81 64H71l-6-6M76 75h-7l-4-5" stroke="#dff5d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <g fill="#a2e871" stroke="#101827" stroke-width="1.5"><circle cx="43" cy="49" r="3"/><circle cx="39" cy="64" r="3"/><circle cx="44" cy="75" r="3"/><circle cx="77" cy="49" r="3"/><circle cx="81" cy="64" r="3"/><circle cx="76" cy="75" r="3"/><circle cx="60" cy="57" r="3.5"/></g>
              <circle cx="101" cy="46" r="4" fill="#4b67d1"/><circle cx="20" cy="75" r="3" fill="#d67232"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </header>
