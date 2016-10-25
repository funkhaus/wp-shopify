<?php

    $auto_approve = ( ! empty($_POST['auto_approve']) and $_POST['auto_approve'] );

    wp_register_script('shopify-sdk', 'http://sdks.shopifycdn.com/js-buy-sdk/latest/shopify-buy.polyfilled.globals.min.js', 'jquery', '1.0');
    wp_register_script('wshop-refresh', pp() . '/js/wshop.refresh.js');

    wp_enqueue_script('shopify-sdk');
    wp_enqueue_script('wshop-refresh');

    wp_localize_script('wshop-refresh', 'wshopVars', array(
        'apiKey'            => get_option('wshop_api_key'),
        'domain'            => get_option('wshop_domain'),
        'appId'             => get_option('wshop_app_id'),
        'autoApprove'       => $auto_approve
    ));

?>