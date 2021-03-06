<?php

	/*
	 * admin Scripts and styles for plugin
	 */
	function wshop_admin_setup() {
        wp_register_script('wshop-js', pp() . '/js/bundle.js');
        //wp_register_script('shopify-sdk', '//sdks.shopifycdn.com/js-buy-sdk/latest/shopify-buy.polyfilled.globals.min.js', 'jquery', '1.0');


        if ( is_admin() ) {
            wp_enqueue_script('jquery');
            // wp_enqueue_script('shopify-sdk');
            // wp_enqueue_style( 'wshop_css');
            wp_enqueue_script('wshop-js', array('jquery'));

            wp_localize_script('wshop-js', 'wshopVars', array(
                'apiKey'                    => get_option('wshop_api_key'),
                'domain'                    => get_option('wshop_domain'),
                // 'appId'                     => get_option('wshop_app_id'),
                'processLink'               => get_admin_url(null, '/admin-ajax.php?action=wps_process_product'),
                'getAllProductsLink'        => get_admin_url(null, '/admin-ajax.php?action=wps_get_all_products'),
                'removeOldProductsLink'     => get_admin_url(null, '/admin-ajax.php?action=wps_remove_products'),
                'processTermLink'           => get_admin_url(null, '/admin-ajax.php?action=wps_process_term'),
                'addTermLink'               => get_admin_url(null, '/admin-ajax.php?action=wps_add_term')
            ));
        }
    }
    add_action( 'admin_init', 'wshop_admin_setup' );


    /* Call Settings Page */
    function wshop_settings_page() {

        flush_rewrite_rules();

    ?>

		<div class="wrap">
			<h2>wp-shopify Options</h2>
			<form action="options.php" method="post" id="wshop_settings">
				<?php settings_fields('wshop_settings'); ?>
				<table class="form-table">
					<tbody>
						<tr valign="top">
							<th scope="row"><label for="wshop_api_key">Storefront Access Token:</label></th>
							<td>
								<input name="wshop_api_key" type="text" title="" id="wshop_api_key" value="<?php echo get_option('wshop_api_key'); ?>">
							</td>
                        </tr>
						<tr valign="top">
							<th scope="row"><label for="wshop_domain">Shopify Domain:</label></th>
							<td>
								<input name="wshop_domain" type="text" title="" id="wshop_domain" value="<?php echo get_option('wshop_domain'); ?>">
							</td>
                        </tr>
						<!-- <tr valign="top">
							<th scope="row"><label for="wshop_app_id">App ID:</label></th>
							<td>
								<input name="wshop_app_id" type="text" title="" id="wshop_app_id" value="<?php echo get_option('wshop_app_id'); ?>">
							</td>
                        </tr> -->
                        <tr valign="top">
							<th scope="row"><label for="wshop_rename_slug">Store permalink:</label></th>
							<td>
								<input name="wshop_rewrite_slug" type="text" title="" id="wshop_rewrite_slug" value="<?php echo get_option('wshop_rewrite_slug'); ?>">
							</td>
                        </tr>
                        <tr valign="top">
							<th scope="row"><label for="wshop_collections_slug">Collections permalink:</label></th>
							<td>
								<input name="wshop_collections_slug" type="text" title="" id="wshop_collections_slug" value="<?php echo get_option('wshop_collections_slug'); ?>">
							</td>
                        </tr>
					</tbody>
				</table>
				<p class="submit">
					<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
				</p>
			</form>
		</div>

		<?php /* Only draw 'refresh' section if plugin is linked to Shopify store */ if( !empty(get_option('wshop_api_key')) and !empty(get_option('wshop_domain')) ) : ?>

    		<div class="refresh-wrap">
        		<h2>Refresh Products</h2>

        		<p>
            		Pull all products from Shopify, automatically updating existing Products and creating new ones.
        		</p>

                <form method="POST" id="refresh">
                    <?php wp_nonce_field('refresh-wshop'); ?>

                    <p class="auto-approve-wrap">
                        <input type="checkbox" name="auto_approve" value="1" id="auto_approve" checked>

                        <label for="auto_approve">Publish new products right away (set to Pending Review if unchecked)</label>
                    </p>

                    <p class="submit">
                        <input type="submit" name="refresh-button" id="wpshopify-refresh-button" class="button" value="Refresh Products">
                    </p>
                </form>

                <ul class="refresh-message">

                </ul>
            </div>

		<?php endif;

    }

    function remove_protocol( $domain ){
        $domain  = preg_replace('/^https?:\/\//', '', $domain);
        return $domain;
    }

    /* Save Takeover Settings */
    function wshop_settings_init(){
        register_setting('wshop_settings', 'wshop_api_key');
        register_setting('wshop_settings', 'wshop_domain', 'remove_protocol');
        // register_setting('wshop_settings', 'wshop_app_id');
        register_setting('wshop_settings', 'wshop_rewrite_slug');
        register_setting('wshop_settings', 'wshop_collections_slug');
    }
    add_action('admin_init', 'wshop_settings_init');

    function wshop_add_settings() {
        add_options_page( 'WP-Shopify', 'WP-Shopify', 'manage_options', 'wshop_settings', 'wshop_settings_page' );
    }

    add_action('admin_menu','wshop_add_settings');

?>
