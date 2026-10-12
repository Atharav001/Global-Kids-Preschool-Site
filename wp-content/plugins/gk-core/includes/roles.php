<?php
/**
 * Role & Capability Management
 */

if (!defined('ABSPATH')) {
    exit;
}

function gk_register_school_admin_role() {
    $editor_role = get_role('editor');
    $caps = $editor_role ? $editor_role->capabilities : [];

    // Grant school settings & enquiry viewing
    $caps['manage_gk_settings'] = true;
    $caps['manage_gk_enquiries'] = true;

    // Explicitly disallow theme/plugin installation & user management
    $caps['install_plugins'] = false;
    $caps['activate_plugins'] = false;
    $caps['edit_plugins'] = false;
    $caps['install_themes'] = false;
    $caps['switch_themes'] = false;
    $caps['edit_themes'] = false;
    $caps['edit_users'] = false;
    $caps['create_users'] = false;

    add_role('gk_school_admin', __('School Admin', 'gk-core'), $caps);

    // Also ensure site administrator has these capabilities
    $admin_role = get_role('administrator');
    if ($admin_role) {
        $admin_role->add_cap('manage_gk_settings');
        $admin_role->add_cap('manage_gk_enquiries');
    }
}
