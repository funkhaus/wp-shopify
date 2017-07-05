import bus from 'src/bus'
//import cartItems from 'src/carts/components/cartItems.vue'
import singleImage from 'src/carts/components/singleImage.vue'

//Vue.component('cart-items', cartItems)
Vue.component('single-image', singleImage)

export default options => {

    const { el, template } = options

    const cartInner = {
        name: 'cart-inner',
        template: '<div class="cart-wrapper">' + template + '</div>'
    }

    return new Vue({
        el,
        data(){
            return {
                bus
            }
        },
        computed: {
            cartItems(){
                return this.bus.cart.lineItems
            }
        },
        components: {
            'cart-inner': cartInner
        },
        template: `
            <div :class="['wshop-cart-module']">
                <cart-inner></cart-inner>
            </div>`.trim(),

    })

}
