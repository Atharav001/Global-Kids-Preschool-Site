<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
</head>
<body <?php body_class('has-sticky-bar'); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main-content"><?php esc_html_e('Skip to main content', 'gk-theme'); ?></a>

<?php
if (gk_setting('announce_enabled')) {
    get_template_part('template-parts/header/announcement-bar');
}
get_template_part('template-parts/header/site-header');
get_template_part('template-parts/header/mobile-menu');
?>

<main id="main-content" tabindex="-1">
