<?php
/**
 * Core Security Hardening Module
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Disable XML-RPC completely
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', '__return_empty_array');

// 2. Block anonymous user enumeration via REST API (/wp/v2/users)
function gk_block_rest_user_enumeration($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        $rest_route = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';
        if (strpos($rest_route, '/wp/v2/users') !== false) {
            return new WP_Error(
                'rest_user_enumeration_forbidden',
                __('User enumeration is forbidden for unauthenticated requests.', 'gk-core'),
                ['status' => 403]
            );
        }
    }
    return $result;
}
add_filter('rest_authentication_errors', 'gk_block_rest_user_enumeration');

// 3. Disable Author Archives (prevents ?author=1 discovery)
function gk_disable_author_archives() {
    if (is_author()) {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        nocache_headers();
    }
}
add_action('template_redirect', 'gk_disable_author_archives');

// 4. Hide WordPress Version in HTML & Feeds
add_filter('the_generator', '__return_empty_string');

// 5. Restrict Allowed Upload Mime Types (strictly forbid SVG execution)
function gk_restrict_upload_mimes($mimes) {
    // Whitelist only safe raster formats and PDFs
    $safe_mimes = [
        'jpg|jpeg|jpe' => 'image/jpeg',
        'png'          => 'image/png',
        'webp'         => 'image/webp',
        'avif'         => 'image/avif',
        'pdf'          => 'application/pdf',
    ];

    // Explicitly disallow SVG
    unset($mimes['svg'], $mimes['svgz']);

    return $safe_mimes;
}
add_filter('upload_mimes', 'gk_restrict_upload_mimes');
