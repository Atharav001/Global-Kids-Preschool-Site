<?php
/**
 * Main Index Template
 */

get_header();
?>
<section class="section">
    <div class="container container-narrow">
        <?php gk_breadcrumbs(); ?>
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article class="reveal-item" style="margin-bottom: 2.5rem;">
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                <div style="font-size: var(--fs-sm); color: var(--ink-soft); margin-top: 0.5rem; margin-bottom: 1rem;">
                    <?php echo get_the_date(); ?>
                </div>
                <div><?php the_excerpt(); ?></div>
            </article>
        <?php endwhile; endif; ?>
    </div>
</section>
<?php
get_footer();
