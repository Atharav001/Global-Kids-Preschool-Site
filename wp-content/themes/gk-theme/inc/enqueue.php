<?php
/**
 * Asset Enqueuing & Optimization
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_theme_scripts() {
    $theme_version = '1.0.0';

    // Google Fonts (Plus Jakarta Sans for headings, Inter for body) with swap
    wp_enqueue_style(
        'gk-google-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
        [],
        null
    );

    // Main Design System Stylesheet
    wp_enqueue_style(
        'gk-main-styles',
        get_template_directory_uri() . '/assets/src/css/main.css',
        [],
        $theme_version
    );

    // Main Client Script (Deferred)
    wp_enqueue_script(
        'gk-main-script',
        get_template_directory_uri() . '/assets/src/js/main.js',
        [],
        $theme_version,
        true // in_footer = true for deferral
    );

    // Clean up unnecessary front-end scripts (No jQuery on frontend)
    if (!is_admin()) {
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
        wp_deregister_script('jquery');
    }
}
add_action('wp_enqueue_scripts', 'gk_theme_scripts');

// Add module/defer attribute
function gk_defer_script_loader($tag, $handle, $src) {
    if ('gk-main-script' === $handle) {
        return '<script src="' . esc_url($src) . '" defer id="' . esc_attr($handle) . '-js"></script>';
    }
    return $tag;
}
add_filter('script_loader_tag', 'gk_defer_script_loader', 10, 3);
