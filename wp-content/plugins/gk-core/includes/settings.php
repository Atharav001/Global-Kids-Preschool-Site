<?php
/**
 * Global Kids Settings Management (Single Source of Truth)
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_register_settings() {
    register_setting('gk_settings_group', 'gk_settings', [
        'sanitize_callback' => 'gk_sanitize_settings'
    ]);

    add_settings_section(
        'gk_settings_general',
        __('School Profile & Essential Contact Information', 'gk-core'),
        null,
        'gk-settings'
    );
}
add_action('admin_init', 'gk_register_settings');

function gk_sanitize_settings($input) {
    if (!is_array($input)) {
        return [];
    }

    $sanitized = [];
    $text_fields = [
        'school_name', 'tagline', 'est_year', 'phone_display', 'address_line1',
        'address_line2', 'area', 'city', 'state', 'pincode', 'hours_text',
        'ratio_text', 'children_taught', 'admission_cutoff_text', 'announce_text',
        'turnstile_site_key', 'ga4_id'
    ];

    foreach ($text_fields as $field) {
        if (isset($input[$field])) {
            $sanitized[$field] = sanitize_text_field($input[$field]);
        }
    }

    // Phone / WhatsApp validation (digits and optional leading +)
    if (!empty($input['phone_e164'])) {
        $sanitized['phone_e164'] = preg_replace('/[^\+0-9]/', '', $input['phone_e164']);
    }
    if (!empty($input['whatsapp_e164'])) {
        $sanitized['whatsapp_e164'] = preg_replace('/[^\+0-9]/', '', $input['whatsapp_e164']);
    }

    // Email validation
    if (!empty($input['email'])) {
        $sanitized['email'] = sanitize_email($input['email']);
    }

    // URLs
    $url_fields = ['maps_url', 'instagram', 'facebook', 'youtube', 'announce_url', 'google_review_url', 'brochure_url'];
    foreach ($url_fields as $url_field) {
        if (!empty($input[$url_field])) {
            $sanitized[$url_field] = esc_url_raw($input[$url_field]);
        }
    }

    // Ratings & Numbers
    if (!empty($input['google_rating'])) {
        $sanitized['google_rating'] = (float) $input['google_rating'];
    }
    if (!empty($input['google_review_count'])) {
        $sanitized['google_review_count'] = (int) $input['google_review_count'];
    }
    $sanitized['retention_months'] = !empty($input['retention_months']) ? (int) $input['retention_months'] : 12;

    // Toggles
    $sanitized['announce_enabled'] = !empty($input['announce_enabled']) ? 1 : 0;
    $sanitized['fee_mode'] = isset($input['fee_mode']) && in_array($input['fee_mode'], ['show', 'on_request'], true)
        ? $input['fee_mode']
        : 'on_request';

    return $sanitized;
}

// Settings Admin Screen
function gk_add_settings_menu() {
    add_menu_page(
        __('School Settings', 'gk-core'),
        __('School Settings', 'gk-core'),
        'manage_gk_settings',
        'gk-settings',
        'gk_render_settings_page',
        'dashicons-building',
        3
    );
}
add_action('admin_menu', 'gk_add_settings_menu');

function gk_render_settings_page() {
    if (!current_user_can('manage_gk_settings')) {
        wp_die(esc_html__('You do not have sufficient permissions to access this page.', 'gk-core'));
    }
    $settings = get_option('gk_settings', []);
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Global Kids — School Settings', 'gk-core'); ?></h1>
        <p><?php esc_html_e('Single source of truth for all school contact, admissions, hours, and branding facts.', 'gk-core'); ?></p>
        <form method="post" action="options.php">
            <?php
            settings_fields('gk_settings_group');
            do_settings_sections('gk-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
