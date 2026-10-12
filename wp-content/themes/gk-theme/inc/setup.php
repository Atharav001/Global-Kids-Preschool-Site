<?php
/**
 * Theme Setup and Configuration
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_theme_setup() {
    // Theme Supports
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', [
        'comment-list',
        'comment-form',
        'search-form',
        'gallery',
        'caption',
        'style',
        'script'
    ]);
    add_theme_support('editor-styles');
    add_editor_style('assets/src/css/main.css');

    // Register Navigation Menus
    register_nav_menus([
        'primary' => __('Primary Navigation', 'gk-theme'),
        'footer'  => __('Footer Navigation', 'gk-theme'),
        'legal'   => __('Legal Links', 'gk-theme')
    ]);

    // Image Sizes per PRD/ARCHITECTURE
    add_image_size('gk-hero', 1600, 900, true);
    add_image_size('gk-card', 640, 480, true);
    add_image_size('gk-square', 600, 600, true);
}
add_action('after_setup_theme', 'gk_theme_setup');
