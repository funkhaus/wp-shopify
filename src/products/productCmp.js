import shopClient from 'src/shopClient'
import bus from 'src/bus'

// Import product components
import titleCmp from './components/title'
import priceCmp from './components/price'
import descriptionCmp from './components/description'

// Register all product components here
Vue.component('product-title', titleCmp)
Vue.component('product-price', priceCmp)
Vue.component('product-description', descriptionCmp)

// Set up the product's Vue instance
export default (options) => {
    const { el, propsData, template } = options

    const productInner = {
        name: 'product-inner',
        template
    }

    return new Vue({
        el,
        components: {
            'product-inner': productInner
        },
        data () {
            return {
                propsData: {...propsData},
                product: null,
                loading: false,
                hasVariants: false,
                productUnavailable: false
            }
        },
        mounted () {
            this.loading = true
            shopClient.fetchProduct(this.propsData.productId)
                .then(product => this.product = product)
                .then(() => this.loading = false)
                .then(() => {
                    // Adds/removes hasVariants and productUnavailable classes
                    this.hasVariants = this.product.variants && this.product.variants.length > 1
                    this.productUnavailable = !this.product.attrs.available
                })
        },
        template: `
            <div :class="['wshop-product-module', { loading }, { hasVariants }, { productUnavailable }]">
                <product-inner></product-inner>
            </div>`.trim()
    })

}
