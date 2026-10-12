<?php
/**
 * Announcement Bar Template Part
 */

$text = gk_setting('announce_text', 'Admissions open for Academic Year 2026–2027! Limited seats available.');
$url = gk_setting('announce_url', home_url('/admissions/'));
?>
<aside class="announcement-bar" role="complementary" aria-label="<?php esc_attr_e('School Announcement', 'gk-theme'); ?>">
    <div>
        <strong><?php esc_html_e('Notice:', 'gk-theme'); ?></strong>
        <span><?php echo esc_html($text); ?></span>
        <?php if ($url): ?>
            <a href="<?php echo esc_url($url); ?>"><?php esc_html_e('Learn more →', 'gk-theme'); ?></a>
        <?php endif; ?>
    </div>
    <button class="announcement-dismiss" type="button" aria-label="<?php esc_attr_e('Dismiss announcement', 'gk-theme'); ?>">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
</aside>
