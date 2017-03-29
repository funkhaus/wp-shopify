import ShopifyBuy from 'shopify-buy'

export default ShopifyBuy.buildClient({
    apiKey: wshopVars.apiKey,
    domain: wshopVars.domain,
    appId: wshopVars.appId
})
