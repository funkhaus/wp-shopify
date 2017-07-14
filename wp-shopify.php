<?php

/*
 *
 *	Plugin Name: WP Shopify
 *	Plugin URI: https://github.com/funkhaus/wp-shopify
 *	Description: Shopify + Wordpress
 *	Author: Funkhaus
 *	Version: 2.0
 *	Author URI: http://funkhaus.us
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
            update_option( 'wshop_collections_slug', 'collections' );
            flush_rewrite_rules();
        }
    }

    register_activation_hook( __FILE__, 'set_wps_rewrite_slug' );

    // Define AJAX functions
    function wps_process_product(){

        // Get the ID of the current Product
        $id = $_POST['product_id'];
        // Get the title of the current Product
        $title = $_POST['product_title'];
        // Get refresh options
        $auto_publish = $_POST['auto_publish'] == 'true';

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
            $target_post = $posts[0];
            $args = array(
                'ID'            => $target_post->ID,
                'post_title'    => $title,
                'post_name'     => sanitize_title( $title, strtolower($title) )
            );
            wp_update_post($args);

            // Remove all terms from this product (we'll re-add them in wps_add_term below)
            wp_set_object_terms( $target_post->ID, '', 'wps_collection' );

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
            $post_id = wp_insert_post($args);

            global $wp_version;
            if( $wp_version < 4.4 and $post_id != 0){
                // Update meta field for ID (for older WP installs)
                update_post_meta( $post_id, '_wshop_product_id', $id );
            }

            $output = 'Added new Product ' . $title . ' (ID: ' . $id . ').';

        }

        $output = array(
            'message'       => $output,
            'id'            => $id
        );

        echo json_encode($output);

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
        foreach( $posts as $target_post ){
            $output[] = array(
                'wp_id'         => $target_post->ID,
                'product_id'    => get_post_meta($target_post->ID, '_wshop_product_id', true)
            );
        }

        echo json_encode($output);

        die();

    }

    add_action('wp_ajax_wps_get_all_products', 'wps_get_all_products');

    function wps_remove_products(){

        $posts_to_remove = explode(',', $_POST['to_remove']);

        // Remove a list of Products
        foreach( $posts_to_remove as $id_to_remove ){
            echo $id_to_remove;

            wp_delete_post( $id_to_remove );
        }

        die();

    }

    add_action('wp_ajax_wps_remove_products', 'wps_remove_products');

    function wps_process_term(){

        $title = $_POST['title'];
        $slug = $_POST['slug'];
        $description = $_POST['description'];
        $image = $_POST['image'];

        $term = get_term_by('slug', $slug, 'wps_collection');

        if( $term ){

            wp_update_term( $term->ID, 'wps_collection', array(
                'name'          => $title,
                'slug'          => $slug,
                'description'   => $description
            ));

            echo 'Updated collection ' . $title . '.';

        } else {

            $term = wp_insert_term(
                $title,
                'wps_collection',
                array(
                    'description'   => $description,
                    'slug'          => $slug,
                )
            );



            echo 'Created collection ' . $title . '.';
        }

        // Insert featured image meta
        update_term_meta( $term->term_id, '_wps_collection_image', $image );

        die();

    }

    add_action('wp_ajax_wps_process_term', 'wps_process_term');

    // Add terms to specified products
    function wps_add_term(){


        // Product IDs
        $ids = $_POST['ids'];
        $slug = $_POST['slug'];
        $title = $_POST['title'];

        if( !$ids ){
            echo '<li>No products in collection ' . $title . ' found, continuing...</li>';
            die();
        }

        $ids = explode(',', $ids);
        $term = get_term_by('slug', $slug, 'wps_collection');

        foreach( $ids as $id ){

            $args = array(
            	'posts_per_page'    => 1,
            	'post_type'         => 'wps-product',
            	'meta_key'          => '_wshop_product_id',
            	'meta_value'        => $id
            );
            $target_post = reset(get_posts( $args ));

            wp_set_object_terms( $target_post->ID, $slug, 'wps_collection', true );

            echo '<li>Added collection ' . $title . ' to product ' . $target_post->post_title . '...</li>';

        }

        die();

    }

    add_action('wp_ajax_wps_add_term', 'wps_add_term');



?>
