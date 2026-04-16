<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmailTemplate; 

/**
 * Class EmailTemplateSeeder
 *
 * Seeds the database with essential, default email templates. These templates
 * are critical for transactional emails across the platform (subscriptions,
 * payments, leads, and general user communication).
 */
class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Defines a comprehensive list of default email templates and uses
     * firstOrCreate to ensure they are either inserted or updated if they exist
     * (by key), preventing duplicate entries during re-seeding.
     *
     * @return void
     */
    public function run(): void
    {
        // 📧 Header Line with Emoji (Yellow Text)
        $this->command->line('📧 Seeding Email Templates (17 default templates)...');

        // 1. Get the initial count
        $initialCount = EmailTemplate::count();
        
        // Define all 17 unique templates
        $templates = [
            // --- SUBSCRIPTION / MEMBERSHIP TEMPLATES (6) ---
            [
                'key' => 'plan_subscribed',
                'title' => 'Plan Subscribed',
                'subject' => 'Welcome to {{ plan_name }}! Your Membership is Active.',
                'body' => '<p>Hello {{ user_name }},</p><p>Thank many thanks for subscribing to the <strong>{{ plan_name }}</strong> plan. Your account has been upgraded, and your new listing limits are now active!</p><p>You can manage your subscription <a href="{{ billing_url }}">here</a>.</p>',
                'description' => 'Sent when a user successfully subscribes or completes a new purchase.',
            ],
            [
                'key' => 'plan_upgraded',
                'title' => 'Plan Upgraded',
                'subject' => 'Success! Your Membership Has Been Upgraded to {{ new_plan_name }}.',
                'body' => '<p>Hello {{ user_name }},</p><p>Your account has been successfully upgraded from {{ old_plan_name }} to <strong>{{ new_plan_name }}</strong>. Enjoy the new features and increased limits immediately!</p>',
                'description' => 'Sent immediately after a user upgrades their plan.',
            ],
            [
                'key' => 'plan_downgraded',
                'title' => 'Plan Downgraded',
                'subject' => 'Important: Your Membership Will be Downgraded.',
                'body' => '<p>Hello {{ user_name }},</p><p>You have successfully scheduled a downgrade to the <strong>{{ new_plan_name }}</strong> plan. This change will take effect on your next billing date: <strong>{{ next_billing_date }}</strong>.</p>',
                'description' => 'Sent when a user requests a downgrade, effective at the end of the current billing cycle.',
            ],
            [
                'key' => 'plan_about_to_expire',
                'title' => 'Plan About to Expire (Reminder)',
                'subject' => 'Action Required: Your {{ plan_name }} is expiring in 7 days.',
                'body' => '<p>Hello {{ user_name }},</p><p>Just a friendly reminder that your subscription to the <strong>{{ plan_name }}</strong> plan will expire on <strong>{{ expiry_date }}</strong>.</p><p>To avoid service interruption, please <a href="{{ renewal_url }}">renew your plan now</a>.</p>',
                'description' => 'Automated reminder sent shortly before a plan is set to expire.',
            ],
            [
                'key' => 'plan_expired',
                'title' => 'Plan Expired',
                'subject' => 'Your Subscription Has Expired',
                'body' => '<p>Hello {{ user_name }},</p><p>Your <strong>{{ plan_name }}</strong> subscription expired today. Your listings may now be inactive.</p><p>Please <a href="{{ reactivate_url }}">log in to resubscribe</a> and reactivate your account.</p>',
                'description' => 'Sent when a subscription has officially ended due to non-renewal.',
            ],
            [
                'key' => 'payment_failed',
                'title' => 'Payment Failed',
                'subject' => 'Action Required: Your Payment for {{ plan_name }} Failed.',
                'body' => '<p>Hello {{ user_name }},</p><p>We were unable to process your payment for the <strong>{{ plan_name }}</strong> plan. Please update your billing information immediately to avoid service interruption.</p><p>Update Payment: <a href="{{ billing_url }}">Update Now</a></p>',
                'description' => 'Alerts the user when a recurring payment fails.',
            ],
            
            // --- TRANSACTIONAL / BOOKING TEMPLATES (3) ---
            [
                'key' => 'property_booking_confirmed',
                'title' => 'Property Booking Confirmed',
                'subject' => 'Booking Confirmed: {{ property_title }}',
                'body' => '<p>Hello {{ guest_name }},</p><p>Your booking for <strong>{{ property_title }}</strong> from {{ check_in_date }} to {{ check_out_date }} is confirmed! The total amount is {{ total_price }}.</p><p>View Details: <a href="{{ booking_link }}">Booking Summary</a></p>',
                'description' => 'Sent to the guest upon successful confirmation of a property/rental booking.',
            ],
            [
                'key' => 'booking_cancelled',
                'title' => 'Booking Cancelled (General)',
                'subject' => 'Your Booking for {{ item_title }} Has Been Cancelled',
                'body' => '<p>Hello {{ user_name }},</p><p>Your booking/reservation for <strong>{{ item_title }}</strong> has been successfully cancelled. A refund of {{ refund_amount }} is being processed.</p>',
                'description' => 'Sent to the user when any booking (property, service, etc.) is cancelled.',
            ],
            [
                'key' => 'event_ticket_purchased',
                'title' => 'Event Ticket Purchased',
                'subject' => 'Your Tickets for {{ event_title }} Are Here!',
                'body' => '<p>Hello {{ user_name }},</p><p>Thank you for your purchase! Attached is your ticket(s) for <strong>{{ event_title }}</strong> on {{ event_date }}. Please bring this email with you.</p>',
                'description' => 'Sent to the buyer immediately after a successful ticket purchase.',
            ],

            // --- LISTING / LEAD NOTIFICATION TEMPLATES (4) ---
            [
                'key' => 'new_listing_lead',
                'title' => 'New Listing Lead Notification',
                'subject' => 'New Lead for Your Listing: {{ listing_title }}',
                'body' => '<p>Hello {{ owner_name }},</p><p>You have received a new inquiry for your listing: <strong>{{ listing_title }}</strong>.</p><p>Lead Contact: <strong>{{ lead_name }}</strong> ({{ lead_email }}). Message: "{{ lead_message }}"</p><p>Respond quickly!</p>',
                'description' => 'Used for leads on Properties (sale), Autos, Services, and Classifieds.',
            ],
            [
                'key' => 'job_application_received',
                'title' => 'Job Application Received',
                'subject' => 'New Application for Job: {{ job_title }}',
                'body' => '<p>Hello {{ employer_name }},</p><p>You have received a new application for your job posting: <strong>{{ job_title }}</strong>.</p><p>View Application: <a href="{{ application_link }}">Click here</a></p>',
                'description' => 'Sent to the employer when a user applies to a job listing.',
            ],
            [
                'key' => 'listing_approved',
                'title' => 'Listing Approved',
                'subject' => 'Good News! Your Listing is Live: {{ listing_title }}',
                'body' => '<p>Hello {{ user_name }},</p><p>Your listing, <strong>{{ listing_title }}</strong>, has been reviewed and is now live on the platform!</p><p>View Listing: <a href="{{ listing_link }}">Click here</a></p>',
                'description' => 'Notifies the user that their submitted listing has been approved and published.',
            ],
            [
                'key' => 'listing_rejected',
                'title' => 'Listing Rejected',
                'subject' => 'Important: Your Listing was Rejected: {{ listing_title }}',
                'body' => '<p>Hello {{ user_name }},</p><p>Your listing, <strong>{{ listing_title }}</strong>, could not be approved due to the following reason(s):</p><p><strong>{{ rejection_reason }}</strong></p><p>Please edit your listing and resubmit.</p>',
                'description' => 'Notifies the user their listing was rejected and provides a reason.',
            ],

            // --- GENERAL USER TEMPLATES (2) ---
            [
                'key' => 'welcome_to_platform',
                'title' => 'Welcome to the Platform',
                'subject' => 'Welcome to the Community!',
                'body' => '<p>Hello {{ user_name }},</p><p>Welcome aboard! You can now start listing, booking, and connecting with our community.</p><p>Get Started: <a href="{{ dashboard_url }}">Your Dashboard</a></p>',
                'description' => 'Sent immediately after successful user registration.',
            ],
            [
                'key' => 'password_reset_link',
                'title' => 'Password Reset Link',
                'subject' => 'Your Password Reset Request',
                'body' => '<p>Hello,</p><p>You are receiving this email because we received a password reset request for your account.</p><p>Reset Password: <a href="{{ reset_link }}">Click here to reset your password</a></p><p>If you did not request a password reset, please ignore this email.</p>',
                'description' => 'Standard email for Laravel\'s password reset feature.',
            ],
            
            // --- FEEDBACK / REVIEW TEMPLATES (2) ---
            [
                'key' => 'request_a_review',
                'title' => 'Request a Review',
                'subject' => 'How was your experience with {{ item_name }}?',
                'body' => '<p>Hello {{ user_name }},</p><p>We hope you enjoyed your experience with <strong>{{ item_name }}</strong>. Please take a moment to share your feedback and leave a rating.</p><p>Leave Review: <a href="{{ review_link }}">Rate Your Experience</a></p>',
                'description' => 'Sent to users after a transaction/service is completed, prompting them to leave a review.',
            ],
            [
                'key' => 'review_received',
                'title' => 'Review Received Notification',
                'subject' => 'New Review for Your Listing: {{ item_name }}',
                'body' => '<p>Hello {{ owner_name }},</p><p>Your listing, <strong>{{ item_name }}</strong>, just received a new review!</p><p>Rating: <strong>{{ rating_stars }} ({{ rating_value }}/5)</strong></p><p>Comment: "{{ review_comment }}"</p><p>View Review: <a href="{{ review_link }}">Click here to see the full review</a></p>',
                'description' => 'Sent to the listing owner when their item (property, auto, etc.) receives a new review.',
            ],
            
            // --- NEWSLETTER TEMPLATES (2) ---
            [
                'key' => 'newsletter_optin_confirmation',
                'title' => 'Newsletter Opt-in Confirmation',
                'subject' => 'Please confirm your subscription to our newsletter',
                'body' => '<p>Hello,</p><p>Please click the link below to confirm your subscription:</p><p><a href="{{ confirmation_link }}">Confirm Subscription</a></p>',
                'description' => 'Used for double opt-in to verify the subscriber\'s email address.',
            ],
            [
                'key' => 'newsletter_welcome',
                'title' => 'Newsletter Welcome',
                'subject' => 'Welcome to our newsletter!',
                'body' => '<p>Hello {{ subscriber_name }},</p><p>Thanks for subscribing! You\'ll now receive the latest updates, news, and exclusive offers straight to your inbox.</p>',
                'description' => 'Sent to the user immediately after their subscription is confirmed.',
            ],
        ];

        // 2. Insert or Update the templates
        foreach ($templates as $template) {
            EmailTemplate::firstOrCreate(['key' => $template['key']], $template);
        }

        // 3. Get the final count
        $finalCount = EmailTemplate::count();
        $recordsCreated = $finalCount - $initialCount;

        // 🔢 Count Display (Green Text)
        if ($recordsCreated > 0) {
            $this->command->info("   > **$recordsCreated** new email templates created.");
        } else {
            // Use warn if no records were created, but existing ones were confirmed/updated (common for firstOrCreate).
            $this->command->line("   > No new templates created. **17** existing templates confirmed/updated.");
        }
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Email Templates Seeding finished.');
    }
}