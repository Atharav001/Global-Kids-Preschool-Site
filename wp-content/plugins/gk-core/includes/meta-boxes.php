<?php
/**
 * Meta Boxes for CPTs & Consent Gating
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_add_custom_meta_boxes() {
    // Programme Meta Box
    add_meta_box('gk_programme_meta', __('Programme Specifics', 'gk-core'), 'gk_render_programme_meta_box', 'gk_programme', 'normal', 'high');

    // Teacher Meta Box
    add_meta_box('gk_teacher_meta', __('Teacher Details', 'gk-core'), 'gk_render_teacher_meta_box', 'gk_teacher', 'normal', 'high');

    // Testimonial Meta Box (Consent Gated)
    add_meta_box('gk_testimonial_meta', __('Reviewer Details & Consent Verification', 'gk-core'), 'gk_render_testimonial_meta_box', 'gk_testimonial', 'normal', 'high');

    // Album Meta Box (Consent Gated)
    add_meta_box('gk_album_meta', __('Album Information & Parental Photo Consent', 'gk-core'), 'gk_render_album_meta_box', 'gk_album', 'normal', 'high');
}
add_action('add_meta_boxes', 'gk_add_custom_meta_boxes');

// Programme Meta Box HTML
function gk_render_programme_meta_box($post) {
    wp_nonce_field('gk_save_meta_box', 'gk_meta_nonce');
    $age_from = get_post_meta($post->ID, '_gk_age_from', true);
    $age_to = get_post_meta($post->ID, '_gk_age_to', true);
    $timings = get_post_meta($post->ID, '_gk_timings', true);
    $ratio = get_post_meta($post->ID, '_gk_ratio', true);
    $fee_text = get_post_meta($post->ID, '_gk_fee_text', true);
    ?>
    <p>
        <label><strong><?php esc_html_e('Age Range (e.g. 2 – 3 yrs):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_age_from" value="<?php echo esc_attr($age_from); ?>" placeholder="From (e.g. 2 Years)" style="width: 48%;">
        <input type="text" name="gk_age_to" value="<?php echo esc_attr($age_to); ?>" placeholder="To (e.g. 3 Years)" style="width: 48%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Daily Timings (e.g. 09:00 AM – 12:30 PM):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_timings" value="<?php echo esc_attr($timings); ?>" style="width: 100%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Teacher–Child Ratio (e.g. 1:8):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_ratio" value="<?php echo esc_attr($ratio); ?>" style="width: 100%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Fee Details (if displayed):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_fee_text" value="<?php echo esc_attr($fee_text); ?>" placeholder="₹ per term or month" style="width: 100%;">
    </p>
    <?php
}

// Teacher Meta Box HTML
function gk_render_teacher_meta_box($post) {
    wp_nonce_field('gk_save_meta_box', 'gk_meta_nonce');
    $role = get_post_meta($post->ID, '_gk_role', true);
    $qual = get_post_meta($post->ID, '_gk_qualification', true);
    $exp = get_post_meta($post->ID, '_gk_experience', true);
    ?>
    <p>
        <label><strong><?php esc_html_e('Role / Lead Subject:', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_role" value="<?php echo esc_attr($role); ?>" style="width: 100%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Educational Qualification (e.g. B.Ed, Montessori Certified):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_qualification" value="<?php echo esc_attr($qual); ?>" style="width: 100%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Years of Experience:', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_experience" value="<?php echo esc_attr($exp); ?>" style="width: 100%;">
    </p>
    <?php
}

// Testimonial Meta Box HTML
function gk_render_testimonial_meta_box($post) {
    wp_nonce_field('gk_save_meta_box', 'gk_meta_nonce');
    $parent_name = get_post_meta($post->ID, '_gk_parent_name', true);
    $programme = get_post_meta($post->ID, '_gk_programme', true);
    $consent = get_post_meta($post->ID, '_gk_consent_confirmed', true);
    ?>
    <p>
        <label><strong><?php esc_html_e('Parent Display Name (First name + initial only, e.g. Priya S.):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_parent_name" value="<?php echo esc_attr($parent_name); ?>" style="width: 100%;">
    </p>
    <p>
        <label><strong><?php esc_html_e('Child\'s Programme (e.g. Nursery Batch 2025):', 'gk-core'); ?></strong></label><br>
        <input type="text" name="gk_programme" value="<?php echo esc_attr($programme); ?>" style="width: 100%;">
    </p>
    <p style="background: #FFF8EC; padding: 12px; border: 1px solid #EADFC9; border-radius: 6px;">
        <label>
            <input type="checkbox" name="gk_consent_confirmed" value="1" <?php checked($consent, '1'); ?>>
            <strong style="color: #2E8B57;"><?php esc_html_e('Parent Review & Name Publication Consent Confirmed', 'gk-core'); ?></strong>
        </label>
        <br><small><?php esc_html_e('Publishing is automatically blocked and post reverted to draft if consent is not confirmed.', 'gk-core'); ?></small>
    </p>
    <?php
}

// Album Meta Box HTML
function gk_render_album_meta_box($post) {
    wp_nonce_field('gk_save_meta_box', 'gk_meta_nonce');
    $event_date = get_post_meta($post->ID, '_gk_event_date', true);
    $consent = get_post_meta($post->ID, '_gk_consent_confirmed', true);
    ?>
    <p>
        <label><strong><?php esc_html_e('Event Date:', 'gk-core'); ?></strong></label><br>
        <input type="date" name="gk_event_date" value="<?php echo esc_attr($event_date); ?>">
    </p>
    <p style="background: #FFF8EC; padding: 12px; border: 1px solid #EADFC9; border-radius: 6px;">
        <label>
            <input type="checkbox" name="gk_consent_confirmed" value="1" <?php checked($consent, '1'); ?>>
            <strong style="color: #2E8B57;"><?php esc_html_e('Written Parental Photo Consent Verified for All Children Shown', 'gk-core'); ?></strong>
        </label>
        <br><small><?php esc_html_e('CRITICAL: In compliance with Child Privacy Guidelines & DPDP Act 2023, albums cannot be published without verified parental consent.', 'gk-core'); ?></small>
    </p>
    <?php
}

// Save Meta Box Data
function gk_save_meta_box_data($post_id) {
    if (!isset($_POST['gk_meta_nonce']) || !wp_verify_nonce($_POST['gk_meta_nonce'], 'gk_save_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = [
        'gk_age_from' => '_gk_age_from',
        'gk_age_to'   => '_gk_age_to',
        'gk_timings'  => '_gk_timings',
        'gk_ratio'    => '_gk_ratio',
        'gk_fee_text' => '_gk_fee_text',
        'gk_role'     => '_gk_role',
        'gk_qualification' => '_gk_qualification',
        'gk_experience'    => '_gk_experience',
        'gk_parent_name'   => '_gk_parent_name',
        'gk_programme'     => '_gk_programme',
        'gk_event_date'    => '_gk_event_date',
    ];

    foreach ($fields as $key => $meta_key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$key]));
        }
    }

    // Consent flag
    $consent = !empty($_POST['gk_consent_confirmed']) ? '1' : '0';
    update_post_meta($post_id, '_gk_consent_confirmed', $consent);
}
add_action('save_post', 'gk_save_meta_box_data');
