# Sellio Platform - Future Implementation Roadmap Options

This document details the prioritized functional upgrades, business layers, and UI/UX enhancements planned for the next stages of the **Sellio** monorepo platform.

---

## 🗺️ Option 1: Premium Messaging & Inquiry Center with Rich Listing Context

*   **Focus:** Connecting user inquiries (`classified_inquiries`, application leads, listing messages) directly to their respective listings inside the messaging center (`apps/seller/src/pages/messages/`).
*   **Why:** When a buyer inquires about a classified item, a car, or a property, partners should see an interactive sidebar detailing the specific listing (image, price, tags, and key specs) right next to the chat screen.
*   **Proposed Work:**
    1.  Eager-load listing relationships on inquiry messages in the Laravel backend.
    2.  Upgrade the messaging panel in React to render contextual listing cards (using high-fidelity glassmorphic elements) for instant reference during live chats.

---

## 📈 Option 2: Unified Seller Analytics Dashboard Upgrade

*   **Focus:** Developing cross-vertical listing insights and aggregated metrics in `DashboardHome.tsx` and the `analytics/` folder.
*   **Why:** Now that listings contain sophisticated specifications (e.g. ticket tiers, brands, categories), we can build unified chart widgets showing traffic, sales/inquiries, and lead conversion rates broken down dynamically by vertical or brand.
*   **Proposed Work:**
    1.  Implement aggregated analytics endpoints in the backend (grouping metrics by listing type and date).
    2.  Build responsive glassmorphic chart widgets (using Tailwind or custom HSL-styled SVG components) for visual metrics representation.

---

## ⭐ Option 3: Review & Customer Testimonials Moderation Center

*   **Focus:** Activating and managing the polymorphic Review relationship (`MorphMany` &rarr; `Review::class`) across the `reviews/` dashboard page.
*   **Why:** Products, services, properties, and events all accumulate customer feedback. Partners need an elegant hub to moderate reviews, reply to ratings, and feature specific testimonials on their public profiles.
*   **Proposed Work:**
    1.  Add API endpoints to list, reply to, and toggle the publication status of reviews.
    2.  Build a high-fidelity card-based review manager interface in the frontend with interactive stars, filters by rating/vertical, and responsive quick-reply cards.

---

## 💼 Option 4: Partner Wallet & Transaction Ledger

*   **Focus:** Integrating financial bookkeeping and payout pipelines in `WalletPage.tsx` and the `transactions/` folder.
*   **Why:** Purchases (Products), ticket bookings (Events), and service charges generate financial records (`TransactionLine::class`). Bridging these backend records to the frontend Wallet creates complete financial transparency.
*   **Proposed Work:**
    1.  Expose categorized transaction logs and pending/cleared balance calculations in the API.
    2.  Refactor the seller wallet UI to present dynamic ledger tables, withdrawal request modals, and premium glassmorphic revenue-split breakdowns.

---

## 💳 Option 5: Manage Linked Accounts & Payout Methods

*   **Focus:** Managing dynamic payout methods (Bank Account, PayPal email, Stripe Connect) inside `WalletPage.tsx` and the Laravel backend.
*   **Why:** Currently, the seller dashboard uses a static placeholder ("Chase Bank **** 4290") inside `WalletPage.tsx`. To launch a production-ready marketplace platform, partners must be able to securely link, view, delete, and switch active payout methods.
*   **Proposed Work:**
    1.  **Backend Schema:** Create a new `payout_methods` table (fields: `id`, `partner_id`, `type` [bank, paypal, stripe], `details` [json], `is_primary`, `created_at`, `updated_at`).
    2.  **API Endpoints:** Build index, store, destroy, and "set primary" routes inside `WalletController.php` or a dedicated `PayoutMethodController.php`.
    3.  **Frontend State & Wiring:** Replace the hardcoded Chase Bank display inside `WalletPage.tsx` with dynamic arrays fetched from `/api/v1/dashboard/partner/payout-methods`.
    4.  **Interactive Forms:** Wire the "+ Add New Account" button to trigger a high-fidelity glassmorphic modal with form fields for Bank details (Routing, Account number), PayPal email, or Stripe account sync.
    5.  **Modal Integration:** Integrate the payout method selector inside the dynamic "Withdrawal Modal" to let partners choose which linked account to withdraw funds to.

---

## 💰 Option 6: Add Funds to Wallet Balance

*   **Focus:** Integrating interactive deposits to let sellers top up their wallet balances inside `WalletPage.tsx` and the Laravel backend.
*   **Why:** Currently, the "Add Funds" button in `WalletPage.tsx` is an inactive placeholder. Enabling deposits allows partners to add funds directly to purchase featured listing slots, premium badges, or pay for subscription plan renewals.
*   **Proposed Work:**
    1.  **Backend Gateway API:** Add a `POST /api/v1/dashboard/partner/wallet/deposit` route in `WalletController.php` that handles secure mock or live card payment transactions (using Stripe or PayPal APIs).
    2.  **Balance Credit Logic:** On a successful gateway charge, credit the partner's `wallet.balance` and write a new transaction ledger record (`type` = `earning`, `status` = `Completed`, `title` = `Wallet Deposit`).
    3.  **Frontend Deposit Modal:** Map the "Add Funds" button to launch an elegant, glassmorphic modal featuring deposit amount quick-selectors (e.g., $10, $50, $100) and card credentials input fields.
    4.  **Real-Time Balance Update:** Fetch and refresh the active wallet state immediately upon deposit success to update the dashboard statistics without a hard page reload.

---

## 🛡️ Option 7: Premium Subscriptions & Stripe Cashier Billing

*   **Focus:** Migrating the membership subscription engine from manual switches to recurring gateway checkouts, automated billing, and live quota guards.
*   **Why:** To transition Sellio into a fully automated SaaS platform, plan renewals and tier transitions must handle recurring credit card billing and checkouts automatically, alongside proactive listing limit enforcement.
*   **Proposed Work:**
    1.  **Laravel Cashier Integration:** Setup Laravel Cashier (Stripe) or custom subscription gateways inside the backend to manage plans, customer metadata, and checkout session redirects.
    2.  **Frontend Quota Guards:** Build React router guards and button checks in the seller panel to alert and redirect partners to `/dashboard/memberships` if they try to post listings exceeding their active tier limits (e.g., 3 listings on Starter).
    3.  **Webhook Event Handlers:** Create API webhook handlers for Stripe events (`customer.subscription.deleted`, `invoice.payment_failed`) to automatically degrade quotas or suspend dashboard access.
    4.  **Billing History & Invoices:** Append a billing ledger under `MembershipsPage.tsx` displaying invoice timestamps, charge totals, and PDF receipt download links.

---



