<?php
/**
 * Gallery Archive Template
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <?php gk_breadcrumbs(); ?>
        <header class="section-header reveal-item">
            <span class="eyebrow"><?php esc_html_e('Photo Albums', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('Campus Life & Celebrations Gallery', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('A visual collection of everyday joy, festival activities, and discovery moments at Global Kids.', 'gk-theme'); ?></p>
        </header>

        <div class="cards-grid" style="margin-top: 3rem;">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <a href="<?php the_permalink(); ?>" class="programme-card reveal-item">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('gk-card', ['class' => 'programme-media']); ?>
                    <?php endif; ?>
                    <div class="programme-body">
                        <h2 class="programme-title" style="font-size: var(--fs-lg);"><?php the_title(); ?></h2>
                        <span class="programme-cta"><?php esc_html_e('View photo album →', 'gk-theme'); ?></span>
                    </div>
                </a>
            <?php endwhile; endif; ?>
        </div>
    </div>
</section>
<?php
get_footer();
