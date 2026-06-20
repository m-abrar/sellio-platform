# Production Checklist

## Release Gate

Do not begin final recording until all critical demo surfaces are stable. Temporary exploratory captures are fine, but they must not be used in public edits.

### Demo readiness

- [ ] Laravel storefront loads without debug output or broken assets.
- [ ] Admin login and `/admin/welcome` load correctly.
- [ ] Seller portal uses the production API URL and logs in successfully.
- [ ] Buyer portal uses the production API URL and logs in successfully.
- [ ] Next.js storefront loads the selected themes and real demo data.
- [ ] Storage link and media conversions work on the demo server.
- [ ] Browser console contains no errors on recorded screens.
- [ ] Network panel contains no failed image, API, font, or script requests.
- [ ] Stripe/PayPal claims match verified sandbox behavior.

### Demo data

- [ ] Admin dashboards contain realistic values.
- [ ] Each vertical contains attractive approved listings.
- [ ] Seller account has an active subscription and available quota.
- [ ] Seller account contains listings across multiple verticals.
- [ ] Buyer account contains favorites, bookings, messages, applications, inquiries, and reviews.
- [ ] Orders, payments, subscriptions, wallets, and withdrawals use safe fictional data.
- [ ] No real customer or developer information is visible.

## Capture Preparation

- [ ] Record at 1920x1080 or higher.
- [ ] Set browser zoom to 100% unless a planned shot requires otherwise.
- [ ] Use a clean browser profile with bookmarks and extensions hidden.
- [ ] Disable password manager, translation, update, and notification popups.
- [ ] Hide operating-system notifications.
- [ ] Use a neutral cursor and enable click highlighting only when helpful.
- [ ] Close developer tools and local IDE windows.
- [ ] Preload all pages in separate tabs.
- [ ] Wait for fonts and images before starting each take.
- [ ] Prepare exact seed records and route order in advance.
- [ ] Record 2-3 seconds of clean handles before and after every action.

## Visual Standards

- [ ] Use one consistent browser frame treatment.
- [ ] Use the same accent color and typography as Sellio marketing assets.
- [ ] Keep captions short enough to read in two seconds.
- [ ] Maintain sufficient contrast and mobile-safe title placement.
- [ ] Use restrained transitions; prioritize UI readability.
- [ ] Blur all secrets, private email, IP, or personal information.
- [ ] Replace loading waits with clean cuts rather than extreme speed ramps.
- [ ] Avoid showing empty states unless the feature being demonstrated is the empty-state design.

## Audio Standards

- [ ] Narration is recorded in a quiet environment.
- [ ] Voice level remains consistent throughout the campaign.
- [ ] Background music is properly licensed for commercial marketing use.
- [ ] Music remains below narration and does not contain distracting vocals.
- [ ] Export a captions/subtitles file for every narrated video.
- [ ] Verify pronunciation of Sellio, Laravel, CodeCanyon, Stripe, and PayPal.

## Claim and Compliance Review

- [ ] Every feature claim can be demonstrated or documented.
- [ ] Technology versions match the release package.
- [ ] Number of modules/themes matches the shipping release.
- [ ] No unverified performance, capacity, or security guarantees appear.
- [ ] No third-party logo implies endorsement.
- [ ] Stock footage, music, fonts, icons, and images have commercial-use rights.
- [ ] CodeCanyon listing copy and video terminology are consistent.
- [ ] The final item URL and demo URLs are correct.

## Final QA

- [ ] Watch every export at normal speed on desktop.
- [ ] Watch mobile exports on an actual phone.
- [ ] Check spelling, capitalization, and punctuation frame by frame.
- [ ] Check that no cursor jump, password, secret, debug message, or notification appears.
- [ ] Confirm that displayed workflows still work on the live demo.
- [ ] Export a high-quality master and a compressed web version.
- [ ] Preserve project files, narration, music license, and raw footage.
- [ ] Add final URLs and publication dates to the campaign README.

## Suggested Raw Footage Structure

```text
video-production/
  00_brand/
  01_storefront/
  02_buyer/
  03_seller/
  04_admin/
  05_verticals/
  06_mobile/
  audio/
  captions/
  exports/
```

Keep large video files outside Git unless a dedicated media-storage policy is introduced.

