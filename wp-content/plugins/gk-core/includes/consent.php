<?php
/**
 * Consent Enforcement Gate for Child Photos & Parent Testimonials
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_enforce_consent_gate($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if (!in_array($post->post_type, ['gk_album', 'gk_testimonial'], true)) {
        return;
    }

    // Only inspect when status is or intends to be publish
    if ($post->post_status === 'publish') {
        $consent = get_post_meta($post_id, '_gk_consent_confirmed', true);
        if ($consent !== '1') {
            // Unhook to avoid infinite loop
            remove_action('save_post', 'gk_enforce_consent_gate', 20);

            wp_update_post([
                'ID' => $post_id,
                'post_status' => 'draft',
            ]);

            add_action('save_post', 'gk_enforce_consent_gate', 20, 3);

            // Set transient notice for the admin
            set_transient('gk_consent_missing_notice_' . $post_id, true, 45);
        }
    }
}
add_action('save_post', 'gk_enforce_consent_gate', 20, 3);

function gk_display_consent_missing_notice() {
    global $post;
    if ($post && get_transient('gk_consent_missing_notice_' . $post->ID)) {
        delete_transient('gk_consent_missing_notice_' . $post->ID);
        ?>
        <div class="notice notice-error is-dismissible">
            <p>
                <strong><?php esc_html_e('PUBLICATION BLOCKED:', 'gk-core'); ?></strong>
                <?php esc_html_e('In compliance with child privacy protection and DPDP Act 2023, this entry has been reverted to Draft because parental consent was not verified.', 'gk-core'); ?>
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'gk_display_consent_missing_notice');
