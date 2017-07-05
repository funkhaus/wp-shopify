/* global jQuery */
import shopClient from 'src/shopClient'
import cartCmp from 'src/carts/cartCmp.js'
import bus from 'src/bus'

export default () => {

    let setupCart = false

    // if there is a cart in local storage...
    if(localStorage.getItem('lastCartId')) {

        // get the cart, set globally
        setupCart = shopClient.fetchCart(localStorage.getItem('lastCartId'));

    // no cart in storage
    } else {

        // create new cart...
        setupCart = shopClient.createCart();

    }

    // when cart is set up...
    setupCart.then(function(cart){

        // add globally, save in storage
        bus.cart = cart
        localStorage.setItem('lastCartId', bus.cart.id);

        // get all valid cart components
        const cartEls = document.querySelectorAll('*[data-cart]')

        _.each(cartEls, el => {
            // init vue instance
            new cartCmp({ el, template: el.innerHTML })
        })


        return bus.cart

    });

    if( jQuery ){
        jQuery(document).trigger('wshop.cartInitialized');
    }


}
