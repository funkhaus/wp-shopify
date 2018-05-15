/* global jQuery */
import refreshAll from './refreshAll'
import processProducts from './processProducts'
import processCollections from './processCollections'
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
        await processProducts(shopData.products, this.addMessage)

        this.addMessage(
            'New products processed! Cleaning up products removed from Shopify...'
        )

        // Find product IDs without corresponding Shopify products:

        // First, get a list of all wps-products on the WordPress site
        const wpProducts = await fetch(wshopVars.getAllProductsLink, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => res.json())

        // Save just the Shopify ID and WP ID for these wps-products
        const wpProductIds = wpProducts.map(p => {
            return { shopifyId: p.product_id, wpId: p.wp_id }
        })

        // Save a list of products that are live on Shopify
        const shopifyProducts = shopData.products.map(p => p.id)

        // Prep list of WP IDs to remove
        const toRemove = []

        // Find the wps-products that are no longer on Shopify
        wpProductIds.map(p => {
            if (!shopifyProducts.includes(p.shopifyId)) {
                toRemove.push(p.wpId)
            }
        })

        // Remove old products
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

        // Update collections
        this.addMessage('Updating collections...')

        if (shopData.collections.length) {
            await processCollections(shopData.collections, this.addMessage)
        } else {
            this.addMessage('No collections to update!')
        }

        this.addMessage('All products and collections updated!')

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
