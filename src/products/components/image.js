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
            return this.image ?
                this.image.src :
                _.get( this.$root, 'product.attrs.images[0].src' )
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
