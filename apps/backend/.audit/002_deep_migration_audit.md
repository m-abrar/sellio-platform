# 🗄️ Deep Re-Audit: Database Migration Integrity Analysis

This report contains the finalized, high-fidelity findings for the core database migrations previously flagged as "Suspiciously Perfect" (100/100). Following strict enterprise-grade and CodeCanyon standards, these migrations have been downgraded to reflect significant architectural and scalability risks.

---

### 1. `database\migrations\2025_10_17_013201_create_properties_table.php`
- **Final Score**: **45/100**
- **Risk Level**: 🔴 CRITICAL
- **Findings**:
    - **Data Integrity**: **MISSING SOFT DELETES**. Hard-deleting real estate assets is an architectural failure for a multi-tenant SaaS.
    - **Performance**: Missing indexes on core foreign keys (`category_id`, `brand_id`, `location_id`). Unindexed `JOIN` operations will stall the platform at scale.
    - **Scalability**: Missing composite indexes on common public filters (`is_published`, `is_rental`). 
    - **Architecture**: Use of `float` for area fields (`area_sq_ft`) leads to precision drift. Should be `decimal`.
- **Production Status**: 🔴 UNSAFE

### 2. `database\migrations\2025_10_17_013202_create_autos_table.php`
- **Final Score**: **40/100**
- **Risk Level**: 🔴 CRITICAL
- **Findings**:
    - **Architecture**: Dangerous denormalization. Stores `make` and `model` as raw strings while also having `brand_id`. This guarantees data inconsistency.
    - **Data Integrity**: **MISSING SOFT DELETES**.
    - **Performance**: Missing indexes on critical search columns (`make`, `model`, `year`). 
    - **Integrity**: `condition_rating` lacks database-level range constraints.
- **Production Status**: 🔴 UNSAFE

### 3. `database\migrations\2018_11_06_222923_create_transactions_table.php`
- **Final Score**: **60/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Performance**: `wallet_id` is missing an index. Financial lookups by wallet will perform full table scans.
    - **Scalability**: Heavy use of composite indexes on a polymorphic table will degrade `INSERT` performance as the platform scales.
    - **Architecture**: `decimal(64, 0)` forces total reliance on the application layer for subunit management, increasing the risk of developer error in custom integrations.
- **Production Status**: 🟠 WARNING

### 4. `database\migrations\0001_01_01_000000_create_users_table.php`
- **Final Score**: **85/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Security**: Standard Laravel 11 structure.
    - **Performance**: `phone` is indexed correctly.
    - **Architecture**: Lacks a sequential UUID/ULID for public-facing identifiers (avoiding ID enumeration).
- **Production Status**: ✅ SAFE

### 5. `database\migrations\2025_10_17_041812_create_event_bookings_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Financial)
- **Findings**:
    - **Data Integrity**: **MISSING SOFT DELETES**. Hard-deleting tickets breaks financial reconciliation.
    - **Audit Failure**: `cascadeOnDelete()` on `event_id` wipes all financial history if a parent event is removed.
    - **Performance**: Missing composite indexes for event-level lookup.
- **Production Status**: 🔴 UNSAFE

### 6. `database\migrations\2025_10_17_041525_create_event_occurrences_table.php`
- **Final Score**: **45/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Performance**: Missing indexes on `start_date_time` and `end_date_time`. Full table scans on every calendar view.
    - **Architecture**: No database-level overlap constraints.
- **Production Status**: 🟠 WARNING

### 7. `database\migrations\2025_10_17_060806_create_service_quotes_table.php`
- **Final Score**: **40/100**
- **Risk Level**: 🔴 CRITICAL (Integrity)
- **Findings**:
    - **Architecture**: Missing soft deletes for contractual data.
    - **Privacy**: Unencrypted PII storage for guest users (`email`, `phone`).
    - **Performance**: Unindexed foreign keys and date filters.
- **Production Status**: 🔴 UNSAFE

### 8. `database\migrations\2025_10_17_111454_create_subscriptions_table.php`
- **Final Score**: **20/100**
- **Risk Level**: 🔴 CRITICAL (Scalability)
- **Findings**:
    - **Performance**: Missing index on `ends_at`. Causes linear scans during renewal cron execution.
    - **Architecture**: Missing soft deletes for billing history.
    - **SaaS Debt**: Coupled to `user_id` instead of a tenant/company entity.
- **Production Status**: 🔴 UNSAFE

### 9. `database\migrations\2026_01_01_121013_create_orders_table.php`
- **Final Score**: **25/100**
- **Risk Level**: 🔴 CRITICAL (Compliance)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** for user ownership. Deleting a user wipes tax/financial records. **P0 Compliance Failure**.
    - **Performance**: Unindexed `status` and `payment_status` columns.
    - **Audit Failure**: Missing status-specific timestamps (`refunded_at`).
- **Production Status**: 🔴 UNSAFE

---

### 10. `database\migrations\2025_10_19_043352_create_email_templates_table.php`
- **Final Score**: **50/100**
- **Risk Level**: 🟠 MEDIUM (Security)
- **Findings**:
    - **Architecture**: No multi-lingual support (missing locale/language columns).
    - **Security**: Raw HTML storage in `body` requires strict application-layer sanitization.
- **Production Status**: 🟠 WARNING

### 11. `database\migrations\2025_11_09_060216_create_activity_log_table.php`
- **Final Score**: **20/100**
- **Risk Level**: 🔴 CRITICAL (Scalability)
- **Findings**:
    - **Performance**: **MISSING INDEX ON CREATED_AT**. Activity logs grow exponentially; querying by time will crash the system at scale.
    - **Scalability**: Missing index on `batch_uuid`.
- **Production Status**: 🔴 UNSAFE

### 12. `database\migrations\2026_01_11_225659_create_blogs_table.php`
- **Final Score**: **40/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Performance**: Missing indexes on `is_published` and `published_at`.
    - **Data Integrity**: Missing soft deletes.
- **Production Status**: 🟠 WARNING

### 13. `database\migrations\2026_05_06_160000_production_hardening_migration.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Performance)
- **Findings**:
    - **Performance**: Adds `status` and `is_premium` to **18 tables** without indexes. 
    - **Maintainability**: Empty `down()` method makes the migration irreversible.
    - **Integrity**: Dangerous `change()` operations on legacy columns.
- **Production Status**: 🔴 UNSAFE

---


### 14. `database\migrations\2023_12_30_113122_extra_columns_removed.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Data Loss)
- **Findings**:
    - **Architecture**: **Permanent Data Destruction**. Drops polymorphic type columns from the wallet system. If the app relies on distinguishing transfer sources, this migration is irreversible and destructive.
    - **Performance**: Replaces composite indexes with single-column indexes, potentially stalling type-filtered queries.
- **Production Status**: 🔴 UNSAFE

### 15. `database\migrations\2025_10_17_041016_create_event_ticket_types_table.php`
- **Final Score**: **50/100**
- **Risk Level**: 🔴 CRITICAL (Integrity)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** on `event_id`. Deleting an event wipes ticket tier definitions.
    - **Architecture**: Missing soft deletes.
- **Production Status**: 🟠 WARNING

### 16. `database\migrations\2025_10_17_041525_create_event_occurrences_ticket_table.php`
- **Final Score**: **50/100**
- **Risk Level**: 🔴 CRITICAL (Integrity)
- **Findings**:
    - **Data Integrity**: Double cascade delete risk.
    - **Architecture**: No database-level inventory constraints (e.g., unsigned integers or check constraints for negative stock).
- **Production Status**: 🟠 WARNING

### 17. `database\migrations\2025_10_17_045646_create_auto_inquiries_table.php`
- **Final Score**: **40/100**
- **Risk Level**: 🔴 CRITICAL (Privacy)
- **Findings**:
    - **Privacy**: Unencrypted PII storage for guest leads.
    - **Data Integrity**: Leads are lost if the parent car listing is deleted (cascade).
    - **Performance**: Missing indexes on `status` and `preferred_date`.
- **Production Status**: 🔴 UNSAFE

### 18. `database\migrations\2025_10_17_055100_create_job_applications_table.php`
- **Final Score**: **35/100**
- **Risk Level**: 🔴 CRITICAL (Integrity)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** on `job_listing_id`. Deleting a job listing wipes all HR records and applicant PII. 
    - **Privacy**: No built-in encryption for resume/cover letter metadata.
    - **Architecture**: Missing soft deletes.
- **Production Status**: 🔴 UNSAFE

### 19. `database\migrations\2025_10_17_065557_create_classified_inquiries_table.php`
- **Final Score**: **40/100**
- **Risk Level**: 🔴 CRITICAL (Privacy)
- **Findings**:
    - **Privacy**: Unencrypted guest PII storage.
    - **Data Integrity**: Cascade delete risk on listing removal.
- **Production Status**: 🔴 UNSAFE

### 20. `database\migrations\2025_10_17_074024_create_tags_table.php`
- **Final Score**: **75/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Performance**: Missing indexes on 8 module-specific boolean flags (`is_property`, `is_event`, etc.).
    - **Architecture**: Hardcoded module flags inhibit dynamic vertical expansion.
- **Production Status**: 🟠 WARNING

### 21. `database\migrations\2025_10_17_092612_create_seasonal_prices_table.php`
- **Final Score**: **60/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Performance**: Missing indexes on `start_date` and `end_date`. Range queries for price lookups will slow down as data grows.
    - **Data Integrity**: Cascade delete risk on property removal.
- **Production Status**: 🟠 WARNING

### 22. `database\migrations\2025_10_17_095104_create_property_addons_table.php`
- **Final Score**: **70/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Precision**: `decimal(8, 2)` is too narrow for future-proofing or hyper-inflationary currencies.
    - **Data Integrity**: Cascade delete risk.
- **Production Status**: 🟠 WARNING

### 23. `database\migrations\2025_10_17_100613_create_transaction_lines_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Financial)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** for `property_id`. Deleting a property wipes its entire financial history. This is a major audit failure.
    - **Performance**: Missing indexes on `transaction_date` and `type`.
    - **Architecture**: Missing soft deletes.
- **Production Status**: 🔴 UNSAFE

### 24. `database\migrations\2025_10_19_045052_create_payments_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Compliance)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** for `user_id`. Financial payment records are wiped if a user is deleted, violating audit and KYC standards.
    - **Architecture**: Missing soft deletes for financial data.
- **Production Status**: 🔴 UNSAFE

### 25. `database\migrations\2025_10_19_031739_create_media_table.php`
- **Final Score**: **95/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Architecture**: Standard Spatie schema with added moderation status support (`admin_notes`).
- **Production Status**: ✅ SAFE

### 26. `database\migrations\2025_11_07_062548_create_tickets_table.php`
- **Final Score**: **60/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** for `user_id`. Support history is wiped upon user removal.
    - **Architecture**: Missing soft deletes for helpdesk records.
- **Production Status**: 🟠 WARNING

### 27. `database\migrations\2025_11_07_092159_create_withdrawal_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Compliance)
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** for `user_id`. Financial payout history is permanently lost, violating anti-money laundering and audit standards.
    - **Performance**: Missing indexes on approval/rejection timestamps.
- **Production Status**: 🔴 UNSAFE

### 28. `database\migrations\2025_11_13_033201_create_conversations_table.php`
- **Final Score**: **35/100**
- **Risk Level**: 🔴 CRITICAL (Scalability)
- **Findings**:
    - **Performance**: Missing index on `updated_at`. Inbox views in messaging apps require this index for sorted thread retrieval.
    - **Data Integrity**: Cascade delete risk on both participants.
- **Production Status**: 🔴 UNSAFE

### 29. `database\migrations\2025_11_13_033227_create_messages_table.php`
- **Final Score**: **35/100**
- **Risk Level**: 🔴 CRITICAL (Scalability)
- **Findings**:
    - **Performance**: Missing composite index on `['conversation_id', 'created_at']`. High-latency message retrieval for long threads.
- **Production Status**: 🔴 UNSAFE

### 30. `database\migrations\2025_11_16_030505_create_advertisements_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Scalability)
- **Findings**:
    - **Performance**: **JSON Targeting Anti-Pattern**. Uses JSON columns for city/region/placement targeting. High-CPU overhead for ad-delivery lookups on every page load compared to pivot tables.
    - **Architecture**: Missing soft deletes.
- **Production Status**: 🔴 UNSAFE

### 31. `database\migrations\2026_01_01_121033_create_order_items_table.php`
- **Final Score**: **65/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Data Integrity**: **CASCADE ON DELETE** on `order_id`. Removing an order wipes its line items, making financial audits impossible.
    - **Architecture**: Missing soft deletes.
- **Production Status**: 🟠 WARNING

### 32. `database\migrations\2026_01_01_121050_create_carts_table.php`
- **Final Score**: **80/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Performance**: Missing `last_activity_at` or specific indexes to facilitate efficient cleanup of abandoned carts in a high-traffic environment.
- **Production Status**: ✅ SAFE

### 33. `database\migrations\2026_03_29_160944_create_galleries_table.php`
- **Final Score**: **85/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **UX/SEO**: Missing `slug` column for unique frontend gallery routing.
- **Production Status**: ✅ SAFE

### 34. `database\migrations\2025_10_17_095107_create_product_attributes_table.php`
- **Final Score**: **65/100**
- **Risk Level**: 🟠 MEDIUM
- **Findings**:
    - **Architecture**: Poor EAV-like implementation using flat columns instead of normalized attribute definitions.
    - **Performance**: Missing composite indexes on `product_id`, `name`, and `value`. High-latency catalog filtering on large datasets.
- **Production Status**: 🟠 WARNING

### 35. `database\migrations\2025_10_19_040032_create_permission_tables.php`
- **Final Score**: **100/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Architecture**: Standard Spatie RBAC implementation. Industry-standard and fully optimized.
- **Production Status**: ✅ SAFE

### 36. `database\migrations\2025_11_04_033908_create_payment_gateways_table.php`
- **Final Score**: **95/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Architecture**: Clean registry pattern for dynamic gateway orchestration.
- **Production Status**: ✅ SAFE

### 37. `database\migrations\2025_11_04_033924_create_gateway_field_blueprints_table.php`
- **Final Score**: **95/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Security**: Includes `is_sensitive` flag for UI-level credential masking.
- **Production Status**: ✅ SAFE

### 38. `database\migrations\2025_11_04_033933_create_gateway_credentials_table.php`
- **Final Score**: **30/100**
- **Risk Level**: 🔴 CRITICAL (Security)
- **Findings**:
    - **Multi-Tenant Safety**: **P0 Critical Leakage Risk**. Lacks `tenant_id` or `user_id`. If the platform is a SaaS where users have their own Stripe accounts, this table currently only supports a single global gateway configuration.
    - **Security**: Schema relies on application-level encryption (longText) rather than database-native security.
- **Production Status**: 🔴 UNSAFE

### 39. `database\migrations\2025_11_09_032824_create_notifications_table.php`
- **Final Score**: **90/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Performance**: Missing indexes on `read_at` and `created_at`. Large-scale notification counts will eventually cause performance degradation.
- **Production Status**: ✅ SAFE

### 40. `database\migrations\2025_11_25_130122_create_page_contents_table.php`
- **Final Score**: **100/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Architecture**: Highly optimized CMS schema with compound unique indexing for multi-theme support.
- **Production Status**: ✅ SAFE

### 41. `database\migrations\2025_11_28_183140_create_menus_table.php`
- **Final Score**: **100/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Architecture**: Clean CMS navigation registry.
- **Production Status**: ✅ SAFE

### 42. `database\migrations\2025_11_28_185134_create_menu_items_table.php`
- **Final Score**: **95/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Performance**: Missing index on `order` column.
- **Production Status**: ✅ SAFE

### 43. `database\migrations\2026_03_24_145157_seed_module_settings.php`
- **Final Score**: **90/100**
- **Risk Level**: ✅ LOW
- **Findings**:
    - **Best Practices**: Data-as-migration anti-pattern, but acceptable for core configuration persistence.
- **Production Status**: ✅ SAFE

---





# 🛠️ Global Database Remediation Priority
1. **[P0]** Add `SoftDeletes` to all marketplace vertical tables (`properties`, `autos`, `services`, etc.).
2. **[P0]** Implement indexes for all foreign keys currently used in `constrained()` but missing explicit `index()`.
3. **[P0]** Create composite indexes for the most frequent search query combinations.
4. **[P1]** Convert `float` area/dimension fields to `decimal` to ensure high-fidelity calculations.
5. **[P1]** Resolve the `make`/`model` denormalization in the `autos` table to prevent data corruption.
