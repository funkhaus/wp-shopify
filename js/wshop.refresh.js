// Update existing products
// Create pages for new products
// Publish if auto_approve is set to 'true'

var wshopRefresh = {

    vars: wshopVars,
    shopClient: null,
    productsLeft: 0,

    init: function(){
        wshopRefresh.initShopify();
        wshopRefresh.initListener();
    },

    initListener: function(){

        jQuery('#refresh-button').on('click', function(e){
            e.preventDefault();

            // Cancel if already working
            if( jQuery('#refresh-button').hasClass('disabled') ) return;

            // Request all products from this user's shop
            wshopRefresh.shopClient.fetchQueryProducts({
                limit: 1000
            }).then(wshopRefresh.processAllProducts);

        });

    },

    initShopify: function(){
        wshopRefresh.shopClient = ShopifyBuy.buildClient({
            apiKey: wshopVars.apiKey,
            // Strips out 'http' if user entered it in their options
            domain: wshopVars.domain.replace(/^https?:\/\//, ''),
            appId: wshopVars.appId
        });
    },

    processAllProducts: function(products){

        // Sort Products by ID number
        products = products.sort(function(a, b){
            if( a.id < b.id ) {
                return -1;
            } else if (a.id > b.id) {
                return 1;
            } else {
                return 0;
            }
        });

        // Disable button
        jQuery('#refresh-button').attr('disabled', 'disabled').addClass('disabled');

        // Save products
        wshopRefresh.products = products;

        // How many products do we have total?
        wshopRefresh.totalProducts = products.length;

        // Clear message
        jQuery('.refresh-message').html(`<li>Received ${products.length} Products from Shopify...</li>`);

        // Kick off processing loop
        wshopRefresh.processNextProduct();

    },

    processNextProduct: function(){

        // Get first product from remaining products
        var data = wshopRefresh.products.shift();

        // Create the product page
        jQuery.post({
            url: wshopRefresh.vars.processLink,
            data: {
                product_id: data.id,
                product_title: data.title,
                auto_publish: jQuery('#auto_approve').is(':checked'),
                auto_delete: jQuery('#auto_remove').is(':checked')
            }
        }).done(function(message){

            jQuery('.refresh-message').append(`<li>(${wshopRefresh.totalProducts - wshopRefresh.products.length} / ${wshopRefresh.totalProducts}) ${message}</li>`);

            if( wshopRefresh.products.length > 0 ){
                // Do we have more products? If so, process the next one
                wshopRefresh.processNextProduct();
            } else {
                // Reenable the button
                jQuery('#refresh-button').attr('disabled', false).removeClass('disabled');
                // Append "finished!" message
                jQuery('.refresh-message').append('<li>All products updated!</li>');
            }
        });






    }

}

jQuery(document).ready(function($){

    wshopRefresh.init();

});