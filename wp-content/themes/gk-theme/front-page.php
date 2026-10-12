<?php
/**
 * Front Page Template
 */

get_header();
?>
<!-- Hero Section -->
<section class="section" style="padding-top: 2rem;">
    <div class="container hero-grid">
        <div class="hero-content reveal-item">
            <span class="eyebrow"><?php printf(esc_html__('Preschool in %s, %s', 'gk-theme'), esc_html(gk_setting('area', 'Annanagar West')), esc_html(gk_setting('city', 'Chennai'))); ?></span>
            <h1><?php esc_html_e('Where Early Curiosity Turns into', 'gk-theme'); ?> <span class="highlight-squiggle"><?php esc_html_e('Lifelong Wonder', 'gk-theme'); ?><svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="var(--sun)" stroke-width="4" stroke-linecap="round"/></svg></span></h1>
            <p><?php esc_html_e('A warm, child-centered preschool and daycare providing evidence-backed early childhood education, patient guidance, and 100% child-safe premises.', 'gk-theme'); ?></p>
            <div class="hero-actions">
                <a href="<?php echo esc_url(home_url('/admissions/#visit')); ?>" class="btn btn-primary"><?php esc_html_e('Book a School Visit', 'gk-theme'); ?></a>
                <a href="<?php echo esc_url(gk_whatsapp_link()); ?>" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Chat on WhatsApp', 'gk-theme'); ?></a>
            </div>
            <?php if (gk_has_rating()): ?>
            <div class="hero-micro-proof">
                <span style="color: #F7B500; font-size: 1.2rem;">★★★★★</span>
                <strong><?php echo esc_html(gk_setting('google_rating')); ?> <?php esc_html_e('on Google', 'gk-theme'); ?></strong>
                <span>(<?php echo esc_html(gk_setting('google_review_count')); ?> <?php esc_html_e('verified parent reviews', 'gk-theme'); ?>)</span>
            </div>
            <?php endif; ?>
        </div>
        <div class="hero-media-wrapper reveal-item">
            <img class="hero-blob-image" src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80" alt="<?php esc_attr_e('Children exploring sensory blocks in cheerful classroom', 'gk-theme'); ?>" fetchpriority="high" width="800" height="600">
            <span class="sticker-badge hero-sticker-1"><?php printf(esc_html__('%s Years of Joyful Care', 'gk-theme'), esc_html(gk_setting('years_running', '12+'))); ?></span>
            <span class="sticker-badge hero-sticker-2 rotate-right"><?php echo esc_html(gk_setting('ratio_text', '1:8 Educator Ratio')); ?></span>
        </div>
    </div>
</section>

<!-- Trust Strip Overlap -->
<div class="container trust-strip-wrapper">
    <div class="trust-strip-card reveal-item">
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('years_running', '12+')); ?></span>
            <span class="trust-label"><?php esc_html_e('Years of Early Learning', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('children_taught', '1200+')); ?></span>
            <span class="trust-label"><?php esc_html_e('Happy Little Alumni', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('ratio_text', '1:8')); ?></span>
            <span class="trust-label"><?php esc_html_e('Attentive Child-Educator Ratio', 'gk-theme'); ?></span>
        </div>
        <div class="trust-item">
            <span class="trust-number"><?php echo esc_html(gk_setting('google_rating', '4.9')); ?> ★</span>
            <span class="trust-label"><?php printf(esc_html__('Google Rating (%s Reviews)', 'gk-theme'), esc_html(gk_setting('google_review_count', '86'))); ?></span>
        </div>
    </div>
</div>

<!-- Programmes Section -->
<section class="section tint-sky" style="margin-top: 3rem;">
    <div class="container">
        <header class="section-header text-center reveal-item">
            <span class="eyebrow"><?php esc_html_e('Age-Appropriate Learning', 'gk-theme'); ?></span>
            <h2><?php esc_html_e('Thoughtfully Designed Early Programmes', 'gk-theme'); ?></h2>
            <p><?php esc_html_e('From gentle first toddler steps to confident primary school readiness, each programme nurtures holistic growth.', 'gk-theme'); ?></p>
        </header>
        <div class="cards-grid">
            <?php
            $programmes = new WP_Query([
                'post_type'      => 'gk_programme',
                'posts_per_page' => 4,
                'orderby'        => 'menu_order',
                'order'          => 'ASC'
            ]);
            if ($programmes->have_posts()) :
                while ($programmes->have_posts()) : $programmes->the_post();
                    $age_band = get_post_meta(get_the_ID(), '_gk_age_from', true) . ' – ' . get_post_meta(get_the_ID(), '_gk_age_to', true);
                    ?>
                    <a href="<?php the_permalink(); ?>" class="programme-card reveal-item">
                        <div class="programme-body">
                            <span class="programme-chip"><?php echo esc_html($age_band); ?></span>
                            <h3 class="programme-title"><?php the_title(); ?></h3>
                            <p class="programme-summary"><?php echo esc_html(get_the_excerpt()); ?></p>
                            <span class="programme-cta"><?php esc_html_e('Explore schedule & curriculum →', 'gk-theme'); ?></span>
                        </div>
                    </a>
                    <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
        <div style="text-align: center; margin-top: 2.5rem;">
            <a href="<?php echo esc_url(home_url('/programmes/')); ?>" class="btn btn-secondary"><?php esc_html_e('View All Programmes & Comparison Table', 'gk-theme'); ?></a>
        </div>
    </div>
</section>

<?php
get_footer();
