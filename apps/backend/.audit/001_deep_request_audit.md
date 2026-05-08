# 🛡️ Deep Audit: Laravel Request Architecture

## Objective
Execute a high-fidelity audit of all Laravel `FormRequest` classes in the Sellio platform to ensure production readiness for CodeCanyon submission.

## Progress
- [x] Initial Registry Setup
- [ ] Core Public Storefront Requests
- [ ] Administrative & Management Requests
- [ ] Partner & Dashboard Requests
- [ ] Authentication & Identity Requests

---

# Audit Status Registry

| File Path | Risk | Auth Safety | Validation Safety | Status |
| :--- | :--- | :--- | :--- | :--- |
| `app\Http\Requests\CalculateLodgingPriceRequest.php` | MEDIUM | 🟠 Unsafe | 🟠 Weak | ✅ Audited |
| `app\Http\Requests\CalculatePriceRequest.php` | MEDIUM | 🟠 Unsafe | 🔴 Weak | ✅ Audited |
| `app\Http\Requests\JobApplicationStoreRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\ProcessPaymentRequest.php` | CRITICAL | 🔴 Missing | 🔴 Weak | ✅ Audited |
| `app\Http\Requests\ProfileUpdateRequest.php` | CRITICAL | 🔴 Missing | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SaveProductRequest.php` | CRITICAL | 🔴 Unsafe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\SearchAutoRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SearchBlogRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SearchProductRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SearchPropertyRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SendContactRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\SendMessageRequest.php` | CRITICAL | 🔴 Unsafe | 🔴 Weak | ✅ Audited |
| `app\Http\Requests\StoreAppointmentRequest.php` | HIGH | ✅ Safe | 🔴 Data Risk | ✅ Audited |
| `app\Http\Requests\StoreAutoInquiryRequest.php` | MEDIUM | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\StoreConsultationRequest.php` | MEDIUM | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\StoreEventBookingRequest.php` | CRITICAL | 🔴 Unsafe | 🔴 Data Risk | ✅ Audited |
| `app\Http\Requests\StorePropertyBookingRequest.php` | CRITICAL | 🔴 Unsafe | 🔴 Data Risk | ✅ Audited |
| `app\Http\Requests\StoreQuoteRequest.php` | MEDIUM | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\StoreReviewRequest.php` | MEDIUM | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\UpdateBookingDetailsRequest.php` | HIGH | 🔴 Unsafe | ✅ Safe | ✅ Audited |

## Administrative & Management Requests

| File Path | Risk | Auth Safety | Validation Safety | Status |
| :--- | :--- | :--- | :--- | :--- |
| `app\Http\Requests\Admin\AdvertisementRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\AmenityRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\AutoRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\BrandRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\CategoryRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\ClassifiedRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\EventRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\FeatureRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\JobListingRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\LocationRequest.php" | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\ProductRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\PropertyRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\ServiceRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\TagRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\TypeRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\UserStoreRequest.php` | LOW | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Admin\Tickets\ReplyTicketRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |

## Partner & Dashboard Requests

| File Path | Risk | Auth Safety | Validation Safety | Status |
| :--- | :--- | :--- | :--- | :--- |
| `app\Http\Requests\Dashboard\User\UpdateProfileRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Dashboard\User\UpdateReviewRequest.php` | HIGH | 🔴 Unsafe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Partner\AutoRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\ClassifiedRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\EventRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\JobListingRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\ProcessWithdrawalRequest.php` | CRITICAL | 🔴 IDOR Risk | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Partner\ProfileUpdateRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Partner\ServiceRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\StorePropertyRequest.php` | MEDIUM | ✅ Safe | 🟠 Moderate | ✅ Audited |
| `app\Http\Requests\Partner\StoreSubscriptionRequest.php" | CRITICAL | 🔴 Unsafe | 🔴 Weak | ✅ Audited |
| `app\Http\Requests\Partner\UpdatePropertyRequest.php` | CRITICAL | 🔴 IDOR Risk | 🟠 Moderate | ✅ Audited |

## Authentication & Identity Requests

| File Path | Risk | Auth Safety | Validation Safety | Status |
| :--- | :--- | :--- | :--- | :--- |
| `app\Http\Requests\Auth\LoginRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Auth\RegisterRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Auth\ResetPasswordRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Auth\SendResetLinkEmailRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Auth\UpdatePasswordRequest.php" | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Auth\UpdateProfileRequest.php" | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Api\Tickets\ReplyTicketRequest.php` | LOW | ✅ Safe | ✅ Safe | ✅ Audited |
| `app\Http\Requests\Api\Tickets\StoreTicketRequest.php` | MEDIUM | ✅ Safe | 🟠 Priority Risk | ✅ Audited |


# Overall Requests Audit Summary

## Security Score: 3/10
🔴 **CRITICAL FAILURE**: Systematic IDOR (Insecure Direct Object Reference) vulnerabilities found across the Partner request layer. Most `authorize()` methods only check `Auth::check()`, allowing any authenticated user to potentially modify resources they do not own by spoofing IDs in the request or route.

## Validation Quality Score: 6/10
🟠 **MODERATE**: Uniqueness and standard string validation are well-handled. However, complex objects (Cars, Properties) rely on weak string validation for domain-critical fields (Transmission, Condition, etc.), and multi-module booleans lack aggregate integrity.

## Authorization Safety Score: 2/10
🔴 **CRITICAL FAILURE**: The delegation of ownership checks to controllers is a major architectural debt. FormRequests are being used purely for field validation, bypassing their primary purpose as a security gate.

## Data Integrity Score: 5/10
🟠 **MODERATE**: Missing relationship validation in booking requests (e.g., checking if a selected package actually belongs to the selected service) risks corrupted ledger entries and pricing fraud.

## Multi-Tenant Safety Score: 1/10
🔴 **CRITICAL FAILURE**: Total lack of tenant/partner isolation logic in the request layer.

## CodeCanyon Readiness: NOT READY
🔴 **Status**: The platform is highly vulnerable to data breaches and unauthorized modifications in its current state.

## Most Dangerous Requests
- `app\Http\Requests\Partner\AutoRequest.php` (IDOR)
- `app\Http\Requests\Partner\UpdatePropertyRequest.php` (IDOR)
- `app\Http\Requests\Partner\ServiceRequest.php` (IDOR)
- `app\Http\Requests\Partner\ProcessWithdrawalRequest.php` (Financial/IDOR)
- `app\Http\Requests\StoreEventBookingRequest.php` (Public IDOR)

## Weak Validation Patterns
- **Floating IDs**: Passing `service_package_id` without validating its relationship to `service_id`.
- **String Blobs**: Using `string` for fields that should be `in:枚举`.
- **Missing Dates**: Calculating prices for past dates allowed in `CalculateLodgingPriceRequest`.

## Suggested Architecture Improvements
1. **Mandatory Ownership Checks**: All update/delete `FormRequest` classes MUST use `$this->route('model')->user_id === Auth::id()` in `authorize()`.
2. **Custom Rule Objects**: Implement `BelongsToPartner` and `ValidTemporalRange` rules.
3. **Password Hardening**: Shift to `Password::min(8)->letters()->numbers()->symbols()` for all registration/updates.

## Estimated Reviewer Outcome: LIKELY REJECTED
*Reason: Critical Security (IDOR) and Multi-tenant data leakage risks.*
