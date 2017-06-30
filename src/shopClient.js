import ShopifyBuy from 'shopify-buy'

export default ShopifyBuy.buildClient({
    accessToken: wshopVars.accessToken,
    domain: wshopVars.domain,
    appId: wshopVars.appId
})
