<?php
/**
 * Site Footer Template Part
 */

$school_name = gk_setting('school_name', 'Global Kids Preschool');
$tagline = gk_setting('tagline', 'Where Joy Meets Early Learning');
$address = gk_setting('address_line1', '124, 4th Main Road, Annanagar West');
$area = gk_setting('area', 'Annanagar West');
$city = gk_setting('city', 'Chennai');
$pincode = gk_setting('pincode', '600040');
$phone_display = gk_setting('phone_display', '+91 98765 43210');
$email = gk_setting('email', 'admissions@globalkids.edu.in');
$hours = gk_setting('hours_text', 'Mon – Fri: 08:30 AM – 06:30 PM | Sat: 09:00 AM – 01:00 PM');
$maps_url = gk_setting('maps_url', 'https://maps.google.com/?q=Global+Kids+Preschool');
?>
<footer class="site-footer" role="contentinfo">
    <div class="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
            <path d="M0,24 C300,48 600,0 900,36 C1050,48 1150,20 1200,24 L1200,48 L0,48 Z" fill="#2B2A35"></path>
        </svg>
    </div>

    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                    <?php get_template_part('template-parts/icons/school-emblem'); ?>
                    <h4 style="margin-bottom: 0;"><?php echo esc_html($school_name); ?></h4>
                </div>
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; font-size: 0.95rem;">
                    <?php echo esc_html($tagline); ?>. Nurturing curious minds, empathetic hearts, and confident learners in a joyful, secure environment.
                </p>
                <div class="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span><?php echo esc_html("{$address}, {$area}, {$city} - {$pincode}"); ?></span>
                </div>
            </div>

            <div class="footer-col">
                <h4><?php esc_html_e('Explore Programmes', 'gk-theme'); ?></h4>
                <ul class="footer-links-list">
                    <li><a href="<?php echo esc_url(home_url('/programmes/#toddler')); ?>"><?php esc_html_e('Toddler Play (1.5 – 2.5 yrs)', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/programmes/#playgroup')); ?>"><?php esc_html_e('Playgroup (2 – 3 yrs)', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/programmes/#nursery')); ?>"><?php esc_html_e('Nursery (3 – 4 yrs)', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/programmes/#kindergarten')); ?>"><?php esc_html_e('Kindergarten (4 – 6 yrs)', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/programmes/#daycare')); ?>"><?php esc_html_e('Daycare & Extended Care', 'gk-theme'); ?></a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4><?php esc_html_e('Quick Links', 'gk-theme'); ?></h4>
                <ul class="footer-links-list">
                    <li><a href="<?php echo esc_url(home_url('/about/')); ?>"><?php esc_html_e('About Our School', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/our-approach/')); ?>"><?php esc_html_e('Learning Philosophy', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/facilities-safety/')); ?>"><?php esc_html_e('Safety & Facilities', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/admissions/')); ?>"><?php esc_html_e('Admissions Process', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/reviews/')); ?>"><?php esc_html_e('Parent Reviews', 'gk-theme'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/parent-corner/')); ?>"><?php esc_html_e('Parent Corner 🔒', 'gk-theme'); ?></a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4><?php esc_html_e('Contact & Hours', 'gk-theme'); ?></h4>
                <div class="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <a href="<?php echo esc_url(gk_phone_link()); ?>" style="color: #fff; font-weight: 600;"><?php echo esc_html($phone_display); ?></a>
                </div>
                <div class="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                </div>
                <div class="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span><?php echo esc_html($hours); ?></span>
                </div>
                <div style="margin-top: 1rem;">
                    <a href="<?php echo esc_url($maps_url); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #fff; border-color: rgba(255,255,255,0.4);">
                        <?php esc_html_e('Open in Google Maps ↗', 'gk-theme'); ?>
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div>
                &copy; <?php echo esc_html(gmdate('Y')); ?> <?php echo esc_html($school_name); ?>. <?php esc_html_e('All rights reserved. Designed for child safety & joy.', 'gk-theme'); ?>
            </div>
            <ul class="footer-legal-links">
                <li><a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>"><?php esc_html_e('Privacy Policy', 'gk-theme'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/terms/')); ?>"><?php esc_html_e('Terms of Service', 'gk-theme'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/photo-child-safety-policy/')); ?>"><?php esc_html_e('Child Safety & Photo Policy', 'gk-theme'); ?></a></li>
            </ul>
        </div>
    </div>
</footer>
