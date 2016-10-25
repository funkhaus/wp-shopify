<?php

/*
 * Add custom metabox to the new/edit page
 */
    function wshop_add_page_metaboxes(){
        add_meta_box('wshop_product_meta', 'Product Meta', 'wshop_product_meta', 'wp-shopify-product', 'normal', 'low');
    }
    add_action('add_meta_boxes', 'wshop_add_page_metaboxes');

    // add meta box to pages
    function wshop_product_meta() {
        global $post;
        ?>
            <div class="custom-meta">
                <label for="product-id">Enter the product ID for this page:</label>
                <input id="product-id" class="short" title="This is needed for all product pages" name="_wshop_product_id" type="text" value="<?php echo $post->_wshop_product_id; ?>">
                <br/>

            </div>

        <?php
    }

/*
 * Save the metabox vaule
 */
    function wshop_save_metabox($post_id){
        // check autosave
        if( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {
            return $post_id;
        }
        if( isset($_POST['_wshop_product_id']) ) {
            update_post_meta($post_id, '_wshop_product_id', $_POST['_wshop_product_id']);
        }
    }
    add_action('save_post', 'wshop_save_metabox');