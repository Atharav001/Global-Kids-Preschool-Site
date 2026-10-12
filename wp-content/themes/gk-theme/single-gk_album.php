<?php
/**
 * Single Album Template
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <?php gk_breadcrumbs(); ?>
        <?php while (have_posts()) : the_post();
            $event_date = get_post_meta(get_the_ID(), '_gk_event_date', true);
            ?>
            <article class="reveal-item">
                <span class="eyebrow"><?php esc_html_e('Campus Gallery', 'gk-theme'); ?></span>
                <h1><?php the_title(); ?></h1>
                <?php if ($event_date): ?>
                    <p style="font-size: var(--fs-sm); color: var(--ink-soft); margin-top: 0.5rem; margin-bottom: 2rem;">
                        <?php printf(esc_html__('Event Date: %s', 'gk-theme'), esc_html(date_i18n(get_option('date_format'), strtotime($event_date)))); ?>
                    </p>
                <?php endif; ?>

                <div class="gallery-content" style="margin-top: 2rem;">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</section>
<?php
get_footer();
