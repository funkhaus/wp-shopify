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

    // Define AJAX functions
    function wps_process_product(){

        $output = 'error';

        // Get the ID of the current Product
        $id = $_REQUEST['product_id'];
        // Get the title of the current Product
        $title = $_REQUEST['product_title'];

        // Find any existing Products that match the desired ID
        $args = array(
            'post_type'     => 'wps-product',
            'meta_key'      => '_wshop_product_id',
            'meta_value'    => $id

        );
        $posts = get_posts($args);

        if( count($posts) > 0 ){

            // We have a matching Product, so let's update it
            $post = $posts[0];
            $args = array(
                'ID'            => $post->ID,
                'post_title'    => $title,
                'post_name'     => strtolower($title)
            );
            wp_update_post($args);

        } else {
            echo 'none';
        }

    }

    add_action('wp_ajax_wps_process_product', 'wps_process_product');

?>