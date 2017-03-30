export default {
    name: 'price',
    template: '<span class="wpshop-product-price">{{ price }}</span>',
    computed: {
        // TODO: Fix - how to find current selected variant?
        price () { return 'TODO: Fix price template'/* _.get(this.$root, 'product.attrs.price') */ }
    }
}
