<?php
/**
 * Site Header Template Part
 */

$school_name = gk_setting('school_name', 'Global Kids Preschool');
$tagline = gk_setting('tagline', 'Where Joy Meets Early Learning');
$phone = gk_setting('phone_e164', '+91 98400 12345');
$area = gk_setting('area', 'Annanagar West');
$city = gk_setting('city', 'Chennai');
$wa_link = gk_whatsapp_link();
?>
<!-- Institutional School Top Utility Bar -->
<div class="school-top-utility" role="region" aria-label="<?php esc_attr_e('School Quick Contact', 'gk-theme'); ?>">
    <div class="container school-utility-inner">
        <div class="utility-left">
            <span><strong>📞 Admissions Helpline:</strong> <a href="tel:<?php echo esc_attr($phone); ?>"><?php echo esc_html($phone); ?></a></span>
            <span class="utility-divider">|</span>
            <span><strong>⏰ Hours:</strong> Mon–Sat 8:30 AM – 4:30 PM</span>
            <span class="utility-divider">|</span>
            <span><strong>📍 Campus:</strong> <?php echo esc_html($area . ', ' . $city); ?></span>
        </div>
        <div class="utility-right">
            <span class="utility-badge">Admissions 2025–26 Open</span>
            <a href="<?php echo esc_url(home_url('/parent-corner/')); ?>" class="utility-link">Parent Portal 🔒</a>
            <a href="<?php echo esc_url($wa_link); ?>" target="_blank" rel="noopener noreferrer" class="utility-link utility-wa">WhatsApp Us</a>
        </div>
    </div>
</div>

<header class="site-header" role="banner">
    <div class="container header-inner">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="brand-logo" aria-label="<?php echo esc_attr($school_name); ?>">
            <?php get_template_part('template-parts/icons/school-emblem'); ?>
            <div class="brand-text">
                <span class="brand-title"><?php echo esc_html($school_name); ?></span>
                <span class="brand-subtitle"><?php echo esc_html($tagline); ?></span>
            </div>
        </a>

        <nav class="nav-menu-desktop" role="navigation" aria-label="<?php esc_attr_e('Primary Navigation', 'gk-theme'); ?>">
            <a href="<?php echo esc_url(home_url('/about/')); ?>" class="nav-link"><?php esc_html_e('About', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/programmes/')); ?>" class="nav-link"><?php esc_html_e('Programmes', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/our-approach/')); ?>" class="nav-link"><?php esc_html_e('Our Approach', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/facilities-safety/')); ?>" class="nav-link"><?php esc_html_e('Facilities & Safety', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/admissions/')); ?>" class="nav-link"><?php esc_html_e('Admissions', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/gallery/')); ?>" class="nav-link"><?php esc_html_e('Gallery', 'gk-theme'); ?></a>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="nav-link"><?php esc_html_e('Contact', 'gk-theme'); ?></a>
        </nav>

        <div class="header-cta-group">
            <a href="<?php echo esc_url(home_url('/admissions/#visit')); ?>" class="btn btn-primary btn-sm">
                <?php esc_html_e('Book a Visit', 'gk-theme'); ?>
            </a>
            <button class="btn-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu-drawer" aria-label="<?php esc_attr_e('Toggle navigation menu', 'gk-theme'); ?>">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
    </div>
</header>
