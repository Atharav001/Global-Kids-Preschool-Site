<?php
/**
 * SEO & Structured Data (JSON-LD) Output
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_render_local_business_schema() {
    if (is_admin()) {
        return;
    }

    $schema = [
        '@context'        => 'https://schema.org',
        '@type'           => 'Preschool',
        'name'            => gk_setting('school_name', 'Global Kids Preschool'),
        'description'     => gk_setting('tagline', 'Where Joy Meets Early Learning'),
        'url'             => home_url('/'),
        'telephone'       => gk_setting('phone_e164', '+919876543210'),
        'email'           => gk_setting('email', 'admissions@globalkids.edu.in'),
        'address'         => [
            '@type'           => 'PostalAddress',
            'streetAddress'   => gk_setting('address_line1', '124, 4th Main Road, Annanagar West'),
            'addressLocality' => gk_setting('city', 'Chennai'),
            'addressRegion'   => gk_setting('state', 'Tamil Nadu'),
            'postalCode'      => gk_setting('pincode', '600040'),
            'addressCountry'  => 'IN'
        ],
        'geo'             => [
            '@type'     => 'GeoCoordinates',
            'latitude'  => (float) gk_setting('lat', '13.0850'),
            'longitude' => (float) gk_setting('lng', '80.2101')
        ],
        'openingHours'    => 'Mo-Fr 08:30-18:30, Sa 09:00-13:00'
    ];

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
}
add_action('wp_head', 'gk_render_local_business_schema');
