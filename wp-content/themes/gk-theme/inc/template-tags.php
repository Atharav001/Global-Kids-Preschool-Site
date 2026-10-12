<?php
/**
 * Template Tags & Helpers
 */

if (!defined('ABSPATH')) {
    exit;
}

// Fallback gk_setting if gk-core is temporarily disabled
if (!function_exists('gk_setting')) {
    function gk_setting($key, $default = '') {
        $settings = get_option('gk_settings', []);
        return isset($settings[$key]) && $settings[$key] !== '' ? $settings[$key] : $default;
    }
}

// WhatsApp link helper
if (!function_exists('gk_whatsapp_link')) {
    function gk_whatsapp_link($custom_msg = '') {
        $number = gk_setting('whatsapp_e164', '919876543210');
        $msg = $custom_msg ?: gk_setting('whatsapp_default_msg', 'Hello Global Kids Preschool! I would like to enquire about admission and book a campus visit.');
        return 'https://wa.me/' . preg_replace('/[^0-9]/', '', $number) . '?text=' . rawurlencode($msg);
    }
}

// Phone link helper
if (!function_exists('gk_phone_link')) {
    function gk_phone_link() {
        $number = gk_setting('phone_e164', '+919876543210');
        return 'tel:' . esc_attr($number);
    }
}

// Rating display check helper
if (!function_exists('gk_has_rating')) {
    function gk_has_rating() {
        return gk_setting('google_rating') && gk_setting('google_review_count') && gk_setting('google_review_url');
    }
}

// Breadcrumbs output
function gk_breadcrumbs() {
    if (is_front_page()) return;

    echo '<nav aria-label="Breadcrumb" class="breadcrumbs">';
    echo '<a href="' . esc_url(home_url('/')) . '">' . esc_html__('Home', 'gk-theme') . '</a>';
    echo '<span aria-hidden="true">›</span>';

    if (is_singular('gk_programme')) {
        echo '<a href="' . esc_url(home_url('/programmes/')) . '">' . esc_html__('Programmes', 'gk-theme') . '</a>';
        echo '<span aria-hidden="true">›</span>';
        echo '<span class="current" aria-current="page">' . esc_html(get_the_title()) . '</span>';
    } elseif (is_singular('gk_album')) {
        echo '<a href="' . esc_url(home_url('/gallery/')) . '">' . esc_html__('Gallery', 'gk-theme') . '</a>';
        echo '<span aria-hidden="true">›</span>';
        echo '<span class="current" aria-current="page">' . esc_html(get_the_title()) . '</span>';
    } elseif (is_page()) {
        echo '<span class="current" aria-current="page">' . esc_html(get_the_title()) . '</span>';
    } elseif (is_404()) {
        echo '<span class="current" aria-current="page">' . esc_html__('Page Not Found', 'gk-theme') . '</span>';
    }
    echo '</nav>';
}

// Wave divider SVG generator
function gk_render_wave_divider($fill_color = '#FFF8EC', $flip = false) {
    $transform = $flip ? 'transform="rotate(180 600 24)"' : '';
    return '<div class="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
            <path ' . $transform . ' d="M0,0 C150,38 350,48 600,24 C850,0 1050,36 1200,24 L1200,48 L0,48 Z" fill="' . esc_attr($fill_color) . '"></path>
        </svg>
    </div>';
}
