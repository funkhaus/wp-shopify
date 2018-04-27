/* global jQuery */
import refreshAll from './refreshAll'
import processAll from './processAll'
import _get from 'lodash.get'

class WpsRefresh {
    constructor() {
        const form = document.getElementById('refresh')

        if (!form) return

        if (form.attachEvent) {
            form.attachEvent('submit', evt => this.refreshProducts(evt))
        } else {
            form.addEventListener('submit', evt => this.refreshProducts(evt))
        }
    }

    addMessage(msg) {
        jQuery('.refresh-message').prepend(`<li>${msg}</li>`)
    }

    async refreshProducts(evt) {
        evt.preventDefault()

        // Cancel if already working
        if (jQuery('#wpshopify-refresh-button').is(':disabled')) return

        jQuery('#wpshopify-refresh-button').prop('disabled', true)

        this.addMessage('Fetching shop data...')

        // fetch all shop data
        // object consisting of `products` (array of product nodes)
        // and `collections` (array of collection nodes)
        const shopData = await refreshAll()

        // log results
        this.addMessage(
            `Found ${shopData.products.length} product(s) and ${
                shopData.collections.length
            } collection(s). Processing (this may take a minute)...`
        )

        // process all products
        const result = await processAll(shopData)
        result.map(res => this.addMessage(res.message))

        // Reenable the button
        jQuery('#wpshopify-refresh-button').prop('disabled', false)
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        new WpsRefresh()
    },
    false
)
