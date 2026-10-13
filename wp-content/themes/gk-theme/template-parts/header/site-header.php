<?php
/**
 * Site Header Template Part
 */

$school_name = gk_setting('school_name', 'Global Kids Preschool');
$tagline = gk_setting('tagline', 'Where Joy Meets Early Learning');
?>
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
