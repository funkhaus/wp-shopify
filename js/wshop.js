var wshop = {

    init: function() {

        wshop.initShopify();
        wshop.initCart();
        wshop.initProducts();
        wshop.initCollectionLists();

    },

    initShopify: function(){

        wshop.shopClient = ShopifyBuy.buildClient({
            apiKey: wshopVars.apiKey,
            // Strips out 'http' if user entered it in their options
            domain: wshopVars.domain,
            appId: wshopVars.appId
        });

    },

    initCart: function(){

        var setupCart;

        // if there is a cart in local storage...
        if(localStorage.getItem('lastCartId')) {

            // get the cart, set globally
            setupCart = wshop.shopClient.fetchCart(localStorage.getItem('lastCartId'));

        // no cart in storage
        } else {

            // create new cart...
            setupCart = wshop.shopClient.createCart();

        }

        // when cart is set up...
        setupCart.then(function(cart){

            // add globally, save in storage
            wshop.cart = cart;
            localStorage.setItem('lastCartId', wshop.cart.id);

            wshop.renderCarts();

        });

        // Bind increment buttons
        jQuery(document).on('click', '*[data-cart="add"]', function(e){
            wshop.handleIncrement.bind(
                jQuery(this).closest('*[data-lineitem-id]')
            )();
        });

        // Bind decrement buttons
        jQuery(document).on('click', '*[data-cart="subtract"]', function(e){
            wshop.handleDecrement.bind(
                jQuery(this).closest('*[data-lineitem-id]')
            )();
        });

        // Bind 'remove' buttons
        jQuery(document).on('click', '*[data-cart="remove"]', function(e){
            wshop.handleRemove.bind(
                jQuery(this).closest('*[data-lineitem-id]')
            )();
        });

        jQuery(document).trigger('wshop.cartInitialized');

    },

    resetCart: function(){

        // if localstorage is supported
        if ( localStorage ){

            // remove the current cart from storage
            localStorage.removeItem('lastCartId');

            // clear out old cart
            wshop.cart = null;

            // re-init with blank cart
            this.initCart();

        }

    },

    initCollectionLists: function(){

        // render any category lists
        wshop.shopClient.fetchAllCollections().then(function(collections){

            jQuery('*[data-collection-list]').each(function(){
                wshop.renderTemplate.bind(this)('collection-list', collections);
            });

        });



    },

    initProducts: function(){

        // find any products on the page
        $products = jQuery('*[data-product-id]');

        var total = $products.length;

        // abort if no products
        if ( ! total ) return;

        $products.each(function(){

            var $block = jQuery(this);
            var productId = $block.data('productId');

            wshop.shopClient.fetchProduct(productId)
                .then(function(product){

                    // attach product object to dom element
                    $block.data('product', product);

                    return product;
                })
                .then(function(){
                    wshop.renderProduct.bind($block.get(0))();

                    // make sure we've rendered all products before triggering callback
                    if( --total == 0 ){
                        jQuery(document).trigger('wshop.productsRendered');
                    }
                });

        });

        // trigger event
        jQuery(document).trigger('wshop.productsInitialized', [ $products.length ]);

    },

/*
 * function to render everything within the page's carts
 */
    renderCarts: function(){

        // find any carts on page
        var $carts = jQuery('*[data-cart-id]');

        // no cart? abort
        if ( ! $carts.length ) return;

        // if we don't have any items, append 'cart empty' message
        if( ! wshop.cart.lineItems.length ){
            $carts.addClass('empty-cart');
        } else {
            $carts.removeClass('empty-cart');
        }

        // set main variable name in underscore
        _.templateSettings.variable = 'data';

        // pre-compile cart line-item template
        var lineItemTemplate;
        if ( jQuery( 'script#cart-line-item' ).length ){
            lineItemTemplate = _.template(
                jQuery( 'script#cart-line-item' ).html()
            );
        }

        // loop carts
        $carts.each(function(){

            $cart = jQuery(this);

            $cart.find('*[data-cart]').each(function(){

                $dataLine = jQuery(this);

                // set subtotal, item count, checkout URL
                if ( $dataLine.attr('data-cart') == 'subtotal' ) jQuery(this).text( wshop.cart.subtotal );
                if ( $dataLine.attr('data-cart') == 'line-item-count' ) jQuery(this).text( wshop.cart.lineItemCount );
                if ( $dataLine.attr('data-cart') == 'checkout' && jQuery(this).is('a') ) jQuery(this).attr('href', wshop.cart.checkoutUrl);

                // build line-items in container
                if ( $dataLine.attr('data-cart') == 'line-items' && lineItemTemplate ){

                    // empty any existing line-items
                    $dataLine.empty();

                    // trigger a callback on an empty cart
                    if( wshop.cart.lineItems.length == 0 ){
                        jQuery(document).trigger('wshop.cartEmpty');
                    }

                    // loop through any line items in cart
                    _.each(wshop.cart.lineItems, function(lineItem){

                        // Render line item
                        var $lineItem = jQuery(lineItemTemplate(lineItem));

                        // Save line item ID
                        $lineItem.attr('data-lineitem-id', lineItem.id);

                        // Append rendered line item
                        $dataLine.append( $lineItem );

                    });

                }

            });

        });

    },

    handleIncrement: function(e){

        // get ID from data-attr
        var lineitemId = jQuery(this).data('lineitemId');

        // no ID? abort
        if ( !lineitemId ) return;

        // find corresponding item in cart and get qty
        var qty = _.find(wshop.cart.lineItems, function(lineItem){ return lineItem.id == lineitemId }).quantity;

        // increment, then re-render cart
        wshop.cart.updateLineItem(lineitemId, (qty + 1))
            .then(wshop.renderCarts)

    },

    handleDecrement: function(e){

        // get ID from data-attr
        var lineitemId = jQuery(this).data('lineitemId');

        // no ID? abort
        if ( !lineitemId ) return;

        // find corresponding item in cart and get qty
        var qty = _.find(wshop.cart.lineItems, function(lineItem){ return lineItem.id == lineitemId }).quantity;

        // decrement, then re-render cart
        wshop.cart.updateLineItem(lineitemId, (qty - 1))
            .then(wshop.renderCarts)

    },

    handleRemove: function(e){

        // get ID from data-attr
        var lineitemId = jQuery(this).data('lineitemId');

        // no ID? abort
        if ( !lineitemId ) return;

        // remove item and re-render cart
        wshop.cart.updateLineItem(lineitemId, 0)
            .then(wshop.renderCarts);

    },

    renderTemplate: function(templateName, data){

        // Save HTML for applied template
        var $applied = '';

        // find template script by ID
        var $templateScript = jQuery('#' + templateName);

        // return if no template present
        if( ! $templateScript.length ){

            console.log('No template with the ID #' + templateName + ' found');

            // Set an HTML comment
            $applied =  '<!-- No template with the ID #' + templateName + ' found! -->';
        } else {
            // prep template data name
            _.templateSettings.variable = 'data';

            // pre-compile template
            var template = _.template( $templateScript.html() );

            // Apply template formatting and return result
            $applied = jQuery( template(data) );
        }

        // Place inside bound element
        jQuery(this).html( $applied );

    },

/*
 * function to render all of the data within a product element
 */
    renderProduct: function(){

        // get elem
        $productBlock = jQuery(this);

        // get product object from data-att
        var product = $productBlock.data('product');

        // do nothing if no product
        if ( ! product ) return;

        // add classes if need be
        if ( product.variants && product.variants.length > 1 ){
            $productBlock.addClass('has-variants');
        }
        if ( ! product.attrs.available ){
            $productBlock.addClass('product-unavailable');
        }

        // track image index (products with multiple images)
        var currentImage = 0;

        // find all elems within by data-att
        $productBlock.find('*[data-product]').each(function(i){

            // set title, price, description
            if ( jQuery(this).attr('data-product') == 'title' ) jQuery(this).text( product.title );
            if ( jQuery(this).attr('data-product') == 'price' ) jQuery(this).text( product.selectedVariant.price );
            if ( jQuery(this).attr('data-product') == 'description' ) jQuery(this).html( product.description );
            // set product type
            if ( jQuery(this).attr('data-product') == 'type' ) jQuery(this).text( product.attrs.product_type );

            // set images
            if ( jQuery(this).attr('data-product') == 'image' ){

                // if product has images
                if ( product.images.length ){

                    // get image from product object
                    var img = new Image();
                    img.onload = function() {
                        var $image = jQuery(img);

                        // add image into this element
                        jQuery(this).append($image);

                        // trigger image-loaded event
                        jQuery(this).trigger('wshop.imageLoaded');

                    }.bind(this);

                    // Set src and load image
                    var targetImage = product.images[currentImage].src;
                    img.src = targetImage;

                    // increment
                    currentImage++;
                }

            }

            // set select
            if ( jQuery(this).attr('data-product') == 'select' && product.variants.length > 1 ){

                // Render select
                wshop.renderTemplate.bind(this)('variants-select', product);

                // add change listener to newly-rendered select
                jQuery(this).find('select').on('change', function(e){

                    // get name a val from select
                    var name = jQuery(this).attr('name');
                    var value = jQuery(this).val();

                    // set this variant as selected
                    product.options.filter(function(option) {
                        return option.name === name;
                    })[0].selected = value;

                    // trigger event on this product
                    $productBlock.trigger('wshop.variantChange');

                });

            }

            // set radio
            if( jQuery(this).attr('data-product') == 'radio' && product.variants.length > 1 ){

                // Render radio
                wshop.renderTemplate.bind(this)('variants-radio', product);

                // add change listener to newly-rendered radio
                jQuery(this).find('input[type=radio]').on('change', function(e){

                    // get name from radio value
                    var name = e.target.name;
                    var value = e.target.value;

                    // set this variant as selected
                    product.options.filter(function(option) {
                        return option.name === name;
                    })[0].selected = value;

                    // trigger event on this product
                    $productBlock.trigger('wshop.variantChange');

                });
            }

            // add listener to add-to-cart button
            if ( jQuery(this).attr('data-product') == 'add-to-cart' ){

                // may already be set, so unset
                jQuery(this).off('click', wshop.addSingleToCart);
                jQuery(this).on('click', wshop.addSingleToCart);

            }

        });

        // find anything with data-template
        $productBlock.find('*[data-template]').each(function(){

            // find data-template value
            var templateName = jQuery(this).attr('data-template');

            // render template
            wshop.renderTemplate.bind(this)(templateName, product);

            // callbacks
            jQuery(document).trigger('wshop.templateRendered', [ jQuery(this) ]);
        });

        // Trigger "all rendered" event
        $productBlock.trigger('wshop.allProductsRendered');

    },

    addSingleToCart: function(){

        // Add one of an item to cart
        addToCart.bind(this)(1);

    },

    addToCart: function(quantity){

        if( jQuery(this).parents('.product-unavailable').length ){

            // We have a .product-unavailable parent, so trigger the relevant event
            jQuery(this).parents('.product-unavailable').trigger('wshop.unavailableProductAdded');

        } else {

            // Find product parent
            var product = jQuery(this).closest('*[data-product-id]').data('product');

            // Add selected variant and selected quantity to cart
            wshop.cart.addVariants({ variant: product.selectedVariant, quantity: quantity || 1 })
                .then(function(){

                    // re-render any carts
                    wshop.renderCarts();

                    jQuery(document).trigger('wshop.productAdded');

                });
        }
    }

};
jQuery(document).ready(function($){

    wshop.init();

});