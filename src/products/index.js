import shopClient from 'src/shopClient'
import prodCmp from './productCmp'

export default () => {

    // get all valid product components
    const productEls = document.querySelectorAll('*[data-product-id]')

    _.each(productEls, el => {

        const propsData = _.get(el, 'dataset')

        // abort if no ID
        if ( !propsData.productId ) return

        // init vue instance
        new prodCmp({ el, propsData, template: '<div class="product-wrapper">' + el.innerHTML + '</div>' })
    })

}
