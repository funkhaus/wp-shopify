<?php

/*
 * Enqueue Custom Scripts
 */
    function wshop_frontend_scripts() {
        wp_register_script('shopify-sdk', 'http://sdks.shopifycdn.com/js-buy-sdk/latest/shopify-buy.polyfilled.globals.min.js', 'jquery', '1.0');
        wp_register_script('wshop-main', pp() . '/js/wshop.js', 'jquery', '1.0');

        wp_enqueue_script('jquery');
        wp_enqueue_script('underscore');
        wp_enqueue_script('shopify-sdk', 'jquery');
        wp_enqueue_script('wshop-main', array('jquery', 'shopify-sdk'));

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

        // default template
        $template = 'wshop-templates/cart-line-item.php';

        // check for theme-defined template
        if ( locate_template('wshop-templates/cart-line-item.php') ){
            $template = locate_template('wshop-templates/cart-line-item.php');
        }

        include($template);
    }
    add_action( 'wp_footer', 'wshop_underscore_templates', 100 );

/*
 *  Convenience functions for getting and echoing product ID
 */
    function get_the_product_id($post = 0){
        $post = get_post($post);
        $product_id = isset( $post->_wshop_product_id ) ? '' : $post->_wshop_product_id;
        return $product_id;
    }

    function the_product_id($post = 0){
        echo get_the_product_id($post);
    }