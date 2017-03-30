export default {
    name: 'description',
    template: '<span class="wpshop-product-description" v-html="description"></span>',
    computed: {
        description () { return _.get(this.$root, 'product.attrs.body_html') }
    }
}
