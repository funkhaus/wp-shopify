import imagesLoaded from 'imagesloaded'

export default {
    name: 'image',
    template: `<img
        :class="[ 'wp-shopify-image', { loading } ]"
        :src="url"
        />`.trim(),
    props: {
        image: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            loading: true
        }
    },
    mounted () { this.runLoading() },
    watch: {
        url () { this.runLoading() }
    },
    computed: {
        url () {
            const manualImageSrc = _.get(this, 'image.src')
            const variantImageSrc = _.get( this.$root, 'product.selectedVariant.image.src' )
            const firstImageSrc = _.get( this.$root, 'product.images[0].src' )

            return manualImageSrc || variantImageSrc || firstImageSrc
        },
        width () {
            return this.$el.width
        }
    },
    methods: {
        runLoading () {
            this.loading = true
            imagesLoaded( this.$el, () => {
                this.loading = false
            })
        }
    }
}
