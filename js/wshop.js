var wshop = {

    init: function() {

        wshop.initShopify();
        wshop.initCart();
        wshop.initProducts();

    },

    initShopify: function(){

        wshop.shopClient = ShopifyBuy.buildClient({
            apiKey: wshopVars.apiKey,
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

        jQuery(document).trigger('wshop-cart-initialized');

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
                    total--;
                    if( total == 0 ){
                        jQuery(document).trigger('wshop-products-rendered');
                    }
                });

        });

        // trigger event
        jQuery(document).trigger('wshop.products-initialized', [ $products.length ]);

    },

/*
 * function to render everything within the page's cart
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
        if ( jQuery( 'script.wshop-cart-line-item' ).length ){
            lineItemTemplate = _.template(
                jQuery( 'script.wshop-cart-line-item' ).html()
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

                    // loop through any line items in cart
                    _.each(wshop.cart.lineItems, function(lineItem){

                        var $lineItem = jQuery(lineItemTemplate(lineItem));

                        // render this line item using template
                        $dataLine.append( $lineItem );

                        // bind any incremenet/decremenet buttons to corresponding functions
                        $lineItem.find('*[data-cart="add"]').on('click', wshop.handleIncrement.bind($lineItem));
                        $lineItem.find('*[data-cart="subtract"]').on('click', wshop.handleDecrement.bind($lineItem));

                        // bind 'remove' button to 'decrement' function
                        $lineItem.find('*[data-cart="remove"]').on('click', wshop.handleDecrement.bind($lineItem));


                    });

                }

            });

        });

    },

    handleIncrement: function(e){

        // get ID from data-att
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

        // get ID from data-att
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

        // get ID
        var lineitemId = jQuery(this).data('lineitemId');

        // no ID? abort
        if ( !lineitemId ) return;

        // remove item and re-render cart
        wshop.cart.updateLineItem(lineitemId, 0)
            .then(wshop.renderCarts);

    },

/*
 * function to render all of the data within a product element
 */
    renderProduct: function(){ // switch back to binding

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
                        jQuery(this).trigger('wshop-image-loaded');

                    }.bind(this);

                    var targetImage = product.images[currentImage].src;
                    img.src = targetImage;

                    // increment
                    currentImage++;
                }

            }

            // set select
            if ( jQuery(this).attr('data-product') == 'select' && product.variants.length > 1 ){

                // build html for select
                var selectElem = product.options.map(function(option) {
                    return '<select name="' + option.name + '"><option selected disabled>' + option.name + '</option>' + option.values.map(function(value) {
                        return '<option value="' + value + '">' + value + '</option>';
                    }) + '</select>';
                })[0];

                // add select to this element
                jQuery(this).html(selectElem);

                // add change listener to select
                jQuery(this).find('select').on('change', function(e){

                    // get name a val from select
                    var name = jQuery(this).attr('name');
                    var value = jQuery(this).val();

                    // set this variant as selected
                    product.options.filter(function(option) {
                        return option.name === name;
                    })[0].selected = value;

                    // trigger event on this product
                    $productBlock.trigger('wshop-variant-change');

                });

            }

            // add listener to add-to-cart button
            if ( jQuery(this).attr('data-product') == 'add-to-cart' ){

                // may already be set, so unset
                jQuery(this).off('click', wshop.handleAddToCart);
                jQuery(this).on('click', wshop.handleAddToCart);

            }

        });

        // find anything with data-template
        $productBlock.find('*[data-template]').each(function(){

            // find data-template value
            var templateName = jQuery(this).attr('data-template');

            // find relevant script ID
            var $templateScript = jQuery('#' + templateName);

            // return if no template present
            if( ! $templateScript.length ){
                console.log('No template with the ID #' + templateName + ' found');
                return true;
            }

            // prep template name
            _.templateSettings.variable = 'data';

            // pre-compile template
            var template = _.template( $templateScript.html() );

            // render template
            $rendered = jQuery( template(product) );

            // inject rendered object into block
            jQuery(this).html($rendered);

            // callbacks
            jQuery(document).trigger('wshop.templateRendered', [ jQuery(this) ]);
        });


        //$productBlock.trigger('wshop.');

    },

    handleAddToCart: function(){

        var product = jQuery(this).closest('*[data-product-id]').data('product');

        wshop.cart.addVariants({ variant: product.selectedVariant, quantity: 1 })
            .then(function(){

                // re-render any carts
                wshop.renderCarts();

                jQuery(document).trigger('wshop-product-added');

            });

    }

};
jQuery(document).ready(function($){

    wshop.init();

});