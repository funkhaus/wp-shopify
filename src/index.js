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

        this.addMessage(
            'New products processed! Cleaning up products removed from Shopify...'
        )

        // Find product IDs without corresponding Shopify products
        const wpProducts = await fetch(wshopVars.getAllProductsLink, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => res.json())

        // build two lists with Shopify IDs - store WP IDs on one so we can remove posts easily later
        const wpProductIds = wpProducts.map(p => {
            return { shopifyId: p.product_id, wpId: p.wp_id }
        })
        const shopifyProducts = shopData.products.map(p => p.id)

        const toRemove = []

        // compare the two lists - find the posts on WP that are no longer on Shopify
        wpProductIds.map(p => {
            if (!shopifyProducts.includes(p.shopifyId)) {
                toRemove.push(p.wpId)
            }
        })

        // remove old products
        if (toRemove.length) {
            const url =
                wshopVars.removeOldProductsLink +
                '&to_remove=' +
                toRemove.join(',')

            await fetch(url, {
                method: 'POST',
                credentials: 'same-origin'
            })

            this.addMessage(
                `Removed ${toRemove.length} product(s) no longer on Shopify.`
            )
        } else {
            this.addMessage('Nothing to clean up!')
        }

        this.addMessage('All products updated!')

        // TODO: update collections

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
