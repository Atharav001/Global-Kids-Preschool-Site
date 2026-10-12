<?php
/**
 * 404 Error Page Template
 */

get_header();
?>
<section class="section" style="padding-top: 4rem; text-align: center;">
    <div class="container container-narrow">
        <div class="reveal-item">
            <span style="font-size: 5rem; font-family: var(--font-head); color: var(--sun); line-height: 1;">404</span>
            <h1 style="margin: 1rem 0;"><?php esc_html_e('Page Not Found', 'gk-theme'); ?></h1>
            <p style="margin: 0 auto 2rem auto; max-width: 50ch;">
                <?php esc_html_e('The page you are looking for might have been moved or does not exist. Let\'s guide you back to our school community.', 'gk-theme'); ?>
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary"><?php esc_html_e('Return to Homepage', 'gk-theme'); ?></a>
                <a href="<?php echo esc_url(home_url('/programmes/')); ?>" class="btn btn-secondary"><?php esc_html_e('Explore Programmes', 'gk-theme'); ?></a>
                <a href="<?php echo esc_url(home_url('/admissions/#visit')); ?>" class="btn btn-whatsapp"><?php esc_html_e('Book a Visit', 'gk-theme'); ?></a>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
