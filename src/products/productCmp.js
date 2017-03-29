import shopClient from 'src/shopClient'
import titleCmp from './components/title'
import bus from 'src/bus'

Vue.component('product-title', titleCmp)

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
                loading: false
            }
        },
        mounted () {
            this.loading = true
            shopClient.fetchProduct(this.propsData.productId)
                .then(product => this.product = product)
                .then(() => this.loading = false)
        },
        template: `
            <div :class="['wshop-product-module', { loading }]">
                <product-inner></product-inner>
            </div>`.trim()
    })

}
