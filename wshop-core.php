<?php

/*
 * Add Custom Post Type 'Product'
 */
    function wshop_create_custom_post() {

        $labels = array(
            'name'                  => 'Products',
            'all_items'             => 'All Products',
            'singular_name'         => 'Product',
            'add_new'               => 'Add New Product',
            'add_new_item'          => 'Add New Product',
            'edit_item'             => 'Edit Product',
            'new_item'              => 'New Product',
            'view_item'             => 'View Product',
            'search_items'          => 'Search Products',
            'not_found'             => 'No products found',
            'not_found_in_trash'    => 'No products found in Trash'
        );

        $args = array(
            'labels'                => $labels,
            'public'                => true,
            'publicly_queryable'    => true,
            'capability_type'       => 'page',
            'menu_icon'             => 'dashicons-cart',
            'menu_position'         => 22,
            'hierarchical'          => true,
            'supports'              => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'revisions'
            ),
            'rewrite'               => array(
                'slug'  => get_option('wshop_rewrite_slug')
            )
        );

        register_post_type('wps-product', $args);

    }
    add_action('init', 'wshop_create_custom_post', 10);

/*
 * Enqueue Custom Scripts
 */
    function wshop_frontend_scripts() {
        wp_register_script('shopify-sdk', 'http://sdks.shopifycdn.com/js-buy-sdk/latest/shopify-buy.polyfilled.globals.min.js', 'jquery', '1.0');
        wp_register_script('wshop-main', pp() . '/js/wshop.js', 'jquery', '1.0');

        wp_enqueue_script('jquery');
        wp_enqueue_script('underscore');
        wp_enqueue_script('shopify-sdk', 'jquery');
        wp_enqueue_script('wshop-main', false, array('jquery', 'shopify-sdk'));

        // Setup JS variables in scripts
        wp_localize_script('wshop-main', 'wshopVars', array(
            'apiKey'            => get_option('wshop_api_key'),
            'domain'            => get_option('wshop_domain'),
            'appId'             => get_option('wshop_app_id')
        ));

    }
    add_action('wp_enqueue_scripts', 'wshop_frontend_scripts', 10);

/*
 * Add wshop underscore templates to
 * the footer of the theme
 */
    function wshop_underscore_templates() {

        // find all stock templates
        $paths_to_include = glob(WP_PLUGIN_DIR . '/wp-shopify/wshop-templates/*.php');

        // find all custom templates (defined in the current theme)
        $user_template_paths = glob(get_stylesheet_directory() . '/wshop-templates/*.php');

        // make sure there are some paths to find
        if( count($user_template_paths > 0) ){

            // loop through user-defined templates and replace any stock templates
            foreach( $user_template_paths as $custom_template_path ){

                // find the basename of the current custom template
                $basename = basename($custom_template_path);

                // create an array of just the stock template basenames
                $standard_basenames = array_map( function ($v){
                    return basename($v);
                }, $paths_to_include);

                // are we overriding a stock template?
                if( in_array($basename, $standard_basenames) ){

                    // find the stock template's index
                    $index = array_search($basename, $standard_basenames);

                    // replace the stock template with the custom one
                    $paths_to_include[$index] = $custom_template_path;

                } else {
                    // we're not overriding a stock template
                    // add the new custom template to the list of templates to include
                    $paths_to_include[] = $custom_template_path;
                }
            }
        }

        if( count($paths_to_include) > 0 ){

            // include each template file
            foreach( $paths_to_include as $path ){
                include($path);
            }

        }

    }
    add_action( 'wp_footer', 'wshop_underscore_templates', 100 );

/*
 *  Convenience functions for getting and echoing product ID
 */
    function get_the_product_id($post = 0){
        $post = get_post($post);
        $product_id = has_product() ? $post->_wshop_product_id : '';
        return $product_id;
    }

    function the_product_id($post = 0){
        echo get_the_product_id($post);
    }

/*
 * Convenience function for checking if a product exists on a page
 */
    function has_product($post = 0){
        $post = get_post($post);
        return isset( $post->_wshop_product_id ) and strlen( $post->_wshop_product_id );
    }