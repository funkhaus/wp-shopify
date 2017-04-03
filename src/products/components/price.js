export default {
    name: 'price',
    template: '<span class="wpshop-product-price">{{ price }}</span>',
    computed: {
        // TODO: See image.js for selected variant fallbacks
        price () { return 'TODO: Fix price template'/* _.get(this.$root, 'product.attrs.price') */ }
    }
}
