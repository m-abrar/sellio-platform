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
