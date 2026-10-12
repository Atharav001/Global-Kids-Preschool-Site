<?php
/**
 * Custom Post Types & Taxonomies Registration
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_register_cpts() {
    // 1. Programmes CPT
    register_post_type('gk_programme', [
        'labels' => [
            'name'               => __('Programmes', 'gk-core'),
            'singular_name'      => __('Programme', 'gk-core'),
            'add_new_item'       => __('Add New Programme', 'gk-core'),
            'edit_item'          => __('Edit Programme', 'gk-core'),
        ],
        'public'             => true,
        'has_archive'        => 'programmes',
        'rewrite'            => ['slug' => 'programmes'],
        'menu_icon'          => 'dashicons-welcome-learn-more',
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt'],
        'show_in_rest'       => true,
    ]);

    // 2. Teachers / Educators CPT
    register_post_type('gk_teacher', [
        'labels' => [
            'name'               => __('Teachers & Staff', 'gk-core'),
            'singular_name'      => __('Teacher', 'gk-core'),
            'add_new_item'       => __('Add New Educator', 'gk-core'),
        ],
        'public'             => false,
        'show_ui'            => true,
        'menu_icon'          => 'dashicons-groups',
        'supports'           => ['title', 'thumbnail'],
        'show_in_rest'       => true,
    ]);

    // 3. Testimonials CPT
    register_post_type('gk_testimonial', [
        'labels' => [
            'name'               => __('Parent Reviews', 'gk-core'),
            'singular_name'      => __('Review', 'gk-core'),
            'add_new_item'       => __('Add Parent Review', 'gk-core'),
        ],
        'public'             => false,
        'show_ui'            => true,
        'menu_icon'          => 'dashicons-format-quote',
        'supports'           => ['title', 'editor'],
        'show_in_rest'       => true,
    ]);

    // 4. Albums / Galleries CPT
    register_post_type('gk_album', [
        'labels' => [
            'name'               => __('Photo Albums', 'gk-core'),
            'singular_name'      => __('Album', 'gk-core'),
            'add_new_item'       => __('Add New Photo Album', 'gk-core'),
        ],
        'public'             => true,
        'has_archive'        => 'gallery',
        'rewrite'            => ['slug' => 'gallery'],
        'menu_icon'          => 'dashicons-format-gallery',
        'supports'           => ['title', 'editor', 'thumbnail'],
        'show_in_rest'       => true,
    ]);

    // 5. FAQs CPT
    register_post_type('gk_faq', [
        'labels' => [
            'name'               => __('FAQs', 'gk-core'),
            'singular_name'      => __('FAQ', 'gk-core'),
            'add_new_item'       => __('Add New Question', 'gk-core'),
        ],
        'public'             => false,
        'show_ui'            => true,
        'menu_icon'          => 'dashicons-editor-help',
        'supports'           => ['title', 'editor'],
        'show_in_rest'       => true,
    ]);

    // FAQ Topics Taxonomy
    register_taxonomy('gk_faq_topic', ['gk_faq'], [
        'labels' => [
            'name'          => __('FAQ Topics', 'gk-core'),
            'singular_name' => __('Topic', 'gk-core'),
        ],
        'public'            => false,
        'show_ui'           => true,
        'hierarchical'      => true,
        'show_in_rest'      => true,
    ]);

    // 6. Enquiries CPT (Strictly Private & Child-Safe)
    register_post_type('gk_enquiry', [
        'labels' => [
            'name'               => __('Enquiries & Visits', 'gk-core'),
            'singular_name'      => __('Enquiry', 'gk-core'),
        ],
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => false, // NEVER expose enquiries via REST API
        'capability_type'    => 'post',
        'capabilities'       => [
            'create_posts' => 'do_not_allow', // Only submitted via form pipeline
        ],
        'map_meta_cap'       => true,
        'menu_icon'          => 'dashicons-email-alt',
        'supports'           => ['title'],
    ]);
}
add_action('init', 'gk_register_cpts');
