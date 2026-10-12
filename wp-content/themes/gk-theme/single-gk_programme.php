<?php
/**
 * Single Programme Template
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
        <?php gk_breadcrumbs(); ?>
        <?php while (have_posts()) : the_post();
            $age_from = get_post_meta(get_the_ID(), '_gk_age_from', true);
            $age_to = get_post_meta(get_the_ID(), '_gk_age_to', true);
            $timings = get_post_meta(get_the_ID(), '_gk_timings', true);
            $ratio = get_post_meta(get_the_ID(), '_gk_ratio', true);
            ?>
            <article class="reveal-item">
                <span class="eyebrow"><?php esc_html_e('Curriculum & Schedule', 'gk-theme'); ?></span>
                <h1><?php the_title(); ?></h1>
                
                <div style="display: flex; gap: 1rem; margin-top: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    <span class="sticker-badge"><?php printf(esc_html__('Age: %s to %s', 'gk-theme'), esc_html($age_from), esc_html($age_to)); ?></span>
                    <span class="sticker-badge rotate-right"><?php printf(esc_html__('Timings: %s', 'gk-theme'), esc_html($timings)); ?></span>
                    <span class="sticker-badge"><?php printf(esc_html__('Ratio: %s', 'gk-theme'), esc_html($ratio)); ?></span>
                </div>

                <div style="font-size: var(--fs-base); line-height: var(--lh-body); margin-bottom: 2rem;">
                    <?php the_content(); ?>
                </div>

                <div class="cta-band" style="margin-top: 3rem;">
                    <h2><?php printf(esc_html__('Schedule a Campus Visit for %s', 'gk-theme'), esc_html(get_the_title())); ?></h2>
                    <p><?php esc_html_e('Meet the educators, observe learning spaces, and review the developmental prospectus.', 'gk-theme'); ?></p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                        <a href="<?php echo esc_url(home_url('/admissions/?programme=' . rawurlencode(get_the_title()) . '#visit')); ?>" class="btn btn-primary">
                            <?php esc_html_e('Book a Visit', 'gk-theme'); ?>
                        </a>
                        <a href="<?php echo esc_url(gk_whatsapp_link('Hi! I would like to schedule a visit for ' . get_the_title())); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                            <?php esc_html_e('Chat on WhatsApp', 'gk-theme'); ?>
                        </a>
                    </div>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</section>
<?php
get_footer();
