<?php
/**
 * Plugin Name: Global Kids Core Companion
 * Plugin URI: https://globalkids.edu.in
 * Description: Core business logic, custom post types, settings, form processing, child-data safety rules, and security hardening for Global Kids Preschool.
 * Version: 1.0.0
 * Author: Developer for Global Kids Preschool
 * Author URI: https://globalkids.edu.in
 * Text Domain: gk-core
 * Requires at least: 6.2
 * Requires PHP: 8.1
 */

if (!defined('ABSPATH')) {
    exit;
}

define('GK_CORE_VERSION', '1.0.0');
define('GK_CORE_PATH', plugin_dir_path(__FILE__));
define('GK_CORE_URL', plugin_dir_url(__FILE__));

// Load core modules
require_once GK_CORE_PATH . 'includes/settings.php';
require_once GK_CORE_PATH . 'includes/roles.php';
require_once GK_CORE_PATH . 'includes/cpt.php';
require_once GK_CORE_PATH . 'includes/meta-boxes.php';
require_once GK_CORE_PATH . 'includes/hardening.php';
require_once GK_CORE_PATH . 'includes/form.php';
require_once GK_CORE_PATH . 'includes/schema.php';
require_once GK_CORE_PATH . 'includes/consent.php';

// Activation hook
function gk_core_activate() {
    gk_register_cpts();
    gk_register_school_admin_role();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'gk_core_activate');

// Deactivation hook
function gk_core_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'gk_core_deactivate');
