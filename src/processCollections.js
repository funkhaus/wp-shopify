import { jsonToQueryString } from './utils'
import _get from 'lodash.get'

export default async function(data) {
    const promises = data.map(async collection => {
        // build URL of collection creator
        const url =
            wshopVars.processTermLink +
            '&' +
            jsonToQueryString({
                title: collection.title,
                slug: collection.handle,
                description: collection.descriptionHtml
                // id: collection.id
            })

        // post to url, creating or updating the desired Collection
        await fetch(url, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => console.log(res.text()))

        // build URL of item updater
        const itemIds = _get(collection, 'products.edges', []).map(
            edge => edge.node.id
        )
        console.log(itemIds.join(','))
        const itemAdderUrl =
            wshopVars.addTermLink +
            '&' +
            jsonToQueryString({
                ids: itemIds.join(','),
                slug: collection.handle,
                title: collection.title
            })

        // post to url, adding items to the desired Collection
        return await fetch(itemAdderUrl, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => console.log(res.text()))
    })

    return await Promise.all(promises)
}
