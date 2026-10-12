<?php
/**
 * Template Name: Contact Us
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <?php gk_breadcrumbs(); ?>
        <header class="section-header reveal-item">
            <span class="eyebrow"><?php esc_html_e('Connect With Us', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('We Would Love to Welcome You to Campus', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('Drop by for a visit, message us directly on WhatsApp, or call our admissions desk.', 'gk-theme'); ?></p>
        </header>

        <div class="hero-grid" style="align-items: flex-start; margin-top: 3rem;">
            <div class="reveal-item" style="display: flex; flex-direction: column; gap: 2rem;">
                <div class="gk-form-card">
                    <h3><?php esc_html_e('Campus Location & Direct Lines', 'gk-theme'); ?></h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
                        <div>
                            <strong><?php esc_html_e('Campus Address:', 'gk-theme'); ?></strong><br>
                            <span><?php echo esc_html(gk_setting('address_line1') . ', ' . gk_setting('area') . ', ' . gk_setting('city') . ' - ' . gk_setting('pincode')); ?></span>
                        </div>
                        <div>
                            <strong><?php esc_html_e('Phone Number:', 'gk-theme'); ?></strong><br>
                            <a href="<?php echo esc_url(gk_phone_link()); ?>"><?php echo esc_html(gk_setting('phone_display')); ?></a>
                        </div>
                        <div>
                            <strong><?php esc_html_e('Email:', 'gk-theme'); ?></strong><br>
                            <a href="mailto:<?php echo esc_attr(gk_setting('email')); ?>"><?php echo esc_html(gk_setting('email')); ?></a>
                        </div>
                        <div>
                            <strong><?php esc_html_e('Visiting Hours:', 'gk-theme'); ?></strong><br>
                            <span><?php echo esc_html(gk_setting('hours_text')); ?></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gk-form-card reveal-item">
                <h2><?php esc_html_e('Send a Direct Message', 'gk-theme'); ?></h2>
                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST" class="gk-form" data-gk-validate="true">
                    <input type="hidden" name="action" value="gk_submit_enquiry">
                    <?php wp_nonce_field('gk_enquiry_form_submit', 'gk_enquiry_nonce'); ?>
                    <input type="text" name="website_url" style="display: none;" tabindex="-1">
                    <input type="hidden" name="form_timestamp" value="<?php echo esc_attr(time()); ?>">

                    <div class="form-group">
                        <label class="form-label" for="c_name"><?php esc_html_e('Full Name', 'gk-theme'); ?> <span class="required">*</span></label>
                        <input type="text" id="c_name" name="parent_name" class="form-control" required placeholder="e.g. Ramesh Kumar">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="c_phone"><?php esc_html_e('10-Digit Mobile', 'gk-theme'); ?> <span class="required">*</span></label>
                        <input type="tel" id="c_phone" name="phone" class="form-control" required placeholder="9876543210" pattern="[0-9]{10}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="c_msg"><?php esc_html_e('Your Message', 'gk-theme'); ?> <span class="required">*</span></label>
                        <textarea id="c_msg" name="message" class="form-control" required placeholder="<?php esc_attr_e('How can we help you?', 'gk-theme'); ?>"></textarea>
                    </div>

                    <label class="consent-checkbox-row">
                        <input type="checkbox" name="consent" required value="1">
                        <span class="consent-text"><?php esc_html_e('I consent to the school contacting me.', 'gk-theme'); ?> <span class="required">*</span></span>
                    </label>

                    <button type="submit" class="btn btn-primary" style="width: 100%;"><?php esc_html_e('Send Message', 'gk-theme'); ?></button>
                </form>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
