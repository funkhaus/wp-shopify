export default {
    name: 'type',
    template: '<span class="wpshop-product-type">{{ type }}</span>',
    computed: {
        type () { return _.get(this.$root, 'product.attrs.product_type') }
    }
}
