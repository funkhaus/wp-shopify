export default {
    name: 'image',
    template: `<img
        :class="[ 'wps-product-image', { loading } ]"
        :src="url"
        />`.trim(),
    props: {
        index: {
            default: 0,
            type: Number
        }
    },
    computed: {
        url(){
            return _.get( this.$root, 'product.attrs.images[' + this.index + '].src' )
        },
        loading(){
            // TODO: Image loading classes
            return true
        }
    }
}
