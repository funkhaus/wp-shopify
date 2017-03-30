export default {
    name: 'title',
    template: '<span class="wpshop-product-title">{{ title }}</span>',
    computed: {
        title () { return _.get(this.$root, 'product.attrs.title') }
    }
}
