# Admin Page Test Matrix

Auto-generated inventory for admin dashboard E2E testing.

Regenerate: `php tests/generate_admin_matrix.php`

Source files:
- `apps/backend/routes/admin.php`
- `apps/backend/app/Http/Controllers/Admin/`
- `apps/backend/resources/views/admin/`

## Summary

| Metric | Count |
|---|---:|
| GET admin routes | 218 |
| Areas | 21 |

## Test Levels (per route)

1. **smoke** — page loads (200, no exception text, layout renders)
2. **list/filter/pagination** — index pages show seeded rows
3. **create/edit CRUD** — form submit + database assertion
4. **relationship** — parent/child/pivot tables (Phase 5)
5. **permissions** — role-gated access (Phase 8)

## Route Matrix By Area

### Autos

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/autos` | `admin.autos.index` | AutoController@index | `admin/autos/index.blade.php` | autos | Auto | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-auto, module:autos |
| `/admin/autos/create` | `admin.autos.create` | AutoController@create | `admin/autos/form.blade.php` | autos | Auto | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-auto, module:autos |
| `/admin/autos/{auto}` | `admin.autos.show` | AutoController@show | `admin/autos/show.blade.php` | autos | Auto | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-auto, module:autos |
| `/admin/autos/{auto}/duplicate` | `admin.autos.duplicate` | AutoController@duplicate | `admin/autos/duplicate.blade.php` | autos | Auto | smoke | web, auth, role:admin|super-admin|moderator, can:manage-auto |
| `/admin/autos/{auto}/edit` | `admin.autos.edit` | AutoController@edit | `admin/autos/form.blade.php` | autos | Auto | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-auto, module:autos |

### Bookings

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/auto-inquiries` | `admin.auto-inquiries.index` | AutoInquiryController@index | `admin/auto-inquiries/index.blade.php` | auto_inquiries | AutoInquiry | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:autos, can:manage-auto |
| `/admin/auto-inquiries/create` | `admin.auto-inquiries.create` | AutoInquiryController@create | `admin/auto-inquiries/form.blade.php` | auto_inquiries | AutoInquiry | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:autos, can:manage-auto |
| `/admin/auto-inquiries/{auto_inquiry}` | `admin.auto-inquiries.show` | AutoInquiryController@show | `admin/auto-inquiries/show.blade.php` | auto_inquiries | AutoInquiry | smoke, read | web, auth, role:admin|super-admin|moderator, module:autos, can:manage-auto |
| `/admin/auto-inquiries/{auto_inquiry}/edit` | `admin.auto-inquiries.edit` | AutoInquiryController@edit | `admin/auto-inquiries/form.blade.php` | auto_inquiries | AutoInquiry | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:autos, can:manage-auto |
| `/admin/bookings/autos/{status?}` | `admin.bookings.autos` | AutoInquiryController@index | `admin/bookings/index.blade.php` | auto_inquiries | AutoInquiry | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:autos, can:manage-auto |
| `/admin/bookings/classifieds/{status?}` | `admin.bookings.classifieds` | ClassifiedInquiryController@index | `admin/bookings/index.blade.php` | classified_inquiries | ClassifiedInquiry | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:classifieds, can:manage-classified |
| `/admin/bookings/events/{status?}` | `admin.bookings.events` | EventBookingController@index | `admin/bookings/index.blade.php` | event_bookings | EventBooking | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:events, can:manage-event |
| `/admin/bookings/jobs/{status?}` | `admin.bookings.jobs` | JobApplicationController@index | `admin/bookings/index.blade.php` | job_applications | JobApplication | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:jobs, can:manage-job |
| `/admin/bookings/properties/{status?}` | `admin.bookings.properties` | PropertyBookingController@index | `admin/bookings/index.blade.php` | property_bookings | PropertyBooking | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:properties, can:manage-property |
| `/admin/bookings/services/{status?}` | `admin.bookings.services` | ServiceQuoteController@index | `admin/bookings/index.blade.php` | service_quotes | ServiceQuote | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/bookings/show/{type}/{id}` | `admin.bookings.show` | BookingController@show | `admin/bookings/show.blade.php` | bookings (polymorphic) | Booking | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/bookings/{status?}` | `admin.bookings.index` | BookingController@index | `admin/bookings/index.blade.php` | bookings (polymorphic) | Booking | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/classified-inquiries` | `admin.classified-inquiries.index` | ClassifiedInquiryController@index | `admin/classified-inquiries/index.blade.php` | classified_inquiries | ClassifiedInquiry | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:classifieds, can:manage-classified |
| `/admin/classified-inquiries/create` | `admin.classified-inquiries.create` | ClassifiedInquiryController@create | `admin/classified-inquiries/form.blade.php` | classified_inquiries | ClassifiedInquiry | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:classifieds, can:manage-classified |
| `/admin/classified-inquiries/{classified_inquiry}` | `admin.classified-inquiries.show` | ClassifiedInquiryController@show | `admin/classified-inquiries/show.blade.php` | classified_inquiries | ClassifiedInquiry | smoke, read | web, auth, role:admin|super-admin|moderator, module:classifieds, can:manage-classified |
| `/admin/classified-inquiries/{classified_inquiry}/edit` | `admin.classified-inquiries.edit` | ClassifiedInquiryController@edit | `admin/classified-inquiries/form.blade.php` | classified_inquiries | ClassifiedInquiry | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:classifieds, can:manage-classified |
| `/admin/event-bookings` | `admin.event-bookings.index` | EventBookingController@index | `admin/event-bookings/index.blade.php` | event_bookings | EventBooking | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:events, can:manage-event |
| `/admin/event-bookings/create` | `admin.event-bookings.create` | EventBookingController@create | `admin/event-bookings/form.blade.php` | event_bookings | EventBooking | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:events, can:manage-event |
| `/admin/event-bookings/{event_booking}` | `admin.event-bookings.show` | EventBookingController@show | `admin/event-bookings/show.blade.php` | event_bookings | EventBooking | smoke, read | web, auth, role:admin|super-admin|moderator, module:events, can:manage-event |
| `/admin/event-bookings/{event_booking}/edit` | `admin.event-bookings.edit` | EventBookingController@edit | `admin/event-bookings/form.blade.php` | event_bookings | EventBooking | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:events, can:manage-event |
| `/admin/job-applications` | `admin.job-applications.index` | JobApplicationController@index | `admin/job-applications/index.blade.php` | job_applications | JobApplication | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:jobs, can:manage-job |
| `/admin/job-applications/create` | `admin.job-applications.create` | JobApplicationController@create | `admin/job-applications/form.blade.php` | job_applications | JobApplication | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:jobs, can:manage-job |
| `/admin/job-applications/{job_application}` | `admin.job-applications.show` | JobApplicationController@show | `admin/job-applications/show.blade.php` | job_applications | JobApplication | smoke, read | web, auth, role:admin|super-admin|moderator, module:jobs, can:manage-job |
| `/admin/job-applications/{job_application}/edit` | `admin.job-applications.edit` | JobApplicationController@edit | `admin/job-applications/form.blade.php` | job_applications | JobApplication | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:jobs, can:manage-job |
| `/admin/property-bookings` | `admin.property-bookings.index` | PropertyBookingController@index | `admin/property-bookings/index.blade.php` | property_bookings | PropertyBooking | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:properties, can:manage-property |
| `/admin/property-bookings/create` | `admin.property-bookings.create` | PropertyBookingController@create | `admin/property-bookings/form.blade.php` | property_bookings | PropertyBooking | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:properties, can:manage-property |
| `/admin/property-bookings/{property_booking}` | `admin.property-bookings.show` | PropertyBookingController@show | `admin/property-bookings/show.blade.php` | property_bookings | PropertyBooking | smoke, read | web, auth, role:admin|super-admin|moderator, module:properties, can:manage-property |
| `/admin/property-bookings/{property_booking}/edit` | `admin.property-bookings.edit` | PropertyBookingController@edit | `admin/property-bookings/form.blade.php` | property_bookings | PropertyBooking | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:properties, can:manage-property |
| `/admin/service-appointments` | `admin.service-appointments.index` | ServiceAppointmentController@index | `admin/service-appointments/index.blade.php` | service_appointments | ServiceAppointment | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-appointments/create` | `admin.service-appointments.create` | ServiceAppointmentController@create | `admin/service-appointments/form.blade.php` | service_appointments | ServiceAppointment | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-appointments/{service_appointment}` | `admin.service-appointments.show` | ServiceAppointmentController@show | `admin/service-appointments/show.blade.php` | service_appointments | ServiceAppointment | smoke, read | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-appointments/{service_appointment}/edit` | `admin.service-appointments.edit` | ServiceAppointmentController@edit | `admin/service-appointments/form.blade.php` | service_appointments | ServiceAppointment | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-quotes` | `admin.service-quotes.index` | ServiceQuoteController@index | `admin/service-quotes/index.blade.php` | service_quotes | ServiceQuote | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-quotes/create` | `admin.service-quotes.create` | ServiceQuoteController@create | `admin/service-quotes/form.blade.php` | service_quotes | ServiceQuote | smoke, create-form | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-quotes/{service_quote}` | `admin.service-quotes.show` | ServiceQuoteController@show | `admin/service-quotes/show.blade.php` | service_quotes | ServiceQuote | smoke, read | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |
| `/admin/service-quotes/{service_quote}/edit` | `admin.service-quotes.edit` | ServiceQuoteController@edit | `admin/service-quotes/form.blade.php` | service_quotes | ServiceQuote | smoke, edit-form | web, auth, role:admin|super-admin|moderator, module:services, can:manage-service |

### CMS

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/advertisements` | `admin.advertisements.index` | AdvertisementController@index | `admin/advertisements/index.blade.php` | advertisements | Advertisement | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/advertisements/create` | `admin.advertisements.create` | AdvertisementController@create | `admin/advertisements/form.blade.php` | advertisements | Advertisement | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/advertisements/{advertisement}` | `admin.advertisements.show` | AdvertisementController@show | `admin/advertisements/show.blade.php` | advertisements | Advertisement | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/advertisements/{advertisement}/edit` | `admin.advertisements.edit` | AdvertisementController@edit | `admin/advertisements/form.blade.php` | advertisements | Advertisement | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/blogs` | `admin.blogs.index` | BlogController@index | `admin/blogs/index.blade.php` | blogs | Blog | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-blog |
| `/admin/blogs/create` | `admin.blogs.create` | BlogController@create | `admin/blogs/form.blade.php` | blogs | Blog | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-blog |
| `/admin/blogs/pending` | `admin.blogs.pending` | BlogController@pending | `admin/blogs/pending.blade.php` | blogs | Blog | smoke | web, auth, role:admin|super-admin|moderator, can:manage-blog |
| `/admin/blogs/{blog}` | `admin.blogs.show` | BlogController@show | `admin/blogs/show.blade.php` | blogs | Blog | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-blog |
| `/admin/blogs/{blog}/edit` | `admin.blogs.edit` | BlogController@edit | `admin/blogs/form.blade.php` | blogs | Blog | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-blog |
| `/admin/content` | `admin.content.index` | ContentController@index | `admin/content/index.blade.php` | page_contents | PageContent | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/content/edit/item/{id}` | `admin.content.edit.item` | ContentController@editItem | `admin/content/editItem.blade.php` | page_contents | PageContent | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/content/{page}/{theme_key?}` | `admin.content.edit` | ContentController@editPage | `admin/content/editPage.blade.php` | page_contents | PageContent | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/email-templates` | `admin.email-templates.index` | EmailTemplateController@index | `admin/email-templates/index.blade.php` | email_templates | EmailTemplate | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/email-templates/{email_template}` | `admin.email-templates.show` | EmailTemplateController@show | `admin/email-templates/show.blade.php` | email_templates | EmailTemplate | smoke, read | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/email-templates/{email_template}/edit` | `admin.email-templates.edit` | EmailTemplateController@edit | `admin/email-templates/form.blade.php` | email_templates | EmailTemplate | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/gallery` | `admin.gallery.index` | GalleryController@index | `admin/gallery/index.blade.php` | media | Media | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/menu/{menu}/edit` | `admin.menu.edit` | MenuController@edit | `admin/menu/form.blade.php` | menus, menu_items | Menu | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-menus |
| `/admin/menu/{theme?}` | `admin.menu.index` | MenuController@index | `admin/menu/index.blade.php` | menus, menu_items | Menu | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-menus |
| `/admin/page-builder/{page}` | `admin.page-builder.edit` | PageBuilderController@edit | `admin/page-builder/form.blade.php` | pages, page_contents | Page | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/pages` | `admin.pages.index` | PageController@index | `admin/pages/index.blade.php` | pages | Page | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/pages/create` | `admin.pages.create` | PageController@create | `admin/pages/form.blade.php` | pages | Page | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/pages/type/{type}` | `admin.pages.index.type` | PageController@index | `admin/pages/index.blade.php` | pages | Page | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/pages/{page}` | `admin.pages.show` | PageController@show | `admin/pages/show.blade.php` | pages | Page | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/pages/{page}/edit` | `admin.pages.edit` | PageController@edit | `admin/pages/form.blade.php` | pages | Page | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-pages |
| `/admin/testimonials` | `admin.testimonials.index` | TestimonialController@index | `admin/testimonials/index.blade.php` | testimonials | Testimonial | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-marketing |
| `/admin/testimonials/create` | `admin.testimonials.create` | TestimonialController@create | `admin/testimonials/form.blade.php` | testimonials | Testimonial | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-marketing |
| `/admin/testimonials/{testimonial}/edit` | `admin.testimonials.edit` | TestimonialController@edit | `admin/testimonials/form.blade.php` | testimonials | Testimonial | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-marketing |
| `/admin/themes` | `admin.themes.index` | ThemeController@index | `admin/themes/index.blade.php` | themes | Theme | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-themes |
| `/admin/themes/{theme}/edit` | `admin.themes.edit` | ThemeController@edit | `admin/themes/form.blade.php` | themes | Theme | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-themes |

### Classifieds

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/classifieds` | `admin.classifieds.index` | ClassifiedController@index | `admin/classifieds/index.blade.php` | classified_ads | Classified | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-classified, module:classifieds |
| `/admin/classifieds/create` | `admin.classifieds.create` | ClassifiedController@create | `admin/classifieds/form.blade.php` | classified_ads | Classified | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-classified, module:classifieds |
| `/admin/classifieds/{classified}` | `admin.classifieds.show` | ClassifiedController@show | `admin/classifieds/show.blade.php` | classified_ads | Classified | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-classified, module:classifieds |
| `/admin/classifieds/{classified}/duplicate` | `admin.classifieds.duplicate` | ClassifiedController@duplicate | `admin/classifieds/duplicate.blade.php` | classified_ads | Classified | smoke | web, auth, role:admin|super-admin|moderator, can:manage-classified |
| `/admin/classifieds/{classified}/edit` | `admin.classifieds.edit` | ClassifiedController@edit | `admin/classifieds/form.blade.php` | classified_ads | Classified | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-classified, module:classifieds |

### Dashboard

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/dashboard/ecommerce` | `admin.dashboard.ecommerce` | DashboardController@ecommerceIndex | `admin/dashboard/ecommerce.blade.php` | — (aggregates) | — | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/notifications` | `admin.notifications` | NotificationController@index | `admin/notifications/index.blade.php` | notifications | DatabaseNotification | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/welcome` | `admin.welcome` | DashboardController@index | `admin/welcome/index.blade.php` | — (aggregates) | — | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |

### Events

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/events` | `admin.events.index` | EventController@index | `admin/events/index.blade.php` | events | Event | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-event, module:events |
| `/admin/events/create` | `admin.events.create` | EventController@create | `admin/events/form.blade.php` | events | Event | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-event, module:events |
| `/admin/events/{event}` | `admin.events.show` | EventController@show | `admin/events/show.blade.php` | events | Event | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-event, module:events |
| `/admin/events/{event}/duplicate` | `admin.events.duplicate` | EventController@duplicate | `admin/events/duplicate.blade.php` | events | Event | smoke | web, auth, role:admin|super-admin|moderator, can:manage-event |
| `/admin/events/{event}/edit` | `admin.events.edit` | EventController@edit | `admin/events/form.blade.php` | events | Event | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-event, module:events |

### Finance

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/withdrawals` | `admin.withdrawals.index` | WithdrawalController@index | `admin/withdrawals/index.blade.php` | withdrawals | Withdrawal | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-withdrawals |
| `/admin/withdrawals/failed` | `admin.withdrawals.failed` | WithdrawalController@failed | `admin/withdrawals/failed.blade.php` | withdrawals | Withdrawal | smoke | web, auth, role:admin|super-admin|moderator, can:manage-withdrawals |
| `/admin/withdrawals/pending` | `admin.withdrawals.pending` | WithdrawalController@pending | `admin/withdrawals/pending.blade.php` | withdrawals | Withdrawal | smoke | web, auth, role:admin|super-admin|moderator, can:manage-withdrawals |

### Jobs

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/jobs` | `admin.jobs.index` | JobController@index | `admin/jobs/index.blade.php` | joblistings | JobListing | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-job, module:jobs |
| `/admin/jobs/create` | `admin.jobs.create` | JobController@create | `admin/jobs/form.blade.php` | joblistings | JobListing | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-job, module:jobs |
| `/admin/jobs/{job}` | `admin.jobs.show` | JobController@show | `admin/jobs/show.blade.php` | joblistings | JobListing | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-job, module:jobs |
| `/admin/jobs/{job}/duplicate` | `admin.jobs.duplicate` | JobController@duplicate | `admin/jobs/duplicate.blade.php` | joblistings | JobListing | smoke | web, auth, role:admin|super-admin|moderator, can:manage-job |
| `/admin/jobs/{job}/edit` | `admin.jobs.edit` | JobController@edit | `admin/jobs/form.blade.php` | joblistings | JobListing | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-job, module:jobs |

### Listings

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/listings/{listing_type}/{listing_id}` | `admin.listings.edit` | ListingController@edit | `admin/listings/form.blade.php` | listings (polymorphic) | Listing | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/listings/{listing_type}/{listing_id}/edit` | `admin.listings.edit.type` | ListingController@edit | `admin/listings/form.blade.php` | listings (polymorphic) | Listing | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/listings/{status?}` | `admin.listings.index` | ListingController@index | `admin/listings/index.blade.php` | listings (polymorphic) | Listing | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |

### Other

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin` | `admin.` | Closure@closure | `—` | — | — | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/mass-ticket-process` | `admin.tickets.bulk-update` | TicketController@bulkUpdate | `admin/mass-ticket-process/bulkUpdate.blade.php` | tickets | Ticket | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/stop-impersonating` | `admin.users.stop-impersonating` | UserController@stopImpersonating | `admin/stop-impersonating/stopImpersonating.blade.php` | users | User | smoke | web, auth, role:admin|super-admin|moderator |

### Payments

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/payment-gateways` | `admin.payment-gateways.index` | PaymentGatewayController@index | `admin/payment-gateways/index.blade.php` | payment_gateways | PaymentGateway | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/payment-gateways/{gateway}/edit` | `admin.payment-gateways.edit` | PaymentGatewayController@edit | `admin/payment-gateways/form.blade.php` | payment_gateways | PaymentGateway | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/payments` | `admin.payments.index` | PaymentController@index | `admin/payments/index.blade.php` | payments | Payment | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/payments/create` | `admin.payments.create` | PaymentController@create | `admin/payments/form.blade.php` | payments | Payment | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/payments/duplicate` | `admin.payments.duplicate` | PaymentController@duplicate | `admin/payments/duplicate.blade.php` | payments | Payment | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/payments/failed` | `admin.payments.failed` | PaymentController@failed | `admin/payments/failed.blade.php` | payments | Payment | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/payments/{payment}` | `admin.payments.show` | PaymentController@show | `admin/payments/show.blade.php` | payments | Payment | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/payments/{payment}/edit` | `admin.payments.edit` | PaymentController@edit | `admin/payments/form.blade.php` | payments | Payment | smoke, edit-form | web, auth, role:admin|super-admin|moderator |

### Products

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/product-orders` | `admin.product-orders.index` | OrderController@index | `admin/product-orders/index.blade.php` | orders | Order | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/product-orders/create` | `admin.product-orders.create` | OrderController@create | `admin/product-orders/form.blade.php` | orders | Order | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/product-orders/{order}` | `admin.product-orders.show` | OrderController@show | `admin/product-orders/show.blade.php` | orders | Order | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/product-orders/{order}/edit` | `admin.product-orders.edit` | OrderController@edit | `admin/product-orders/form.blade.php` | orders | Order | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/products` | `admin.products.index` | ProductController@index | `admin/products/index.blade.php` | products | Product | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/products/create` | `admin.products.create` | ProductController@create | `admin/products/form.blade.php` | products | Product | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/products/{product}` | `admin.products.show` | ProductController@show | `admin/products/show.blade.php` | products | Product | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/products/{product}/duplicate` | `admin.products.duplicate` | ProductController@duplicate | `admin/products/duplicate.blade.php` | products | Product | smoke | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |
| `/admin/products/{product}/edit` | `admin.products.edit` | ProductController@edit | `admin/products/form.blade.php` | products | Product | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-product, module:products |

### Properties

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/properties` | `admin.properties.index` | PropertyController@index | `admin/properties/index.blade.php` | properties | Property | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-property, module:properties |
| `/admin/properties/create` | `admin.properties.create` | PropertyController@create | `admin/properties/form.blade.php` | properties | Property | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-property, module:properties |
| `/admin/properties/{property}` | `admin.properties.show` | PropertyController@show | `admin/properties/show.blade.php` | properties | Property | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-property, module:properties |
| `/admin/properties/{property}/duplicate` | `admin.properties.duplicate` | PropertyController@duplicate | `admin/properties/duplicate.blade.php` | properties | Property | smoke | web, auth, role:admin|super-admin|moderator, can:manage-property |
| `/admin/properties/{property}/edit` | `admin.properties.edit` | PropertyController@edit | `admin/properties/form.blade.php` | properties | Property | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-property, module:properties |

### Reports

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/payments-report` | `admin.payments_report` | ReportController@payments | `admin/payments-report/payments.blade.php` | — (reports) | — | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/reports` | `admin.reports.index` | ReportController@index | `admin/reports/index.blade.php` | — (reports) | — | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:view |
| `/admin/reports/bookings` | `admin.reports.bookings` | ReportController@bookings | `admin/reports/bookings.blade.php` | — (reports) | — | smoke | web, auth, role:admin|super-admin|moderator, can:view |
| `/admin/reports/payments` | `admin.reports.payments` | ReportController@payments | `admin/reports/payments.blade.php` | — (reports) | — | smoke | web, auth, role:admin|super-admin|moderator, can:view |
| `/admin/reports/properties` | `admin.reports.properties` | ReportController@properties | `admin/reports/properties.blade.php` | — (reports) | — | smoke | web, auth, role:admin|super-admin|moderator, can:view |

### Services

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/services` | `admin.services.index` | ServiceController@index | `admin/services/index.blade.php` | services | Service | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-service, module:services |
| `/admin/services/create` | `admin.services.create` | ServiceController@create | `admin/services/form.blade.php` | services | Service | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-service, module:services |
| `/admin/services/{service}` | `admin.services.show` | ServiceController@show | `admin/services/show.blade.php` | services | Service | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-service, module:services |
| `/admin/services/{service}/duplicate` | `admin.services.duplicate` | ServiceController@duplicate | `admin/services/duplicate.blade.php` | services | Service | smoke | web, auth, role:admin|super-admin|moderator, can:manage-service |
| `/admin/services/{service}/edit` | `admin.services.edit` | ServiceController@edit | `admin/services/form.blade.php` | services | Service | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-service, module:services |

### Subscriptions

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/plans` | `admin.plans.index` | PlanController@index | `admin/plans/index.blade.php` | plans | Plan | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/plans/create` | `admin.plans.create` | PlanController@create | `admin/plans/form.blade.php` | plans | Plan | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/plans/{plan}` | `admin.plans.show` | PlanController@show | `admin/plans/show.blade.php` | plans | Plan | smoke, read | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/plans/{plan}/duplicate` | `admin.plans.duplicate` | PlanController@duplicate | `admin/plans/duplicate.blade.php` | plans | Plan | smoke | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/plans/{plan}/edit` | `admin.plans.edit` | PlanController@edit | `admin/plans/form.blade.php` | plans | Plan | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscription-quotas` | `admin.subscription-quotas.index` | SubscriptionQuotaController@index | `admin/subscription-quotas/index.blade.php` | subscription_quotas | SubscriptionQuota | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscription-quotas/{subscription_quota}/edit` | `admin.subscription-quotas.edit` | SubscriptionQuotaController@edit | `admin/subscription-quotas/form.blade.php` | subscription_quotas | SubscriptionQuota | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions` | `admin.subscriptions.index` | SubscriptionController@index | `admin/subscriptions/index.blade.php` | subscriptions | Subscription | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions/active` | `admin.subscriptions.active` | SubscriptionController@index | `admin/subscriptions/index.blade.php` | subscriptions | Subscription | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions/create` | `admin.subscriptions.create` | SubscriptionController@create | `admin/subscriptions/form.blade.php` | subscriptions | Subscription | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions/pending` | `admin.subscriptions.pending` | SubscriptionController@index | `admin/subscriptions/index.blade.php` | subscriptions | Subscription | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions/{subscription}` | `admin.subscriptions.show` | SubscriptionController@show | `admin/subscriptions/show.blade.php` | subscriptions | Subscription | smoke, read | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/subscriptions/{subscription}/edit` | `admin.subscriptions.edit` | SubscriptionController@edit | `admin/subscriptions/form.blade.php` | subscriptions | Subscription | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |

### Support

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/newsletter-subscribers` | `admin.newsletter-subscribers.index` | NewsletterSubscriberController@index | `admin/newsletter-subscribers/index.blade.php` | newsletter_subscribers | NewsletterSubscriber | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/newsletter-subscribers/create` | `admin.newsletter-subscribers.create` | NewsletterSubscriberController@create | `admin/newsletter-subscribers/form.blade.php` | newsletter_subscribers | NewsletterSubscriber | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/newsletter-subscribers/export` | `admin.newsletter-subscribers.export` | NewsletterSubscriberController@export | `admin/newsletter-subscribers/export.blade.php` | newsletter_subscribers | NewsletterSubscriber | smoke | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/newsletter-subscribers/{newsletter_subscriber}` | `admin.newsletter-subscribers.show` | NewsletterSubscriberController@show | `admin/newsletter-subscribers/show.blade.php` | newsletter_subscribers | NewsletterSubscriber | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/newsletter-subscribers/{newsletter_subscriber}/edit` | `admin.newsletter-subscribers.edit` | NewsletterSubscriberController@edit | `admin/newsletter-subscribers/form.blade.php` | newsletter_subscribers | NewsletterSubscriber | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/tickets` | `admin.tickets.index` | TicketController@index | `admin/tickets/index.blade.php` | tickets | Ticket | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/tickets/{ticket}` | `admin.tickets.show` | TicketController@show | `admin/tickets/show.blade.php` | tickets | Ticket | smoke, read | web, auth, role:admin|super-admin|moderator |

### System

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/activity-log` | `admin.activity-log.index` | ActivityLogController@index | `admin/activity-log/index.blade.php` | activity_log | Activity | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/languages` | `admin.languages.index` | LanguageController@index | `admin/languages/index.blade.php` | languages | Language | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/languages/create` | `admin.languages.create` | LanguageController@create | `admin/languages/form.blade.php` | languages | Language | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/languages/{language}/edit` | `admin.languages.edit` | LanguageController@edit | `admin/languages/form.blade.php` | languages | Language | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/languages/{language}/translations` | `admin.languages.translations` | LanguageController@translations | `admin/languages/translations.blade.php` | languages | Language | smoke | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/permissions` | `admin.permissions.index` | PermissionController@index | `admin/permissions/index.blade.php` | permissions | Permission | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/permissions/create` | `admin.permissions.create` | PermissionController@create | `admin/permissions/form.blade.php` | permissions | Permission | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/permissions/{permission}` | `admin.permissions.show` | PermissionController@show | `admin/permissions/show.blade.php` | permissions | Permission | smoke, read | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/permissions/{permission}/edit` | `admin.permissions.edit` | PermissionController@edit | `admin/permissions/form.blade.php` | permissions | Permission | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/roles` | `admin.roles.index` | RoleController@index | `admin/roles/index.blade.php` | roles | Role | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/roles/create` | `admin.roles.create` | RoleController@create | `admin/roles/form.blade.php` | roles | Role | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/roles/{role}` | `admin.roles.show` | RoleController@show | `admin/roles/show.blade.php` | roles | Role | smoke, read | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/roles/{role}/edit` | `admin.roles.edit` | RoleController@edit | `admin/roles/form.blade.php` | roles | Role | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/settings` | `admin.settings.index` | SettingController@index | `admin/settings/index.blade.php` | settings | Setting | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/settings/group/{section}` | `admin.settings.group` | SettingController@getSection | `admin/settings/getSection.blade.php` | settings | Setting | smoke | web, auth, role:admin|super-admin|moderator, can:app-settings |
| `/admin/system/maintenance` | `admin.system.maintenance` | SystemController@maintenance | `admin/system/maintenance.blade.php` | — (system) | — | smoke | web, auth, role:admin|super-admin|moderator |
| `/admin/system/status` | `admin.system.status` | SystemController@status | `admin/system/status.blade.php` | — (system) | — | smoke | web, auth, role:admin|super-admin|moderator |

### Taxonomy

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/addons` | `admin.addons.index` | AddonController@index | `admin/addons/index.blade.php` | addons | Addon | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/addons/create` | `admin.addons.create` | AddonController@create | `admin/addons/form.blade.php` | addons | Addon | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/addons/{addon}` | `admin.addons.show` | AddonController@show | `admin/addons/show.blade.php` | addons | Addon | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/addons/{addon}/edit` | `admin.addons.edit` | AddonController@edit | `admin/addons/form.blade.php` | addons | Addon | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/amenities` | `admin.amenities.index` | AmenityController@index | `admin/amenities/index.blade.php` | amenities | Amenity | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/amenities/create` | `admin.amenities.create` | AmenityController@create | `admin/amenities/form.blade.php` | amenities | Amenity | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/amenities/{amenity}` | `admin.amenities.show` | AmenityController@show | `admin/amenities/show.blade.php` | amenities | Amenity | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/amenities/{amenity}/edit` | `admin.amenities.edit` | AmenityController@edit | `admin/amenities/form.blade.php` | amenities | Amenity | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/booking-line-items` | `admin.booking-line-items.index` | BookingLineItemController@index | `admin/booking-line-items/index.blade.php` | booking_line_items | BookingLineItem | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/booking-line-items/create` | `admin.booking-line-items.create` | BookingLineItemController@create | `admin/booking-line-items/form.blade.php` | booking_line_items | BookingLineItem | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/booking-line-items/{booking_line_item}` | `admin.booking-line-items.show` | BookingLineItemController@show | `admin/booking-line-items/show.blade.php` | booking_line_items | BookingLineItem | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/booking-line-items/{booking_line_item}/edit` | `admin.booking-line-items.edit` | BookingLineItemController@edit | `admin/booking-line-items/form.blade.php` | booking_line_items | BookingLineItem | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/brands` | `admin.brands.index` | BrandController@index | `admin/brands/index.blade.php` | brands | Brand | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/brands/create` | `admin.brands.create` | BrandController@create | `admin/brands/form.blade.php` | brands | Brand | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/brands/{brand}` | `admin.brands.show` | BrandController@show | `admin/brands/show.blade.php` | brands | Brand | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/brands/{brand}/edit` | `admin.brands.edit` | BrandController@edit | `admin/brands/form.blade.php` | brands | Brand | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/categories` | `admin.categories.index` | CategoryController@index | `admin/categories/index.blade.php` | categories | Category | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/categories/create` | `admin.categories.create` | CategoryController@create | `admin/categories/form.blade.php` | categories | Category | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/categories/{category}` | `admin.categories.show` | CategoryController@show | `admin/categories/show.blade.php` | categories | Category | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/categories/{category}/edit` | `admin.categories.edit` | CategoryController@edit | `admin/categories/form.blade.php` | categories | Category | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/features` | `admin.features.index` | FeatureController@index | `admin/features/index.blade.php` | features | Feature | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/features/create` | `admin.features.create` | FeatureController@create | `admin/features/form.blade.php` | features | Feature | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/features/{feature}` | `admin.features.show` | FeatureController@show | `admin/features/show.blade.php` | features | Feature | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/features/{feature}/edit` | `admin.features.edit` | FeatureController@edit | `admin/features/form.blade.php` | features | Feature | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/line-items` | `admin.line-items.index` | LineItemController@index | `admin/line-items/index.blade.php` | line_items | LineItem | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/line-items/create` | `admin.line-items.create` | LineItemController@create | `admin/line-items/form.blade.php` | line_items | LineItem | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/line-items/{line_item}` | `admin.line-items.show` | LineItemController@show | `admin/line-items/show.blade.php` | line_items | LineItem | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/line-items/{line_item}/edit` | `admin.line-items.edit` | LineItemController@edit | `admin/line-items/form.blade.php` | line_items | LineItem | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/locations` | `admin.locations.index` | LocationController@index | `admin/locations/index.blade.php` | locations | Location | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/locations/create` | `admin.locations.create` | LocationController@create | `admin/locations/form.blade.php` | locations | Location | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/locations/{location}` | `admin.locations.show` | LocationController@show | `admin/locations/show.blade.php` | locations | Location | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/locations/{location}/edit` | `admin.locations.edit` | LocationController@edit | `admin/locations/form.blade.php` | locations | Location | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/tags` | `admin.tags.index` | TagController@index | `admin/tags/index.blade.php` | tags | Tag | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/tags/create` | `admin.tags.create` | TagController@create | `admin/tags/form.blade.php` | tags | Tag | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/tags/{tag}` | `admin.tags.show` | TagController@show | `admin/tags/show.blade.php` | tags | Tag | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/tags/{tag}/edit` | `admin.tags.edit` | TagController@edit | `admin/tags/form.blade.php` | tags | Tag | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/types` | `admin.types.index` | TypeController@index | `admin/types/index.blade.php` | types | Type | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/types/create` | `admin.types.create` | TypeController@create | `admin/types/form.blade.php` | types | Type | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/types/{type}` | `admin.types.show` | TypeController@show | `admin/types/show.blade.php` | types | Type | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/types/{type}/edit` | `admin.types.edit` | TypeController@edit | `admin/types/form.blade.php` | types | Type | smoke, edit-form | web, auth, role:admin|super-admin|moderator |

### Transactions

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/transactions` | `admin.transactions.index` | TransactionController@index | `admin/transactions/index.blade.php` | transactions | Transaction | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator |
| `/admin/transactions/create` | `admin.transactions.create` | TransactionController@create | `admin/transactions/form.blade.php` | transactions | Transaction | smoke, create-form | web, auth, role:admin|super-admin|moderator |
| `/admin/transactions/{transaction}` | `admin.transactions.show` | TransactionController@show | `admin/transactions/show.blade.php` | transactions | Transaction | smoke, read | web, auth, role:admin|super-admin|moderator |
| `/admin/transactions/{transaction}/edit` | `admin.transactions.edit` | TransactionController@edit | `admin/transactions/form.blade.php` | transactions | Transaction | smoke, edit-form | web, auth, role:admin|super-admin|moderator |

### Users

| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |
|---|---|---|---|---|---|---|---|
| `/admin/profile/edit` | `admin.profile.edit` | ProfileController@edit | `admin/profile/form.blade.php` | users | User | smoke, edit-form | web, auth, role:admin|super-admin|moderator |
| `/admin/users` | `admin.users.index` | UserController@index | `admin/users/index.blade.php` | users | User | smoke, list, filter, pagination | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/buyers` | `admin.users.buyers` | UserController@buyers | `admin/users/buyers.blade.php` | users | User | smoke | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/create` | `admin.users.create` | UserController@create | `admin/users/form.blade.php` | users | User | smoke, create-form | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/partners` | `admin.users.partners` | UserController@partners | `admin/users/partners.blade.php` | users | User | smoke | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/{user}` | `admin.users.show` | UserController@show | `admin/users/show.blade.php` | users | User | smoke, read | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/{user}/edit` | `admin.users.edit` | UserController@edit | `admin/users/form.blade.php` | users | User | smoke, edit-form | web, auth, role:admin|super-admin|moderator, can:manage-users |
| `/admin/users/{user}/impersonate` | `admin.users.impersonate` | UserController@impersonate | `admin/users/impersonate.blade.php` | users | User | smoke | web, auth, role:admin|super-admin|moderator, can:manage-users |

## POST/PUT/DELETE Routes (CRUD follow-up)

These routes are covered in Phase 4 CRUD tests after smoke passes.

| URI | Route Name | Methods | Controller |
|---|---|---|---|
| `/admin/activity-log/clear` | `admin.activity-log.clear` | DELETE | ActivityLogController |
| `/admin/addons` | `admin.addons.store` | POST | AddonController |
| `/admin/addons/{addon}` | `admin.addons.update` | PUT|PATCH | AddonController |
| `/admin/addons/{addon}` | `admin.addons.destroy` | DELETE | AddonController |
| `/admin/advertisements` | `admin.advertisements.store` | POST | AdvertisementController |
| `/admin/advertisements/{advertisement}` | `admin.advertisements.update` | PUT|PATCH | AdvertisementController |
| `/admin/advertisements/{advertisement}` | `admin.advertisements.destroy` | DELETE | AdvertisementController |
| `/admin/amenities` | `admin.amenities.store` | POST | AmenityController |
| `/admin/amenities/{amenity}` | `admin.amenities.update` | PUT|PATCH | AmenityController |
| `/admin/amenities/{amenity}` | `admin.amenities.destroy` | DELETE | AmenityController |
| `/admin/auto-inquiries` | `admin.auto-inquiries.store` | POST | AutoInquiryController |
| `/admin/auto-inquiries/{auto_inquiry}` | `admin.auto-inquiries.update` | PUT|PATCH | AutoInquiryController |
| `/admin/auto-inquiries/{auto_inquiry}` | `admin.auto-inquiries.destroy` | DELETE | AutoInquiryController |
| `/admin/autos` | `admin.autos.store` | POST | AutoController |
| `/admin/autos/{auto}` | `admin.autos.update` | PUT|PATCH | AutoController |
| `/admin/autos/{auto}` | `admin.autos.destroy` | DELETE | AutoController |
| `/admin/autos/{auto}/approve` | `admin.autos.approve` | POST | AutoController |
| `/admin/autos/{auto}/disapprove` | `admin.autos.disapprove` | POST | AutoController |
| `/admin/blogs` | `admin.blogs.store` | POST | BlogController |
| `/admin/blogs/{blog}` | `admin.blogs.update` | PUT|PATCH | BlogController |
| `/admin/blogs/{blog}` | `admin.blogs.destroy` | DELETE | BlogController |
| `/admin/booking-line-items` | `admin.booking-line-items.store` | POST | BookingLineItemController |
| `/admin/booking-line-items/{booking_line_item}` | `admin.booking-line-items.update` | PUT|PATCH | BookingLineItemController |
| `/admin/booking-line-items/{booking_line_item}` | `admin.booking-line-items.destroy` | DELETE | BookingLineItemController |
| `/admin/bookings/destroy/{type}/{id}` | `admin.bookings.destroy` | DELETE | BookingController |
| `/admin/brands` | `admin.brands.store` | POST | BrandController |
| `/admin/brands/{brand}` | `admin.brands.update` | PUT|PATCH | BrandController |
| `/admin/brands/{brand}` | `admin.brands.destroy` | DELETE | BrandController |
| `/admin/categories` | `admin.categories.store` | POST | CategoryController |
| `/admin/categories/{category}` | `admin.categories.update` | PUT|PATCH | CategoryController |
| `/admin/categories/{category}` | `admin.categories.destroy` | DELETE | CategoryController |
| `/admin/classified-inquiries` | `admin.classified-inquiries.store` | POST | ClassifiedInquiryController |
| `/admin/classified-inquiries/{classified_inquiry}` | `admin.classified-inquiries.update` | PUT|PATCH | ClassifiedInquiryController |
| `/admin/classified-inquiries/{classified_inquiry}` | `admin.classified-inquiries.destroy` | DELETE | ClassifiedInquiryController |
| `/admin/classifieds` | `admin.classifieds.store` | POST | ClassifiedController |
| `/admin/classifieds/{classified}` | `admin.classifieds.update` | PUT|PATCH | ClassifiedController |
| `/admin/classifieds/{classified}` | `admin.classifieds.destroy` | DELETE | ClassifiedController |
| `/admin/classifieds/{classified}/approve` | `admin.classifieds.approve` | POST | ClassifiedController |
| `/admin/classifieds/{classified}/disapprove` | `admin.classifieds.disapprove` | POST | ClassifiedController |
| `/admin/content/update` | `admin.content.bulk_update` | POST | ContentController |
| `/admin/email-templates/{email_template}` | `admin.email-templates.update` | PUT|PATCH | EmailTemplateController |
| `/admin/event-bookings` | `admin.event-bookings.store` | POST | EventBookingController |
| `/admin/event-bookings/{event_booking}` | `admin.event-bookings.update` | PUT|PATCH | EventBookingController |
| `/admin/event-bookings/{event_booking}` | `admin.event-bookings.destroy` | DELETE | EventBookingController |
| `/admin/events` | `admin.events.store` | POST | EventController |
| `/admin/events/{event}` | `admin.events.update` | PUT|PATCH | EventController |
| `/admin/events/{event}` | `admin.events.destroy` | DELETE | EventController |
| `/admin/events/{event}/approve` | `admin.events.approve` | POST | EventController |
| `/admin/events/{event}/disapprove` | `admin.events.disapprove` | POST | EventController |
| `/admin/features` | `admin.features.store` | POST | FeatureController |
| `/admin/features/{feature}` | `admin.features.update` | PUT|PATCH | FeatureController |
| `/admin/features/{feature}` | `admin.features.destroy` | DELETE | FeatureController |
| `/admin/gallery` | `admin.gallery.store` | POST | GalleryController |
| `/admin/gallery/{gallery}` | `admin.gallery.update` | PUT|PATCH | GalleryController |
| `/admin/gallery/{gallery}` | `admin.gallery.destroy` | DELETE | GalleryController |
| `/admin/job-applications` | `admin.job-applications.store` | POST | JobApplicationController |
| `/admin/job-applications/{job_application}` | `admin.job-applications.update` | PUT|PATCH | JobApplicationController |
| `/admin/job-applications/{job_application}` | `admin.job-applications.destroy` | DELETE | JobApplicationController |
| `/admin/jobs` | `admin.jobs.store` | POST | JobController |
| `/admin/jobs/{job}` | `admin.jobs.update` | PUT|PATCH | JobController |
| `/admin/jobs/{job}` | `admin.jobs.destroy` | DELETE | JobController |
| `/admin/jobs/{job}/approve` | `admin.jobs.approve` | POST | JobController |
| `/admin/jobs/{job}/disapprove` | `admin.jobs.disapprove` | POST | JobController |
| `/admin/languages` | `admin.languages.store` | POST | LanguageController |
| `/admin/languages/{language}` | `admin.languages.destroy` | DELETE | LanguageController |
| `/admin/languages/{language}/translations` | `admin.languages.translations.update` | POST | LanguageController |
| `/admin/languages/{language}/update` | `admin.languages.update` | POST | LanguageController |
| `/admin/line-items` | `admin.line-items.store` | POST | LineItemController |
| `/admin/line-items/{line_item}` | `admin.line-items.update` | PUT|PATCH | LineItemController |
| `/admin/line-items/{line_item}` | `admin.line-items.destroy` | DELETE | LineItemController |
| `/admin/listings/{listing_type}/{listing_id}` | `admin.listings.destroy` | DELETE | ListingController |
| `/admin/listings/{listing_type}/{listing_id}/approve` | `admin.listings.approve` | POST | ListingController |
| `/admin/listings/{listing_type}/{listing_id}/disapprove` | `admin.listings.disapprove` | POST | ListingController |
| `/admin/locations` | `admin.locations.store` | POST | LocationController |
| `/admin/locations/{location}` | `admin.locations.update` | PUT|PATCH | LocationController |
| `/admin/locations/{location}` | `admin.locations.destroy` | DELETE | LocationController |
| `/admin/mass-ticket-process` | `admin.tickets.bulk-update` | POST|DELETE | TicketController |
| `/admin/menu/items/{item}` | `admin.menu.delete_item` | DELETE | MenuController |
| `/admin/menu/items/{item}` | `admin.menu.update_item` | PUT | MenuController |
| `/admin/menu/{menu}/update` | `admin.menu.update_structure` | POST | MenuController |
| `/admin/newsletter-subscribers` | `admin.newsletter-subscribers.store` | POST | NewsletterSubscriberController |
| `/admin/newsletter-subscribers/{newsletter_subscriber}` | `admin.newsletter-subscribers.update` | PUT|PATCH | NewsletterSubscriberController |
| `/admin/newsletter-subscribers/{newsletter_subscriber}` | `admin.newsletter-subscribers.destroy` | DELETE | NewsletterSubscriberController |
| `/admin/notifications/read-all` | `admin.notifications.readall` | POST | NotificationController |
| `/admin/page-builder/{page}` | `admin.page-builder.update` | POST | PageBuilderController |
| `/admin/pages` | `admin.pages.store` | POST | PageController |
| `/admin/pages/{page}` | `admin.pages.update` | PUT|PATCH | PageController |
| `/admin/pages/{page}` | `admin.pages.destroy` | DELETE | PageController |
| `/admin/payment-gateways/{gateway}` | `admin.payment-gateways.update` | PUT | PaymentGatewayController |
| `/admin/payments` | `admin.payments.store` | POST | PaymentController |
| `/admin/payments/{payment}` | `admin.payments.update` | PUT|PATCH | PaymentController |
| `/admin/payments/{payment}` | `admin.payments.destroy` | DELETE | PaymentController |
| `/admin/permissions` | `admin.permissions.store` | POST | PermissionController |
| `/admin/permissions/{permission}` | `admin.permissions.update` | PUT|PATCH | PermissionController |
| `/admin/permissions/{permission}` | `admin.permissions.destroy` | DELETE | PermissionController |
| `/admin/plans` | `admin.plans.store` | POST | PlanController |
| `/admin/plans/{plan}` | `admin.plans.update` | PUT|PATCH | PlanController |
| `/admin/plans/{plan}` | `admin.plans.destroy` | DELETE | PlanController |
| `/admin/product-orders` | `admin.product-orders.store` | POST | OrderController |
| `/admin/product-orders/bulk-update` | `admin.product-orders.bulk-update` | POST | OrderController |
| `/admin/product-orders/{order}` | `admin.product-orders.update` | PUT | OrderController |
| `/admin/product-orders/{order}/status` | `admin.product-orders.update-status` | POST | OrderController |
| `/admin/products` | `admin.products.store` | POST | ProductController |
| `/admin/products/{product}` | `admin.products.update` | PUT|PATCH | ProductController |
| `/admin/products/{product}` | `admin.products.destroy` | DELETE | ProductController |
| `/admin/profile/update` | `admin.profile.update` | PUT | ProfileController |
| `/admin/properties` | `admin.properties.store` | POST | PropertyController |
| `/admin/properties/{property}` | `admin.properties.update` | PUT|PATCH | PropertyController |
| `/admin/properties/{property}` | `admin.properties.destroy` | DELETE | PropertyController |
| `/admin/properties/{property}/approve` | `admin.properties.approve` | POST | PropertyController |
| `/admin/properties/{property}/disapprove` | `admin.properties.disapprove` | POST | PropertyController |
| `/admin/property-bookings` | `admin.property-bookings.store` | POST | PropertyBookingController |
| `/admin/property-bookings/{property_booking}` | `admin.property-bookings.update` | PUT|PATCH | PropertyBookingController |
| `/admin/property-bookings/{property_booking}` | `admin.property-bookings.destroy` | DELETE | PropertyBookingController |
| `/admin/roles` | `admin.roles.store` | POST | RoleController |
| `/admin/roles/{role}` | `admin.roles.update` | PUT|PATCH | RoleController |
| `/admin/roles/{role}` | `admin.roles.destroy` | DELETE | RoleController |
| `/admin/service-appointments` | `admin.service-appointments.store` | POST | ServiceAppointmentController |
| `/admin/service-appointments/{service_appointment}` | `admin.service-appointments.update` | PUT|PATCH | ServiceAppointmentController |
| `/admin/service-appointments/{service_appointment}` | `admin.service-appointments.destroy` | DELETE | ServiceAppointmentController |
| `/admin/service-quotes` | `admin.service-quotes.store` | POST | ServiceQuoteController |
| `/admin/service-quotes/{service_quote}` | `admin.service-quotes.update` | PUT|PATCH | ServiceQuoteController |
| `/admin/service-quotes/{service_quote}` | `admin.service-quotes.destroy` | DELETE | ServiceQuoteController |
| `/admin/services` | `admin.services.store` | POST | ServiceController |
| `/admin/services/{service}` | `admin.services.update` | PUT|PATCH | ServiceController |
| `/admin/services/{service}` | `admin.services.destroy` | DELETE | ServiceController |
| `/admin/services/{service}/approve` | `admin.services.approve` | POST | ServiceController |
| `/admin/services/{service}/disapprove` | `admin.services.disapprove` | POST | ServiceController |
| `/admin/settings/group/{section}/update` | `admin.settings.update.group` | POST | SettingController |
| `/admin/subscription-quotas/{subscriptionQuota}/reset` | `admin.subscription-quotas.reset` | POST | SubscriptionQuotaController |
| `/admin/subscription-quotas/{subscription_quota}` | `admin.subscription-quotas.update` | PUT|PATCH | SubscriptionQuotaController |
| `/admin/subscriptions` | `admin.subscriptions.store` | POST | SubscriptionController |
| `/admin/subscriptions/{subscription}` | `admin.subscriptions.update` | PUT|PATCH | SubscriptionController |
| `/admin/subscriptions/{subscription}` | `admin.subscriptions.destroy` | DELETE | SubscriptionController |
| `/admin/subscriptions/{subscription}/renew` | `admin.subscriptions.renew` | POST | SubscriptionController |
| `/admin/system/cache/clear` | `admin.system.cache.clear` | POST | SystemController |
| `/admin/system/config/clear` | `admin.system.config.clear` | POST | SystemController |
| `/admin/system/media/regenerate` | `admin.system.media.regenerate` | POST | SystemController |
| `/admin/system/optimize` | `admin.system.optimize` | POST | SystemController |
| `/admin/system/route/clear` | `admin.system.route.clear` | POST | SystemController |
| `/admin/system/storage-link` | `admin.system.storage.link` | POST | SystemController |
| `/admin/system/view/clear` | `admin.system.view.clear` | POST | SystemController |
| `/admin/tags` | `admin.tags.store` | POST | TagController |
| `/admin/tags/{tag}` | `admin.tags.update` | PUT|PATCH | TagController |
| `/admin/tags/{tag}` | `admin.tags.destroy` | DELETE | TagController |
| `/admin/testimonials` | `admin.testimonials.store` | POST | TestimonialController |
| `/admin/testimonials/{testimonial}` | `admin.testimonials.update` | PUT|PATCH | TestimonialController |
| `/admin/testimonials/{testimonial}` | `admin.testimonials.destroy` | DELETE | TestimonialController |
| `/admin/themes/{theme}/activate` | `admin.themes.activate` | POST | ThemeController |
| `/admin/themes/{theme}/update` | `admin.themes.update` | POST | ThemeController |
| `/admin/tickets/{ticket}` | `admin.tickets.destroy` | DELETE | TicketController |
| `/admin/tickets/{ticket}/reply` | `admin.tickets.reply` | POST | TicketController |
| `/admin/tickets/{ticket}/status` | `admin.tickets.status` | POST | TicketController |
| `/admin/transactions` | `admin.transactions.store` | POST | TransactionController |
| `/admin/transactions/{transaction}` | `admin.transactions.update` | PUT|PATCH | TransactionController |
| `/admin/transactions/{transaction}` | `admin.transactions.destroy` | DELETE | TransactionController |
| `/admin/types` | `admin.types.store` | POST | TypeController |
| `/admin/types/{type}` | `admin.types.update` | PUT|PATCH | TypeController |
| `/admin/types/{type}` | `admin.types.destroy` | DELETE | TypeController |
| `/admin/users` | `admin.users.store` | POST | UserController |
| `/admin/users/{user}` | `admin.users.update` | PUT|PATCH | UserController |
| `/admin/users/{user}` | `admin.users.destroy` | DELETE | UserController |
| `/admin/users/{user}/approve` | `admin.users.approve` | POST | UserController |
| `/admin/withdrawals/{withdrawal}/approve` | `admin.withdrawals.approve` | POST | WithdrawalController |
| `/admin/withdrawals/{withdrawal}/reject` | `admin.withdrawals.reject` | POST | WithdrawalController |

## Seeded Admin Credentials (dev/test)

| User | Password | Role |
|---|---|---|
| admin@example.com | admin123 | super-admin (via UserSeeder + RolesAndPermissionsSeeder) |

