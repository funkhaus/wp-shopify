import cartItems from 'src/carts/components/cartItems.vue'

Vue.component('cart-items', cartItems)

export default options => {

    const { el, template } = options

    const cartInner = {
        name: 'cart-inner',
        template: '<div class="cart-wrapper">' + template + '</div>'
    }

    return new Vue({
        el,
        components: {
            'cart-inner': cartInner
        },
        mounted(){
            console.log(template)
        },
        template: `
            <div :class="['wshop-cart-module']">
                <cart-inner></cart-inner>
            </div>`.trim(),

    })

}
