<?php
/**
 * Template Name: Style Guide (Internal QA Only)
 */

get_header();
?>
<section class="section" style="padding-top: 2rem;">
    <div class="container">
        <header class="section-header">
            <span class="eyebrow"><?php esc_html_e('Design System Verification', 'gk-theme'); ?></span>
            <h1><?php esc_html_e('Theme Tokens & Component Styleguide', 'gk-theme'); ?></h1>
            <p><?php esc_html_e('Visual audit page for WCAG 2.2 AA contrast, responsive typography, and component states.', 'gk-theme'); ?></p>
        </header>

        <article style="display: flex; flex-direction: column; gap: 3rem;">
            <!-- Color Tokens & Tints -->
            <div>
                <h2><?php esc_html_e('1. Brand Colors & Section Tints', 'gk-theme'); ?></h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="background: var(--bg); padding: 1.5rem; border-radius: var(--r-sm); border: 1px solid var(--line);">
                        <strong>--bg</strong><br><code>#FFF8EC</code>
                    </div>
                    <div style="background: var(--sun); color: var(--on-sun); padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--sun</strong><br><code>#FFC93C</code>
                    </div>
                    <div style="background: var(--blue); color: #fff; padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--blue</strong><br><code>#2A62D8</code>
                    </div>
                    <div style="background: var(--mint); color: #fff; padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--mint</strong><br><code>#2FA67A</code>
                    </div>
                    <div style="background: var(--coral); color: #fff; padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--coral</strong><br><code>#FF6B4A</code>
                    </div>
                    <div style="background: var(--lilac); color: #fff; padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--lilac</strong><br><code>#7C5CE0</code>
                    </div>
                    <div style="background: var(--ink); color: #fff; padding: 1.5rem; border-radius: var(--r-sm);">
                        <strong>--ink</strong><br><code>#2B2A35</code>
                    </div>
                </div>
            </div>

            <!-- Buttons -->
            <div>
                <h2><?php esc_html_e('2. Interactive Button States', 'gk-theme'); ?></h2>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; align-items: center;">
                    <a href="#test" class="btn btn-primary"><?php esc_html_e('Primary Action', 'gk-theme'); ?></a>
                    <a href="#test" class="btn btn-secondary"><?php esc_html_e('Secondary Action', 'gk-theme'); ?></a>
                    <a href="#test" class="btn btn-whatsapp"><?php esc_html_e('Chat on WhatsApp', 'gk-theme'); ?></a>
                    <a href="#test" class="btn btn-call"><?php esc_html_e('Direct Call', 'gk-theme'); ?></a>
                    <span class="sticker-badge"><?php esc_html_e('12+ Years Legacy', 'gk-theme'); ?></span>
                </div>
            </div>

            <!-- Typography Hierarchy -->
            <div>
                <h2><?php esc_html_e('3. Typography Scale (Fredoka + Nunito)', 'gk-theme'); ?></h2>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
                    <h1>H1 Display Heading (Fredoka 600)</h1>
                    <h2>H2 Section Title (Fredoka 600)</h2>
                    <h3>H3 Card Title (Fredoka 600)</h3>
                    <h4>H4 Feature Headline (Fredoka 600)</h4>
                    <p>Body prose text rendered with Nunito 400. Ensuring readability for parents and grandparents with optimized contrast ratio and 65ch line measure.</p>
                </div>
            </div>
        </article>
    </div>
</section>
<?php
get_footer();
