/* global jQuery */
import shopClient from 'src/shopClient'
import bus from 'src/bus'

// Import product components
import titleCmp from './components/title.vue'
import priceCmp from './components/price.vue'
import descriptionCmp from './components/description.vue'
import typeCmp from './components/type.vue'
import imageCmp from './components/image.vue'
import galleryCmp from './components/gallery.vue'

// TODO: Make <select> and <radio> components switch the selected variant
import selectCmp from './components/select.vue'
import radioCmp from './components/radio.vue'

import addButtonCmp from './components/addButton.vue'

// Register all product components here
Vue.component('product-title', titleCmp)
Vue.component('product-price', priceCmp)
Vue.component('product-description', descriptionCmp)
Vue.component('product-type', typeCmp);
Vue.component('product-image', imageCmp)
Vue.component('product-gallery', galleryCmp)
Vue.component('product-select', selectCmp)
Vue.component('product-radio', radioCmp)
Vue.component('product-add', addButtonCmp)

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

            this.$on('optionChanged', (optName, value) => {
                console.log(optName, value)
                const index = _.findIndex(this.product.options, option => option.name == optName)
                this.product.options[index].selected = value
                this.$forceUpdate()

                if( jQuery ){
                    // TODO: Pass product info
                    jQuery(this.$el).trigger('wps.optionChanged')
                }
            })

            this.$on('product-added', quantity => {

                if( this.productUnavailable && jQuery){
                    jQuery(this.$el).trigger('wps.unavailableProductAdded')
                } else {

                    bus.cart.createLineItemsFromVariants({
                        variant: this.selectedVariant,
                        quantity: quantity || 1
                    })

                    console.log(bus.cart)

                }

                if( jQuery ){

                }
            })
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
                return ! _.get(this.product, 'attrs.available')
            },
            loading () {
                return this.product === null
            },
            selectedVariant () {
                return _.get(this.product, 'selectedVariant')
            }
        }
    })

}
