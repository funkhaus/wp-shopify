<?php

/*
 *
 *	Plugin Name: WP Shopify
 *	Plugin URI: http://funkhaus.us
 *	Description: Shopify + Wordpress
 *	Author: Funkhaus
 *	Version: 1.0
 *	Author URI: http://Funkhaus.us
 *	Requires at least: 3.8
 *
 */

    // get wp-shopify core and settings
    require_once('wshop-core.php');
    require_once('wshop-settings.php');

    // add metadata to attachments
    require_once('wshop-meta.php');

    // Helper function to get this directory
    if ( ! function_exists( 'pp' ) ) {
        function pp() {
            return plugin_dir_url( __FILE__ );
        }
    }

    // Set rewrite slug on first activation
    function set_wps_rewrite_slug(){
        if( get_option('wshop_rewrite_slug') == '' ){
            update_option( 'wshop_rewrite_slug', 'store' );
            flush_rewrite_rules();
        }
    }
    register_activation_hook( __FILE__, 'set_wps_rewrite_slug' );

?>