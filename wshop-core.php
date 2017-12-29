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
            'has_archive'           => true,
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
 * Add custom taxonomy
 */
    function wshop_create_custom_taxonomy(){

        $labels = array(
    		'name'              => _x( 'Collections', 'taxonomy general name', 'textdomain' ),
    		'singular_name'     => _x( 'Collection', 'taxonomy singular name', 'textdomain' ),
    		'search_items'      => __( 'Search Collections', 'textdomain' ),
    		'all_items'         => __( 'All Collections', 'textdomain' ),
    		'parent_item'       => __( 'Parent Collection', 'textdomain' ),
    		'parent_item_colon' => __( 'Parent Collection:', 'textdomain' ),
    		'edit_item'         => __( 'Edit Collection', 'textdomain' ),
    		'update_item'       => __( 'Update Collection', 'textdomain' ),
    		'add_new_item'      => __( 'Add New Collection', 'textdomain' ),
    		'new_item_name'     => __( 'New Collection Name', 'textdomain' ),
    		'menu_name'         => __( 'Collections', 'textdomain' ),
    	);

    	$args = array(
    		'hierarchical'      => true,
    		'labels'            => $labels,
    		'show_ui'           => true,
    		'show_admin_column' => true,
    		'query_var'         => true,
    		'rewrite'           => array( 'slug' => get_option('wshop_collections_slug') ),
    	);

        register_taxonomy( 'wps_collection', 'wps-product', $args );

    }
    add_action('init', 'wshop_create_custom_taxonomy', 10);

/*
 * Make sure products are sorted by menu order */
     function sort_wps_products($q) {
         if(!$q->is_main_query() || is_admin())
             return;

         if(
             !is_post_type_archive('wps-product') &&
             !is_tax(array('wps_collection'))
         ) return;
         $q->set('orderby', 'menu_order');
         $q->set('order', 'ASC');
     }
     add_action('parse_query', 'sort_wps_products');

/*
 * Enqueue Custom Scripts
 */
    function wshop_frontend_scripts() {
        wp_register_script('shopify-sdk', '//sdks.shopifycdn.com/js-buy-sdk/latest/shopify-buy.polyfilled.globals.min.js', 'jquery', '1.0');
        wp_register_script('wshop-main', pp() . '/js/bundle.js', array(), '1.0');

        wp_enqueue_script('jquery');
        wp_enqueue_script('shopify-sdk', 'jquery');
        wp_enqueue_script('wshop-main', false, array('shopify-sdk'));

        // Setup JS variables in scripts
        wp_localize_script('wshop-main', 'wshopVars', array(
            'accessToken'       => get_option('wshop_api_key'),
            'domain'            => get_option('wshop_domain'),
            'appId'             => get_option('wshop_app_id')
        ));

    }
    add_action('wp_enqueue_scripts', 'wshop_frontend_scripts', 10);

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
