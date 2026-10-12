<?php
/**
 * Mobile Navigation Drawer Sheet
 */
?>
<div class="mobile-menu-overlay" aria-hidden="true"></div>
<aside id="mobile-menu-drawer" class="mobile-menu-drawer" aria-label="<?php esc_attr_e('Mobile Navigation', 'gk-theme'); ?>">
    <div class="mobile-menu-header">
        <span class="brand-title"><?php echo esc_html(gk_setting('school_name', 'Global Kids')); ?></span>
        <button class="btn-menu-close btn-menu-toggle" type="button" aria-label="<?php esc_attr_e('Close menu', 'gk-theme'); ?>">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>

    <nav class="mobile-nav-list" role="navigation">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="mobile-nav-link"><?php esc_html_e('Home', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/about/')); ?>" class="mobile-nav-link"><?php esc_html_e('About Us', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/programmes/')); ?>" class="mobile-nav-link"><?php esc_html_e('Programmes', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/our-approach/')); ?>" class="mobile-nav-link"><?php esc_html_e('Our Approach', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/facilities-safety/')); ?>" class="mobile-nav-link"><?php esc_html_e('Facilities & Safety', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/admissions/')); ?>" class="mobile-nav-link"><?php esc_html_e('Admissions', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/gallery/')); ?>" class="mobile-nav-link"><?php esc_html_e('Photo Gallery', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/news/')); ?>" class="mobile-nav-link"><?php esc_html_e('News & Events', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/reviews/')); ?>" class="mobile-nav-link"><?php esc_html_e('Parent Reviews', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/parent-corner/')); ?>" class="mobile-nav-link"><?php esc_html_e('Parent Corner 🔒', 'gk-theme'); ?></a>
        <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="mobile-nav-link"><?php esc_html_e('Contact Us', 'gk-theme'); ?></a>
    </nav>

    <div class="mobile-menu-actions">
        <a href="<?php echo esc_url(home_url('/admissions/#visit')); ?>" class="btn btn-primary" style="width: 100%;">
            <?php esc_html_e('Book a School Visit', 'gk-theme'); ?>
        </a>
        <a href="<?php echo esc_url(gk_whatsapp_link()); ?>" class="btn btn-whatsapp" style="width: 100%;" target="_blank" rel="noopener noreferrer">
            <?php esc_html_e('Chat on WhatsApp', 'gk-theme'); ?>
        </a>
        <a href="<?php echo esc_url(gk_phone_link()); ?>" class="btn btn-secondary" style="width: 100%;">
            <?php esc_html_e('Call School Direct', 'gk-theme'); ?>
        </a>
    </div>
</aside>
