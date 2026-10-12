<?php
/**
 * Generic Page Template
 */

get_header();
?>
<section class="section">
    <div class="container container-narrow">
        <?php gk_breadcrumbs(); ?>
        <?php while (have_posts()) : the_post(); ?>
            <header class="section-header reveal-item">
                <h1><?php the_title(); ?></h1>
            </header>
            <article class="reveal-item" style="line-height: var(--lh-body); font-size: var(--fs-base);">
                <?php the_content(); ?>
            </article>
        <?php endwhile; ?>
    </div>
</section>
<?php
get_footer();
