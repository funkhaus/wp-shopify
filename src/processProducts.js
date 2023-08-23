import { jsonToQueryString } from './utils'

export default async function(data, callback = () => {}) {
    const promises = data.map(async product => {
        // build url of programmatic product creator
        const url =
            wshopVars.processLink +
            '&' +
            jsonToQueryString({
                product_id: product.id,
                product_title: product.title,
                product_vendor: product.vendor,
                auto_publish: jQuery('#auto_approve').is(':checked')
            })

        // post to url, creating or updating the desired Product
        const resultText = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin'
        }).then(res => res.json())

        callback(resultText.message)
    })

    return await Promise.all(promises)
}
