<?php
/**
 * Security Headers & WordPress Front-End Hardening
 */

if (!defined('ABSPATH')) {
    exit;
}

// Clean up unnecessary WordPress headers and emojis
function gk_cleanup_wp_head() {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
}
add_action('init', 'gk_cleanup_wp_head');

// Security HTTP Headers
function gk_send_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('X-Frame-Options: SAMEORIGIN');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    }
}
add_action('send_headers', 'gk_send_security_headers');
