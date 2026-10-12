<?php
/**
 * Template Name: Thank You (Visit Enquiry Submitted)
 */

$ref_id = isset($_GET['ref']) ? sanitize_text_field(wp_unslash($_GET['ref'])) : 'GK-VISIT';

get_header();
?>
<section class="section" style="padding-top: 3rem; text-align: center;">
    <div class="container container-narrow">
        <div class="gk-form-card reveal-item" style="padding: 3rem 2rem;">
            <div style="width: 64px; height: 64px; background: var(--tint-mint); color: var(--ok); border-radius: var(--r-pill); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2rem;">
                ✔
            </div>
            <h1><?php esc_html_e('Thank You! Your Visit Enquiry is Received', 'gk-theme'); ?></h1>
            <p style="font-size: var(--fs-lg); color: var(--ink); margin: 1rem auto; max-width: 50ch;">
                <?php printf(esc_html__('We have successfully recorded your enquiry under reference number: %s', 'gk-theme'), '<strong>' . esc_html($ref_id) . '</strong>'); ?>
            </p>
            <p style="color: var(--ink-soft); margin: 0 auto 2rem auto; max-width: 50ch;">
                <?php esc_html_e('Our admissions coordinator will contact you by phone within one working day to confirm your campus tour slot and share location directions.', 'gk-theme'); ?>
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="<?php echo esc_url(gk_whatsapp_link('Hi! I submitted a visit enquiry on your website with reference ' . $ref_id)); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    <?php esc_html_e('Message Us on WhatsApp Now', 'gk-theme'); ?>
                </a>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-secondary">
                    <?php esc_html_e('Return to Homepage', 'gk-theme'); ?>
                </a>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
