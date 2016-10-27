<?php

/*
 *
 *	Plugin Name: WP Shopify
 *	Plugin URI: http://funkhaus.us
 *	Description: Shopify + Wordpress
 *	Author: Funkhaus
 *	Version: 1.1
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

        // Get the ID of the current Product
        $id = $_REQUEST['product_id'];
        // Get the title of the current Product
        $title = $_REQUEST['product_title'];
        // Get refresh options
        $auto_publish = $_REQUEST['auto_publish'] == 'true';
        $auto_delete = $_REQUEST['auto_delete'] == 'true';

        $output = 'Error processing Product ' . $title . '!';

        // Find any existing Products that match the desired ID
        $args = array(
            'posts_per_page'    => -1,
            'post_type'         => 'wps-product',
            'meta_key'          => '_wshop_product_id',
            'meta_value'        => $id,
            'post_status'       => 'publish,private,draft,future,pending'
        );
        $posts = get_posts($args);

        if( count($posts) > 0 ){

            // We have a matching Product, so let's update it
            $post = $posts[0];
            $args = array(
                'ID'            => $post->ID,
                'post_title'    => $title,
                'post_name'     => sanitize_title( $title, strtolower($title) )
            );
            wp_update_post($args);

            $output = 'Updated existing Product ' . $title . '.';

        } else {

            // No matching Product, so let's create one
            $args = array(
                'post_title'    => $title,
                'post_type'     => 'wps-product',
                'post_status'   => $auto_publish ? 'publish' : 'pending',
                'meta_input'    => array(
                    '_wshop_product_id' => $id
                )
            );
            wp_insert_post($args);

            $output = 'Added new Product ' . $title . '.';

        }

        $output .= ' {ID:' . $id . '}';

        echo $output;

        die();

    }

    add_action('wp_ajax_wps_process_product', 'wps_process_product');

    function wps_get_all_products(){

        // Get all Products
        $args = array(
            'posts_per_page'    => -1,
            'post_type'         => 'wps-product',
            'post_status'       => 'publish'
        );
        $posts = get_posts($args);

        $output = array();

        // Create an array of WP post IDs and their attached product IDs
        foreach( $posts as $post ){
            $output[] = array(
                'wp_id'         => $post->ID,
                'product_id'    => get_post_meta($post->ID, '_wshop_product_id', true)
            );
        }

        echo json_encode($output);

        die();

    }

    add_action('wp_ajax_wps_get_all_products', 'wps_get_all_products');

    function wps_remove_products(){

        $posts_to_remove = explode(',', $_REQUEST['to_remove']);

        // Remove a list of Products
        foreach( $posts_to_remove as $id_to_remove ){
            echo $id_to_remove;

            wp_delete_post( $id_to_remove );
        }

        die();

    }

    add_action('wp_ajax_wps_remove_products', 'wps_remove_products');

?>