export default {
    name: 'gallery',
    template: `
        <div class="wps-product-gallery">
            <product-image
                v-for="image in images"
                :image="image">
            </product-image>
        </div>
        `.trim(),
    computed: {
        images () {
            return _.get(this.$root, 'product.attrs.images') || []
        }
    }
}
