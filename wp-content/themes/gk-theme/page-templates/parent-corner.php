<?php
/**
 * Template Name: Parent Corner
 */

// Strict privacy headers for Parent Corner: noindex & no-cache
if (!headers_sent()) {
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    nocache_headers();
}

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
        <?php gk_breadcrumbs(); ?>
        <header class="section-header text-center reveal-item">
            <span class="eyebrow"><?php esc_html_e('Enrolled Families Only', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('Parent Corner 🔒', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('A secure portal for enrolled parents to access term calendars, meal menus, and school announcements.', 'gk-theme'); ?></p>
        </header>

        <div class="gk-form-card reveal-item" style="margin-top: 2rem;">
            <div style="background: var(--tint-sky); padding: 1.25rem; border-radius: var(--r-sm); margin-bottom: 2rem; font-size: var(--fs-sm);">
                <strong><?php esc_html_e('Need the Passcode?', 'gk-theme'); ?></strong>
                <?php esc_html_e('The shared parent access passcode is distributed via our official WhatsApp school broadcast group.', 'gk-theme'); ?>
            </div>

            <h3 style="margin-bottom: 1.25rem;"><?php esc_html_e('Term Circulars & Downloads', 'gk-theme'); ?></h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: var(--r-sm);">
                    <div>
                        <strong><?php esc_html_e('Term 1 Calendar & Holiday Schedule', 'gk-theme'); ?></strong><br>
                        <small style="color: var(--ink-soft);"><?php esc_html_e('PDF · Updated Regularly', 'gk-theme'); ?></small>
                    </div>
                    <span class="sticker-badge"><?php esc_html_e('Enrolled Only', 'gk-theme'); ?></span>
                </li>
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: var(--r-sm);">
                    <div>
                        <strong><?php esc_html_e('Weekly Nutrition & Fruit Snack Menu', 'gk-theme'); ?></strong><br>
                        <small style="color: var(--ink-soft);"><?php esc_html_e('PDF · Certified by Pediatric Nutritionist', 'gk-theme'); ?></small>
                    </div>
                    <span class="sticker-badge"><?php esc_html_e('Enrolled Only', 'gk-theme'); ?></span>
                </li>
            </ul>
        </div>
    </div>
</section>
<?php
get_footer();
