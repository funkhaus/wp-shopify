// import GraphQLClient from './gql-client'
import _get from 'lodash.get'

async function fetchProducts(cursor = '', productsPerPage = 250) {
    const cursorString = cursor ? `after: "${cursor}"` : ''
    const query = `{
  shop {
    products(first: ${productsPerPage} ${cursorString}) {
      edges {
        node {
          title
          id
          options(first: 250) {
            name
            values
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}

`

    const res = await fetch(`https://${wshopVars.domain}/api/graphql`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/graphql',
            'X-Shopify-Storefront-Access-Token': wshopVars.apiKey
        }),
        body: query
    })
        .then(res => {
            if (!res.ok) {
                throw Error(response.statusText)
            }
            return res.json()
        })
        .catch(e => console.error(e))

    return res
}

export default async function(evt) {
    let hasNextPage = true
    let products = []
    let cursor = ''
    let i = 0

    while (hasNextPage) {
        const res = await fetchProducts(cursor)

        let edges = _get(res, 'data.shop.products.edges', [])
        // get first round of results
        products = products.concat(edges.map(n => n.node))

        hasNextPage = _get(
            res,
            'data.shop.products.pageInfo.hasNextPage',
            false
        )

        cursor = edges.length ? edges[edges.length - 1].cursor : ''
    }

    return products
}
