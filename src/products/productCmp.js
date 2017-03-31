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
        template: '<div class="product-wrapper">' + template + '</div>'
    }

    return new Vue({
        el,
        components: {
            'product-inner': productInner
        },
        data () {
            return {
                propsData: {...propsData},
                product: null
            }
        },
        mounted () {
            shopClient.fetchProduct(this.propsData.productId)
                .then(product => this.product = product)
        },
        template: `
            <div :class="['wshop-product-module', { loading }, { 'has-variants': hasVariants }, { 'product-unavailable': productUnavailable }]">
                <product-inner></product-inner>
            </div>`.trim(),
        computed: {
            hasVariants () {
                return _.get(this.product, 'variants.length') > 1
            },
            productUnavailable () {
                return _.get(this.product, 'attrs.available')
            },
            loading () {
                return this.product === null
            }
        }
    })

}
