# 🗄️ Phase 4: Database Layer Audit

---

## 🔎 Deep Audit Reports
- **[002_deep_migration_audit.md](file:///d:/Sellio/apps/backend/.audit/002_deep_migration_audit.md)**: Detailed analysis of schema integrity and performance risks.
- **[002_deep_seeder_factory_audit.md](file:///d:/Sellio/apps/backend/.audit/002_deep_seeder_factory_audit.md)**: Security and scalability audit for data generation.

---

## Migrations

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `database\migrations\0001_01_01_000000_create_users_table.php` | **85** | ✅ Safe - Sequential ID Debt |
| `database\migrations\0001_01_01_000001_create_cache_table.php` | **95** | ✅ Elite - Production Ready |
| `database\migrations\0001_01_01_000002_create_jobs_table.php` | **95** | ✅ Elite - Production Ready |
| `database\migrations\2018_11_06_222923_create_transactions_table.php` | **60** | 🟠 Warning - Index/Scale Debt |
| `database\migrations\2018_11_07_192923_create_transfers_table.php` | **60** | 🟠 Warning - Index/Scale Debt |
| `database\migrations\2018_11_15_124230_create_wallets_table.php` | **60** | 🟠 Warning - Index/Scale Debt |
| `database\migrations\2021_11_02_202021_update_wallets_uuid_table.php` | **70** | 🟠 Warning - Performance Risk |
| `database\migrations\2023_12_30_113122_extra_columns_removed.php` | **30** | 🔴 Critical - Destructive Optimization |
| `database\migrations\2023_12_30_204610_soft_delete.php` | **70** | 🟠 Warning - Coverage Gap |
| `database\migrations\2024_01_24_185401_add_extra_column_in_transfer.php` | **95** | ✅ Elite - Production Ready |
| `database\migrations\2025_10_16_031802_create_themes_table.php` | **70** | 🟠 Warning - XSS Risk |
| `database\migrations\2025_10_17_013159_create_categories_table.php` | **65** | 🟠 Warning - Index Debt |
| `database\migrations\2025_10_17_013160_create_locations_table.php` | **65** | 🟠 Warning - Index Debt |
| `database\migrations\2025_10_17_013161_create_brands_table.php` | **65** | 🟠 Warning - Index Debt |
| `database\migrations\2025_10_17_013161_create_type_table.php` | **65** | 🟠 Warning - Index Debt |
| `database\migrations\2025_10_17_013201_create_properties_table.php` | **95** | ✅ Elite - SoftDeletes/Indexes Hardened |
| `database\migrations\2025_10_17_013202_create_autos_table.php` | **95** | ✅ Elite - Schema Normalized / ENUMs |
| `database\migrations\2025_10_17_013203_create_events_table.php` | **95** | ✅ Elite - SoftDeletes Enforced |
| `database\migrations\2025_10_17_013204_create_joblistings_table.php` | **95** | ✅ Elite - SoftDeletes Enforced |
| `database\migrations\2025_10_17_013205_create_services_table.php` | **95** | ✅ Elite - SoftDeletes Enforced |
| `database\migrations\2025_10_17_013206_create_service_packages_table.php` | **60** | 🟠 Warning - Precision Debt |
| `database\migrations\2025_10_17_013207_create_products_table.php` | **95** | ✅ Elite - SoftDeletes Enforced |
| `database\migrations\2025_10_17_013210_create_classified_ads_table.php` | **95** | ✅ Elite - SoftDeletes Enforced |
| `database\migrations\2025_10_17_014201_create_property_bookings_table.php` | **95** | ✅ Elite - Atomic Integrity Hardened |
| `database\migrations\2025_10_17_014202_create_property_visits_table.php` | **85** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_17_023418_create_amenities_table.php` | **75** | 🟠 Warning - Module Flag Debt |
| `database\migrations\2025_10_17_023419_create_amenity_property_table.php` | **90** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_17_023450_create_features_table.php` | **75** | 🟠 Warning - Module Flag Debt |
| `database\migrations\2025_10_17_023452_create_featurables_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_17_033239_create_reviews_table.php` | **95** | ✅ Elite - Approval Guarded |
| `database\migrations\2025_10_17_041016_create_event_ticket_types_table.php` | **50** | 🟠 Warning - Cascade Delete Risk |
| `database\migrations\2025_10_17_041525_create_event_occurrences_table.php" | **45** | 🟠 Warning - Date Index Debt |
| `database\migrations\2025_10_17_041525_create_event_occurrences_ticket_table.php` | **50** | 🟠 Warning - Inventory Logic Gap |
| `database\migrations\2025_10_17_041812_create_event_bookings_table.php` | **95** | ✅ Elite - Financial Audit Ready |
| `database\migrations\2025_10_17_045646_create_auto_inquiries_table.php` | **40** | 🔴 Critical - Privacy/Cascade Debt |
| `database\migrations\2025_10_17_055100_create_job_applications_table.php` | **35** | 🔴 Critical - HR Record Loss Risk |
| `database\migrations\2025_10_17_060806_create_service_quotes_table.php` | **40** | 🔴 Critical - PII Security Gap |
| `database\migrations\2025_10_17_065557_create_classified_inquiries_table.php` | **95** | ✅ Elite - PII Masked |
| `database\migrations\2025_10_17_074024_create_tags_table.php` | **75** | 🟠 Warning - Filter Scan Debt |
| `database\migrations\2025_10_17_074212_create_taggables_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_17_080954_create_favorites_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_17_092612_create_seasonal_prices_table.php` | **60** | 🟠 Warning - Range Query Debt |
| `database\migrations\2025_10_17_095104_create_property_addons_table.php` | **70** | 🟠 Warning - Precision Debt |
| `database\migrations\2025_10_17_095107_create_product_addons_table.php` | **70** | 🟠 Warning - Precision Debt |
| `database\migrations\2025_10_17_095107_create_product_attributes_table.php` | **65** | 🟠 Warning - Performance Risk |
| `database\migrations\2025_10_17_100613_create_transaction_lines_table.php` | **95** | ✅ Elite - Financial Integrity Enforced |
| `database\migrations\2025_10_17_102556_create_property_fees_table.php` | **70** | 🟠 Warning - Precision Debt |
| `database\migrations\2025_10_17_111451_create_plans_table.php` | **60** | 🟠 Warning - Precision/Index Debt |
| `database\migrations\2025_10_17_111454_create_subscriptions_table.php` | **20** | 🔴 Critical - Linear Scan Bottleneck |
| `database\migrations\2025_10_19_031739_create_media_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_19_040032_create_permission_tables.php` | **100** | ✅ Elite - Production Ready |
| `database\migrations\2025_10_19_043352_create_email_templates_table.php` | **50** | 🟠 Warning - Localization Debt |
| `database\migrations\2025_10_19_045052_create_payments_table.php` | **95** | ✅ Elite - Audit Ready |
| `database\migrations\2025_10_19_052840_create_newsletter_subscribers_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_20_044720_create_settings_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_20_045209_create_pages_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_27_025845_create_service_appointments_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_10_31_035320_add_details_to_users_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_04_033908_create_payment_gateways_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_04_033924_create_gateway_field_blueprints_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_04_033933_create_gateway_credentials_table.php` | **95** | ✅ Elite - Encrypted & Tenant Isolated |
| `database\migrations\2025_11_07_062548_create_tickets_table.php` | **60** | 🟠 Warning - Ticket History Risk |
| `database\migrations\2025_11_07_092159_create_withdrawal_table.php` | **30** | 🔴 Critical - Payout History Risk |
| `database\migrations\2025_11_09_032824_create_notifications_table.php` | **90** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_09_060216_create_activity_log_table.php` | **20** | 🔴 Critical - Unindexed Timestamp |
| `database\migrations\2025_11_13_033201_create_conversations_table.php` | **35** | 🔴 Critical - Inbox Scan Debt |
| `database\migrations\2025_11_13_033227_create_messages_table.php` | **35** | 🔴 Critical - Message Sort Debt |
| `database\migrations\2025_11_16_023140_create_neighborhoods_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_16_023555_create_property_scores_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2025_11_25_130122_create_page_contents_table.php` | **100** | ✅ Elite - Production Ready |
| `database\migrations\2025_11_28_183140_create_menus_table.php` | **100** | ✅ Elite - Production Ready |
| `database\migrations\2025_11_28_185134_create_menu_items_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2026_01_01_121013_create_orders_table.php` | **95** | ✅ Elite - Financial Integrity Hardened |
| `database\migrations\2026_01_01_121033_create_order_items_table.php` | **65** | 🟠 Warning - Item History Risk |
| `database\migrations\2026_01_01_121050_create_carts_table.php` | **80** | ✅ Safe - Cleanup Debt |
| `database\migrations\2026_01_01_121139_create_cart_items_table.php` | **80** | ✅ Safe - Cleanup Debt |
| `database\migrations\2026_01_11_225659_create_blogs_table.php` | **40** | 🟠 Warning - Index/XSS Risk |
| `database\migrations\2026_01_18_211607_create_personal_access_tokens_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2026_03_23_084834_create_ticket_messages_table.php` | **95** | ✅ Safe - Production Ready |
| `database\migrations\2026_03_24_145157_seed_module_settings.php` | **90** | ✅ Safe - Production Ready |
| `database\migrations\2026_03_29_160944_create_galleries_table.php` | **85** | ✅ Safe - SEO/UX Debt |
| `database\migrations\2026_05_02_042057_create_campaigns_table.php` | **95** | ✅ Safe - Production Ready |

## Seeders

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `database\seeders\ActivityLogSeeder.php` | **95** | ✅ Elite - Performance Optimized |
| `database\seeders\AdvertisementSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\AmenitySeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\ApplicationSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\AutoSeeder.php` | **85** | ✅ Safe - Production Ready |
| `database\seeders\BlogSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\BrandSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\CampaignSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\CategorySeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\ClassifiedAdSeeder.php` | **90** | ✅ Safe - Production Ready |
| `database\seeders\DatabaseSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\EmailTemplateSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\EventSeeder.php` | **95** | ✅ Elite - Logic Hardened |
| `database\seeders\FavoriteSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\FeatureSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\JobSeeder.php` | **90** | ✅ Safe - Production Ready |
| `database\seeders\LocationSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\MediaFullSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\MediaSeeder.php` | **90** | ✅ Safe - Production Ready |
| `database\seeders\MenuItemSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\MenuSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\MessageSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\NewsletterSubscriberSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\NotificationSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\PageSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\Payment\StripeGatewaySeeder.php` | **90** | ✅ Safe - Production Ready |
| `database\seeders\PaymentSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\PlanSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\ProductModuleSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\ProductSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\PropertyModuleSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\RelationSeeder.php` | **95** | ✅ Elite - Optimized |
| `database\seeders\RolesAndPermissionsSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\SeasonalPriceSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\ServiceAppointmentSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\ServicePackageSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\ServiceSeeder.php` | **90** | ✅ Safe - Production Ready |
| `database\seeders\SettingSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\SubscriptionSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\TagSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\ThemeSeeder.php` | **95** | ✅ Safe - Production Ready |
| `database\seeders\TicketSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\TransactionLineSeeder.php` | **95** | ✅ Elite - Factory Based |
| `database\seeders\TypeSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\UserSeeder.php` | **95** | ✅ Elite - Safe Credentials |
| `database\seeders\WalletSeeder.php` | **100** | ✅ Elite - Production Ready |
| `database\seeders\WithdrawalSeeder.php` | **95** | ✅ Elite - Factory Based |

## Factories

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `database\factories\AutoInquiryFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\EventBookingFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\EventOccurrenceFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\EventTicketTypeFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\OrderFactory.php` | **60** | 🟠 Warning - RAND() Query Risk |
| `database\factories\ProductAddonFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\ProductFactory.php` | **95** | ✅ Elite - Optimized Relationships |
| `database\factories\ProductMetricFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\ProductSpecificationFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\PropertyAddonFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\PropertyBookingFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\PropertyFeeFactory.php` | **85** | ✅ Safe - Production Ready |
| `database\factories\PropertyNeighborhoodFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\PropertyScoreFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\PropertyVisitFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\ReviewFactory.php` | **95** | ✅ Elite - Polymorphic Ready |
| `database\factories\SeasonalPriceFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\SubscriptionFactory.php` | **85** | ✅ Safe - Production Ready |
| `database\factories\TicketFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\TransactionLineFactory.php` | **90** | ✅ Safe - Production Ready |
| `database\factories\UserFactory.php` | **85** | ✅ Safe - Production Ready |
| `database\factories\WithdrawalFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\JobListingFactory.php` | **100** | ✅ Elite - Relationships Validated |
| `database\factories\AutoFactory.php` | **100** | ✅ Elite - ENUM Validated |
| `database\factories\PropertyFactory.php` | **100** | ✅ Elite - Pricing Validated |
| `database\factories\ServiceFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\ClassifiedFactory.php` | **100** | ✅ Elite - Production Ready |
| `database\factories\EventFactory.php` | **100** | ✅ Elite - Production Ready |
