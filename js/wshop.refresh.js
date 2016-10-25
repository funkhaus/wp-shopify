// Update existing products
// Create pages for new products
// Publish if auto_approve is set to 'true'

var wshopRefresh = {

    vars: wshopVars,
    shopClient: null,

    init: function(){
        wshopRefresh.initShopify();
        wshopRefresh.getAllProducts();
    },

    initShopify: function(){
        wshopRefresh.shopClient = ShopifyBuy.buildClient({
            apiKey: wshopVars.apiKey,
            // Strips out 'http' if user entered it in their options
            domain: wshopVars.domain.replace(/^https?:\/\//, ''),
            appId: wshopVars.appId
        });
    },

    getAllProducts: function(){
        // Request all products from this user's shop
        wshopRefresh.shopClient.fetchQueryProducts({
            limit: 1000
        })

        .then(wshopRefresh.processAllProducts);
    },

    processAllProducts: function(products){

        for( let product of products ){

            console.log(product.id);

        }

    }

}

wshopRefresh.init();