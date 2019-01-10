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
            'capabilities' => array(
                // Removes support for the "Add New" function
                'create_posts'      => false,
            ),
            'map_meta_cap'          => true,
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

    // Set up custom metabox for product vendor

    function add_custom_product_metaboxes($post_type, $post) {
        add_meta_box('custom_product_vendor', 'Product Vendor', 'custom_product_vendor', 'wps-product', 'normal', 'low');
    }
    add_action('add_meta_boxes', 'add_custom_product_metaboxes', 10, 2);

    function custom_product_vendor() {
        global $post;

        ?>
            <div class="custom-meta">
                <label for="link-url">Enter The Product Vendor:</label>
                <input id="link-url" class="long" name="_custom_product_vendor" type="text" value="<?php echo $post->_custom_product_vendor; ?>">
            </div>

        <?php
    }

    function custom_save_product_metabox($post_id) {

        if( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {
            return $post_id;
        }

        if( isset($_POST["_custom_product_vendor"]) ) {
	        update_post_meta($post_id, "_custom_product_vendor", trim($_POST["_custom_product_vendor"]));
        }
    }
    add_action('save_post', 'custom_save_product_metabox');

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

/*
 * Convenience function for getting permalinks
 */
    function get_wshop_collections_slug(){
        return get_option('wshop_collections_slug');
    }
    function get_wshop_shop_slug(){
        return get_option('wshop_rewrite_slug');
    }
    function get_wshop_domain(){
        return get_option('wshop_domain');
    }
    function get_wshop_api_key(){
        return get_option('wshop_api_key');
    }

/*
 * Ajax endpoint for finding WP ID from product ID
 */
    function wps_get_wp_info_from_product_id(){
        $product_id = $_REQUEST['product_id'];

        $args = array(
        	'posts_per_page'   => 1,
        	'orderby'          => 'menu_order',
        	'order'            => 'ASC',
        	'meta_key'         => '_wshop_product_id',
        	'meta_value'       => $product_id,
        	'post_type'        => 'wps-product'
        );
        $target = get_posts($args);

        $result = array();

        if( empty($target) ){
            $result['status'] = 'Error! Product not found.';
        } else {
            $result = apply_filters('rez_serialize_object', reset($target));
        }

        echo json_encode($result);

        wp_die();
    }
    add_action( 'wp_ajax_wp_url_from_product_id', 'wps_get_wp_info_from_product_id' );
    add_action( 'wp_ajax_nopriv_wp_url_from_product_id', 'wps_get_wp_info_from_product_id' );
