# API Data Transformation Audit

## 🚨 Non-Resource Returns (Controllers)
- **ApiAmenityController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new AmenityResource($amenity));
  ```
- **ApiAutoController.php** (Line 54): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiAutoController.php** (Line 69): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiBlogController.php** (Line 50): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiBlogController.php** (Line 63): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new SearchBlogRequest(['category' => $categorySlug]));
  ```
- **ApiBrandController.php** (Line 45): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiCategoryController.php** (Line 31): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(CategoryResource::collection($categories));
  ```
- **ApiCategoryController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiClassifiedController.php** (Line 55): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiClassifiedController.php** (Line 71): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiEventController.php** (Line 62): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiEventController.php** (Line 77): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiFeatureController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new FeatureResource($feature));
  ```
- **ApiJobController.php** (Line 57): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiJobController.php** (Line 72): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiLocationController.php** (Line 46): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiProductController.php** (Line 52): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiProductController.php** (Line 71): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiProductController.php** (Line 87): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiProductController.php** (Line 107): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->productService->calculateSelectionPrice(
  ```
- **ApiProductController.php** (Line 117): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiProductController.php** (Line 165): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiPropertyController.php** (Line 58): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiPropertyController.php** (Line 85): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($calculation);
  ```
- **ApiPropertyController.php** (Line 93): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiServiceController.php** (Line 56): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **ApiServiceController.php** (Line 76): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **ApiTagController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new TagResource($tag));
  ```
- **ApiTypeController.php** (Line 38): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Auth\AuthController.php** (Line 31): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Auth\AuthController.php** (Line 51): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Logged out successfully');
  ```
- **Auth\AuthController.php** (Line 54): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('Already logged out or session expired', 401);
  ```
- **Auth\AuthController.php** (Line 67): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Auth\AuthController.php** (Line 97): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Auth\PasswordResetController.php** (Line 22): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __($status));
  ```
- **Auth\PasswordResetController.php** (Line 24): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse(__($status), 422);
  ```
- **Auth\PasswordResetController.php** (Line 49): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __($status));
  ```
- **Auth\PasswordResetController.php** (Line 51): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse(__($status), 422);
  ```
- **Auth\ProfileController.php** (Line 15): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Auth\ProfileController.php** (Line 42): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Auth\ProfileController.php** (Line 64): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'The provided current password does not match our records.', 422);
  ```
- **Auth\ProfileController.php** (Line 71): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Password updated successfully'
  ```
- **Dashboard\Partner\ActivityController.php** (Line 340): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\AnalyticsController.php** (Line 79): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact(
  ```
- **Dashboard\Partner\AnalyticsController.php** (Line 79): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact(
  ```
- **Dashboard\Partner\AutoController.php** (Line 39): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(AutoResource::collection($autos));
  ```
- **Dashboard\Partner\AutoController.php** (Line 43): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->getFormData());
  ```
- **Dashboard\Partner\AutoController.php** (Line 51): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle listing created successfully.'),
  ```
- **Dashboard\Partner\AutoController.php** (Line 55): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle listing created successfully.'));
  ```
- **Dashboard\Partner\AutoController.php** (Line 62): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Success');
  ```
- **Dashboard\Partner\AutoController.php** (Line 71): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle updated successfully.'),
  ```
- **Dashboard\Partner\AutoController.php** (Line 76): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle updated successfully.'));
  ```
- **Dashboard\Partner\AutoController.php** (Line 85): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle deleted successfully.')
  ```
- **Dashboard\Partner\AutoController.php** (Line 89): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Vehicle deleted successfully.'));
  ```
- **Dashboard\Partner\AutoInquiryController.php** (Line 52): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(AutoInquiryResource::collection($autoInquiries));
  ```
- **Dashboard\Partner\AutoInquiryController.php** (Line 64): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\AutoInquiryController.php** (Line 80): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Inquiry marked as read.'));
  ```
- **Dashboard\Partner\AutoInquiryController.php** (Line 94): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Inquiry deleted successfully.'));
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 49): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(ClassifiedResource::collection($classifieds));
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 58): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->getFormData());
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 75): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 82): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Classified created successfully! Now complete the remaining details.'));
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 94): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 94): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 118): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 124): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Classified updated successfully.'));
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 140): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Classified deleted successfully.')
  ```
- **Dashboard\Partner\ClassifiedController.php** (Line 144): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Classified deleted successfully.'));
  ```
- **Dashboard\Partner\ClassifiedInquiryController.php** (Line 24): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(ClassifiedInquiryResource::collection($classifiedInquiries));
  ```
- **Dashboard\Partner\DashboardController.php** (Line 42): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\DashboardController.php** (Line 42): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\EventBookingController.php** (Line 39): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(EventBookingResource::collection($eventBookings));
  ```
- **Dashboard\Partner\EventBookingController.php** (Line 56): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new EventBookingResource($booking));
  ```
- **Dashboard\Partner\EventController.php** (Line 48): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(EventResource::collection($events));
  ```
- **Dashboard\Partner\EventController.php** (Line 57): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Success');
  ```
- **Dashboard\Partner\EventController.php** (Line 71): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\EventController.php** (Line 78): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Event ":title" created and schedule/tickets configured.', ['title' => $event->title]));
  ```
- **Dashboard\Partner\EventController.php** (Line 95): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact('event'));
  ```
- **Dashboard\Partner\EventController.php** (Line 95): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact('event'));
  ```
- **Dashboard\Partner\EventController.php** (Line 108): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact('event'));
  ```
- **Dashboard\Partner\EventController.php** (Line 108): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact('event'));
  ```
- **Dashboard\Partner\EventController.php** (Line 124): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\EventController.php** (Line 130): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Event ":title" updated successfully!', ['title' => $event->title]));
  ```
- **Dashboard\Partner\EventController.php** (Line 146): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Event ":title" deleted successfully.', ['title' => $title]));
  ```
- **Dashboard\Partner\EventController.php** (Line 149): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Event ":title" deleted successfully.', ['title' => $title]));
  ```
- **Dashboard\Partner\EventController.php** (Line 164): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('Invalid ticket data', 400);
  ```
- **Dashboard\Partner\EventController.php** (Line 167): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\JobApplicationController.php** (Line 65): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\JobApplicationController.php** (Line 83): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Application status updated to :status.', ['status' => ucfirst($status)]));
  ```
- **Dashboard\Partner\JobApplicationController.php** (Line 97): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Job application deleted successfully.'));
  ```
- **Dashboard\Partner\JobListingController.php** (Line 50): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(JobListingResource::collection($jobs));
  ```
- **Dashboard\Partner\JobListingController.php** (Line 59): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->getFormData());
  ```
- **Dashboard\Partner\JobListingController.php** (Line 73): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\JobListingController.php** (Line 80): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Job created successfully!'));
  ```
- **Dashboard\Partner\JobListingController.php** (Line 94): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Success');
  ```
- **Dashboard\Partner\JobListingController.php** (Line 111): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\JobListingController.php** (Line 117): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Job updated successfully!'));
  ```
- **Dashboard\Partner\JobListingController.php** (Line 132): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Job deleted successfully.')
  ```
- **Dashboard\Partner\JobListingController.php** (Line 136): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Job deleted successfully.'));
  ```
- **Dashboard\Partner\MessageController.php** (Line 23): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\MessageController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\MessageController.php** (Line 78): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, $message, 201);
  ```
- **Dashboard\Partner\MessageController.php** (Line 81): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Message sent successfully.');
  ```
- **Dashboard\Partner\PaymentController.php** (Line 21): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(PaymentResource::collection($payments));
  ```
- **Dashboard\Partner\PlanController.php** (Line 18): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(PlanResource::collection($plans));
  ```
- **Dashboard\Partner\PlanController.php** (Line 23): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new PlanResource($plan));
  ```
- **Dashboard\Partner\ProductController.php** (Line 28): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ProductController.php** (Line 56): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ProductController.php** (Line 74): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ProductController.php** (Line 89): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ProductController.php** (Line 108): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->productService->calculateSelectionPrice(
  ```
- **Dashboard\Partner\ProductController.php** (Line 118): `Returns raw variable or compact pack directly`
  ```php
return $this->index(new Request(['category' => $categorySlug]));
  ```
- **Dashboard\Partner\ProductController.php** (Line 165): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Product and associated assets deleted successfully')
  ```
- **Dashboard\Partner\ProfileController.php** (Line 31): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\ProfileController.php** (Line 51): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Profile and business settings updated successfully.'));
  ```
- **Dashboard\Partner\ProfileController.php** (Line 72): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Your account has been successfully removed.'));
  ```
- **Dashboard\Partner\PropertyBookingController.php** (Line 62): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\PropertyBookingController.php** (Line 80): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Booking status updated successfully.'));
  ```
- **Dashboard\Partner\PropertyController.php** (Line 44): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('You have reached your listing limit. Please upgrade your plan.'), 403);
  ```
- **Dashboard\Partner\PropertyController.php** (Line 62): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\PropertyController.php** (Line 77): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new PropertyResource($property));
  ```
- **Dashboard\Partner\PropertyController.php** (Line 92): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Featured limit reached.'), 422);
  ```
- **Dashboard\Partner\PropertyController.php** (Line 101): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\PropertyController.php** (Line 116): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Property deleted successfully.')
  ```
- **Dashboard\Partner\PropertyVisitController.php** (Line 43): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(PropertyVisitResource::collection($propertyVisits));
  ```
- **Dashboard\Partner\PropertyVisitController.php** (Line 65): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new PropertyVisitResource($propertyVisit));
  ```
- **Dashboard\Partner\ReviewController.php** (Line 55): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new ReviewResource($review->load(['user', 'reviewable'])));
  ```
- **Dashboard\Partner\ServiceAppointmentController.php** (Line 65): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\ServiceAppointmentController.php** (Line 83): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Appointment status updated to :status.', ['status' => $status]));
  ```
- **Dashboard\Partner\ServiceAppointmentController.php** (Line 97): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Appointment record deleted successfully.'));
  ```
- **Dashboard\Partner\ServiceController.php** (Line 49): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(ServiceResource::collection($services));
  ```
- **Dashboard\Partner\ServiceController.php** (Line 58): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse($this->getFormData());
  ```
- **Dashboard\Partner\ServiceController.php** (Line 72): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ServiceController.php** (Line 79): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Service created successfully! Now complete the remaining details.'));
  ```
- **Dashboard\Partner\ServiceController.php** (Line 91): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\ServiceController.php** (Line 91): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(array_merge(
  ```
- **Dashboard\Partner\ServiceController.php** (Line 111): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\Partner\ServiceController.php** (Line 117): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Service updated successfully.'));
  ```
- **Dashboard\Partner\ServiceController.php** (Line 133): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Service deleted successfully.')
  ```
- **Dashboard\Partner\ServiceController.php** (Line 137): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Service deleted successfully.'));
  ```
- **Dashboard\Partner\ServiceQuoteController.php** (Line 65): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\ServiceQuoteController.php** (Line 82): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Quote status updated successfully.'));
  ```
- **Dashboard\Partner\ServiceQuoteController.php** (Line 96): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, __('Quote request deleted successfully.'));
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 24): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(SubscriptionResource::collection($subscriptions));
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 40): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse("You are already subscribed to the **{$plan->title}** plan.", 422);
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 92): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, $message);
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 97): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('Subscription transaction failed. Please try again or contact support.');
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 111): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('You do not have an active, non-scheduled subscription to downgrade.', 422);
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 115): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('The selected plan is not a downgrade or is the same price. Please use the upgrade feature if needed.', 422);
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 128): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, "Your subscription change to the **{$newPlan->title}** plan is scheduled. It will take effect on **{$currentSubscription->ends_at->toFormattedDateString()}**."
  ```
- **Dashboard\Partner\SubscriptionController.php** (Line 133): `Returns raw variable or compact pack directly`
  ```php
return $this->errorResponse('Failed to schedule downgrade. Please try again.');
  ```
- **Dashboard\Partner\WalletController.php** (Line 37): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\WalletController.php** (Line 53): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(TransactionResource::collection($transactions));
  ```
- **Dashboard\Partner\WalletController.php** (Line 65): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\Partner\WalletController.php** (Line 123): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Withdrawal request for $' . number_format($validated['amount'], 2) . ' submitted successfully. It is now pending approval.');
  ```
- **Dashboard\User\AutoInquiryController.php** (Line 25): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(AutoInquiryResource::collection($userInquiries));
  ```
- **Dashboard\User\BookingController.php** (Line 50): `Returns raw variable or compact pack directly`
  ```php
return $this->getBookingDate($booking);
  ```
- **Dashboard\User\BookingController.php** (Line 54): `Returns raw variable or compact pack directly`
  ```php
return $this->getBookingDate($booking)->isFuture();
  ```
- **Dashboard\User\BookingController.php** (Line 58): `Returns raw variable or compact pack directly`
  ```php
return $this->getBookingDate($booking)->isPast();
  ```
- **Dashboard\User\BookingController.php** (Line 82): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact('upcomingBookings', 'pastBookings'));
  ```
- **Dashboard\User\BookingController.php** (Line 82): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact('upcomingBookings', 'pastBookings'));
  ```
- **Dashboard\User\ClassifiedInquiryController.php** (Line 37): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\User\DashboardController.php** (Line 33): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\User\DashboardController.php** (Line 48): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\User\DashboardController.php** (Line 78): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\User\EventBookingController.php** (Line 30): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(EventBookingResource::collection($bookings));
  ```
- **Dashboard\User\FavoriteController.php** (Line 39): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Item successfully removed from your favorites.');
  ```
- **Dashboard\User\JobApplicationController.php** (Line 26): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(JobApplicationResource::collection($applications));
  ```
- **Dashboard\User\MessageController.php** (Line 46): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse([
  ```
- **Dashboard\User\MessageController.php** (Line 86): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, $message, 201);
  ```
- **Dashboard\User\MessageController.php** (Line 89): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Message sent successfully.');
  ```
- **Dashboard\User\PaymentController.php** (Line 26): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(PaymentResource::collection($payments));
  ```
- **Dashboard\User\PropertyBookingController.php** (Line 26): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(PropertyBookingResource::collection($bookings));
  ```
- **Dashboard\User\ReviewController.php** (Line 31): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(
  ```
- **Dashboard\User\ReviewController.php** (Line 49): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(new ReviewResource($review));
  ```
- **Dashboard\User\ReviewController.php** (Line 67): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Your review has been successfully updated.');
  ```
- **Dashboard\User\ReviewController.php** (Line 80): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(null, 'Successfully removed from your reviews.');
  ```
- **Dashboard\User\ServiceAppointmentController.php** (Line 24): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact('appointments'));
  ```
- **Dashboard\User\ServiceAppointmentController.php** (Line 24): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact('appointments'));
  ```
- **Dashboard\User\ServiceQuoteController.php** (Line 24): `Returns raw compact() or array_merge() instead of API Resource`
  ```php
return $this->successResponse(compact('quotes'));
  ```
- **Dashboard\User\ServiceQuoteController.php** (Line 24): `Returns raw variable or compact pack directly`
  ```php
return $this->successResponse(compact('quotes'));
  ```

## 🚨 Inconsistent Field Naming (Resources)
All checked fields appear to be snake_case!
