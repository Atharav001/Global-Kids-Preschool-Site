<?php
/**
 * Enquiry Form Submission Pipeline & Security
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_post_nopriv_gk_submit_enquiry', 'gk_handle_enquiry_submission');
add_action('admin_post_gk_submit_enquiry', 'gk_handle_enquiry_submission');

function gk_handle_enquiry_submission() {
    // 1. Verify Nonce
    if (!isset($_POST['gk_enquiry_nonce']) || !wp_verify_nonce($_POST['gk_enquiry_nonce'], 'gk_enquiry_form_submit')) {
        wp_die(esc_html__('Security check failed. Please refresh and try again.', 'gk-core'), 'Nonce Failure', ['response' => 403]);
    }

    // 2. Honeypot check
    if (!empty($_POST['website_url'])) {
        wp_die(esc_html__('Spam bot detected.', 'gk-core'), 'Forbidden', ['response' => 400]);
    }

    // 3. Time-trap check (minimum 3 seconds)
    $submit_time = isset($_POST['form_timestamp']) ? (int) $_POST['form_timestamp'] : 0;
    if (time() - $submit_time < 3) {
        wp_die(esc_html__('Submission too fast. Please take your time.', 'gk-core'), 'Fast Submit', ['response' => 400]);
    }

    // 4. Consent verification
    if (empty($_POST['consent'])) {
        wp_die(esc_html__('Privacy consent is required to process your enquiry.', 'gk-core'), 'Consent Required', ['response' => 400]);
    }

    // 5. Sanitization & Validation
    $parent_name = isset($_POST['parent_name']) ? sanitize_text_field(wp_unslash($_POST['parent_name'])) : '';
    $phone_raw   = isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '';
    $email       = !empty($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $programme   = isset($_POST['programme']) ? sanitize_text_field(wp_unslash($_POST['programme'])) : '';
    $age_band    = isset($_POST['age_band']) ? sanitize_text_field(wp_unslash($_POST['age_band'])) : '';
    $visit_date  = isset($_POST['visit_date']) ? sanitize_text_field(wp_unslash($_POST['visit_date'])) : '';
    $visit_time  = isset($_POST['visit_time']) ? sanitize_text_field(wp_unslash($_POST['visit_time'])) : '';
    $message     = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';

    // Indian mobile phone check: exactly 10 digits
    $phone_cleaned = preg_replace('/[^0-9]/', '', $phone_raw);
    if (strlen($phone_cleaned) !== 10) {
        wp_die(esc_html__('Please enter a valid 10-digit Indian mobile number.', 'gk-core'), 'Invalid Phone', ['response' => 400]);
    }

    // 6. Generate Reference ID
    $ref_id = 'GK-' . strtoupper(wp_generate_password(6, false, false));

    // 7. Store in private CPT (Stored FIRST before email delivery)
    $post_id = wp_insert_post([
        'post_type'   => 'gk_enquiry',
        'post_title'  => sprintf('Enquiry %s - %s', $ref_id, $parent_name),
        'post_status' => 'publish',
        'meta_input'  => [
            '_gk_ref_id'           => $ref_id,
            '_gk_parent_name'      => $parent_name,
            '_gk_phone'            => $phone_cleaned,
            '_gk_email'            => $email,
            '_gk_programme'        => $programme,
            '_gk_age_band'         => $age_band,
            '_gk_visit_date'       => $visit_date,
            '_gk_visit_time'       => $visit_time,
            '_gk_message'          => $message,
            '_gk_status'           => 'new',
            '_gk_consent_ts'       => current_time('mysql'),
            '_gk_consent_version'  => 'v1.0'
        ]
    ]);

    // 8. Notifications
    $school_email = gk_setting('email', get_option('admin_email'));
    $email_subject = sprintf('[New Visit Enquiry %s] %s', $ref_id, $parent_name);
    $email_body = "New Campus Visit Enquiry Received:\n\n"
        . "Reference ID: {$ref_id}\n"
        . "Parent Name: {$parent_name}\n"
        . "Mobile: {$phone_cleaned}\n"
        . "Email: {$email}\n"
        . "Programme: {$programme}\n"
        . "Child Age Band: {$age_band}\n"
        . "Preferred Date: {$visit_date}\n"
        . "Preferred Time: {$visit_time}\n"
        . "Message: {$message}\n";

    @wp_mail($school_email, $email_subject, $email_body);

    // Auto-reply to parent if email was provided
    if (!empty($email)) {
        $parent_subject = "Your Campus Visit Enquiry - Global Kids Preschool (" . $ref_id . ")";
        $parent_body = "Dear {$parent_name},\n\nThank you for reaching out to Global Kids Preschool! We have received your campus tour enquiry.\n\nOur admissions coordinator will call you within one working day to confirm your visit time.\n\nWarm regards,\nAdmissions Team\nGlobal Kids Preschool";
        @wp_mail($email, $parent_subject, $parent_body);
    }

    // 9. Redirect to Thank You page with opaque ref ID (no PII in URL!)
    wp_safe_redirect(add_query_arg(['ref' => $ref_id], home_url('/thank-you/')));
    exit;
}
