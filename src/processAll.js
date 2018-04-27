function jsonToQueryString(json) {
    return Object.keys(json)
        .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
        .join('&')
}

export default async function(data, callback = null) {
    const promises = data.products.map(async product => {
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
