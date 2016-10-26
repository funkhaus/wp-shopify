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

        jQuery('#refresh').on('click', function(e){
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
        wshopRefresh.productsLeft = products.length;

        // Kick off processing loop
        wshopRefresh.processNextProduct();

    },

    processNextProduct: function(){

        var data = wshopRefresh.products.shift();

        console.log(data);

        // Create the product page
        jQuery.post({
            url: wshopRefresh.vars.processLink,
            data: {
                product_id: data.id,
                product_title: data.title
            }
        }).done(function(message){
            console.log(message);
        });

        // Are we at the last product?

        // Reenable the button
        jQuery('#refresh-button').attr('disabled', false).removeClass('disabled');


    }

}

jQuery(document).ready(function($){

    wshopRefresh.init();

});