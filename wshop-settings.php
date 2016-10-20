<?php

	/*
	 * admin Scripts and styles for plugin
	 */
	function wshop_admin_style() {
        wp_register_style( 'wshop_css', pp() . '/css/wshop.admin.css' );
        wp_register_script( 'wshop_js', pp() . '/js/wshop.admin.js' );

        if ( is_admin() ) {
            wp_enqueue_style( 'wshop_css');
            wp_enqueue_script( 'wshop_js');
        }
    }
    add_action( 'admin_init', 'wshop_admin_style' );


    /* Call Settings Page */
    function wshop_settings_page() {

    ?>

		<div class="wrap">
			<h2>wp-shopify Options</h2>
			<form action="options.php" method="post" id="wshop_settings">
				<?php settings_fields('wshop_settings'); ?>
				<table class="form-table">
					<tbody>
						<tr valign="top">
							<th scope="row"><label for="wshop_api_key">API Key:</label></th>
							<td>
								<input name="wshop_api_key" type="text" title="" id="wshop_api_key" value="<?php echo get_option('wshop_api_key'); ?>">
							</td>
                        </tr>
						<tr valign="top">
							<th scope="row"><label for="wshop_domain">Custom Shopify Domain:</label></th>
							<td>
								<input name="wshop_domain" type="text" title="" id="wshop_domain" value="<?php echo get_option('wshop_domain'); ?>">
							</td>
                        </tr>
						<tr valign="top">
							<th scope="row"><label for="wshop_app_id">App ID:</label></th>
							<td>
								<input name="wshop_app_id" type="text" title="" id="wshop_app_id" value="<?php echo get_option('wshop_app_id'); ?>">
							</td>
                        </tr>
					</tbody>
				</table>
				<p class="submit">
					<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
				</p>
			</form>
		</div><!-- END Wrap -->

		<?php
    }

    /* Save Takeover Settings */
    function wshop_settings_init(){
        register_setting('wshop_settings', 'wshop_api_key');
        register_setting('wshop_settings', 'wshop_domain');
        register_setting('wshop_settings', 'wshop_app_id');
    }
    add_action('admin_init', 'wshop_settings_init');

    function wshop_add_settings() {
        add_submenu_page( 'tools.php', 'Shopify', 'Shopify', 'manage_options', 'wshop_settings', 'wshop_settings_page' );
    }

    add_action('admin_menu','wshop_add_settings');


?>