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

    // get funkstagram core and settings
    require_once('wshop-core.php');
    require_once('wshop-settings.php');

    // add metadata to attachments
    require_once('wshop-meta.php');

    // Link function to admin-ajax
    // add_action( 'wp_ajax_funkstagram_import', 'funkstagram_import' );
    // add_action( 'wp_ajax_nopriv_funkstagram_import', 'funkstagram_import' );

    // Helper function to get this directory
    if ( ! function_exists( 'pp' ) ) {
        function pp() {
            return plugin_dir_url( __FILE__ );
        }
    }

?>