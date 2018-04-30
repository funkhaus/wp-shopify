import { jsonToQueryString } from './utils'

export default async function(data) {
    const promises = data.map(async product => {
        // build url of programmatic product creator
        const url =
            wshopVars.processLink +
            '&' +
            jsonToQueryString({
                product_id: product.id,
                product_title: product.title,
                auto_publish: jQuery('#auto_approve').is(':checked')
            })

        // post to url, creating or updating the desired Product
        return await fetch(url, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => res.json())
    })

    return await Promise.all(promises)
}
