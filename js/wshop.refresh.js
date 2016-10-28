// Update existing products
// Create pages for new products
// Publish if auto_approve is set to 'true'

var wshopRefresh = {

    vars: wshopVars,
    shopClient: null,
    productsLeft: 0,
    processedIDs: [],

    init: function(){
        wshopRefresh.initShopify();
        wshopRefresh.initListener();
    },

    initListener: function(){

        jQuery('#wpshopify-refresh-button').on('click', function(e){
            e.preventDefault();

            // Cancel if already working
            if( jQuery('#wpshopify-refresh-button').is(':disabled') ) return;

            // Disable button
            jQuery('#wpshopify-refresh-button').prop('disabled', true);

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
            domain: wshopVars.domain,
            appId: wshopVars.appId
        });
    },

    processAllProducts: function(products){

        // Save products
        wshopRefresh.products = products;

        // How many products do we have total?
        wshopRefresh.totalProducts = products.length;

        // Clear processed IDs
        wshopRefresh.processedIDs.length = 0;

        // Clear message
        jQuery('.refresh-message').html('<li>Received ' + products.length + ' product(s) from Shopify...</li>');

        // Kick off processing loop
        wshopRefresh.processNextProduct();

    },

    processNextProduct: function(){

        // Get first product from remaining products
        var data = wshopRefresh.products.shift();

        // Create the product page
        jQuery.ajax({
            type: 'POST',
            url: wshopRefresh.vars.processLink,
            data: {
                product_id: data.id,
                product_title: data.title,
                auto_publish: jQuery('#auto_approve').is(':checked')
            }
        })

        .fail(function(message){
            console.log(message);
        })

        .done(function(message){

            message = JSON.parse(message);

            jQuery('.refresh-message').prepend('<li>(' + (wshopRefresh.totalProducts - wshopRefresh.products.length) + ' / ' + wshopRefresh.totalProducts + ') ' + message.message + '</li>');

            // Strip out the product ID and save it to a list of IDs we've processed
            var processedID = message.id;
            if( processedID.length ){
                wshopRefresh.processedIDs.push( parseInt(processedID) );
            }

            if( wshopRefresh.products.length > 0 ){

                // Do we have more products? If so, process the next one
                wshopRefresh.processNextProduct();

            } else {

                // Start removing old products
                wshopRefresh.removeOldProducts();

            }
        });

    },

    removeOldProducts: function(){

        // Find product IDs without corresponding Shopify products
        jQuery.ajax({
            type: 'POST',
            url: wshopRefresh.vars.getAllProductsLink
        }).done(function(message){

            // Append message
            jQuery('.refresh-message').prepend('<li>Cleaning up products removed from Shopify...</li>');

            var allProducts = JSON.parse(message);

            var extraProductPages = [];

            allProducts.forEach(function(product){

                var productId = parseInt(product.product_id);

                // Has this product ID not been processed?
                if( wshopRefresh.processedIDs.indexOf(productId) == -1 ){
                    // If it hasn't been processed, mark WP page for removal
                    extraProductPages.push(product.wp_id);
                }
            });

            if( ! extraProductPages.length ){
                // No products to remove, so wrap it all up!
                jQuery('.refresh-message').prepend('<li>No old products to clean up.</li>');
                wshopRefresh.completeRefresh();
                return;
            }

            // Delete old products
            jQuery.ajax({
                type: 'POST',
                url: wshopRefresh.vars.removeOldProductsLink,
                data: {
                    to_remove: extraProductPages.join()
                }
            }).done(function(message){
                // Add status update and finish the process
                jQuery('.refresh-message').prepend('<li>Removed ' + extraProductPages.length + ' old product(s).</li>');
                wshopRefresh.completeRefresh();
            });
        });

    },

    completeRefresh: function(){

        // Reenable the button
        jQuery('#wpshopify-refresh-button').prop('disabled', false);

        // Append "finished!" message
        jQuery('.refresh-message').prepend('<li>All products updated!</li>');

    }

}

jQuery(document).ready(function($){

    wshopRefresh.init();

});