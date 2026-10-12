<?php
/**
 * Programmes Archive Template
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <?php gk_breadcrumbs(); ?>
        <header class="section-header reveal-item">
            <span class="eyebrow"><?php esc_html_e('Academic & Play Framework', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('Early Childhood Programmes for Ages 1.5 to 6', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('Curriculums specifically calibrated for sensory, emotional, linguistic, and cognitive milestones.', 'gk-theme'); ?></p>
        </header>

        <div class="cards-grid" style="margin-top: 3rem;">
            <?php if (have_posts()) : while (have_posts()) : the_post();
                $age_from = get_post_meta(get_the_ID(), '_gk_age_from', true);
                $age_to = get_post_meta(get_the_ID(), '_gk_age_to', true);
                ?>
                <a href="<?php the_permalink(); ?>" class="programme-card reveal-item">
                    <div class="programme-body">
                        <span class="programme-chip"><?php printf(esc_html__('%s – %s', 'gk-theme'), esc_html($age_from), esc_html($age_to)); ?></span>
                        <h2 class="programme-title" style="font-size: var(--fs-lg);"><?php the_title(); ?></h2>
                        <p class="programme-summary"><?php echo esc_html(get_the_excerpt()); ?></p>
                        <span class="programme-cta"><?php esc_html_e('Explore schedule & details →', 'gk-theme'); ?></span>
                    </div>
                </a>
            <?php endwhile; endif; ?>
        </div>
    </div>
</section>
<?php
get_footer();
