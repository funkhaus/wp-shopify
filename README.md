## What
wp-shopify is an integration tool built with for Wordpress (custom post type: `wps-product`) with the [Shopify Buy API](https://help.shopify.com/api/sdks/js-buy-sdk) and [Vue.js](https://vuejs.org/).

wp-shopify treats anything wrapped in an element with a `data-product-id` as a Vue template.

## How
Assuming a Shopify product with the ID 12345:

```html
<div data-product-id="12345">
    <h2>I'm <product-name></product-name></h2>

    <div>
        I cost $<product-price></product-price>. Here's a description about me: <product-description></product-description>
    </div>

</div>
```

That's it! The product data will render just like you'd expect it to.

## TODO: Dev instructions

## Installation

1. *Shopify:* Set up your Shopify store and enable the [Buy Button Channel](https://www.shopify.com/buy-button).
1. Create an Access Token by going to the Buy Button Extensions page at `*your-store*.myshopify.com/admin/apps/private/extensions` and clicking **Create Token** in the top right corner.
1. *Wordpress:* Download this repo and drop it into your plugins folder. Enable it through your plugin settings and then navigate to __Settings > WP-Shopify__.
1. Enter your Access Token (from step 2), Shopify domain (*your-store*.myshopify.com), and app ID in the wp-shopify settings. More info here on where to find that Shopify info can be found [here]( https://help.shopify.com/api/guides/api-credentials).

## How to Use
Once you've installed, link a Shopify product and a Wordpress page:

1. Create a product in Shopify.
1. EITHER: Link your product(s) to your site automatically:
    1. Go to __Settings > WP-Shopify__ in your WP backend and hit Refresh Products. Your products will auto-populate from your Shopify store.
1. OR link your product(s) manually:
    1. Create a product in the new "Products" section on your WP admin bar.
    1. You should see a new metabox in your new Product that has a field for the product ID. Fill in the product ID from your Shopify store.
        * The easiest way to find the ID of a product is to navigate to the "edit" page for that product within Shopify, and copy the last section of the URL for that page. For example, if when editing the product your url is `*example.myshopify.com/admin/products/__12345__*`, then the ID for that product is __12345__.

Next, prepare the markup for the product pages:

1. wp-shopify products are a custom post type called `wps-product`. To set the template for a single product, create `single-wps-product.php`.
1. **Wrap your product in an element with `data-product-id` set correctly.** For example, when in the Loop:

        <div class="product-wrapper" data-product-id="<?php the_product_id(); ?>">
            <!-- the_product_id() will fill in the product ID - see "Advanced -> Convenience Functions" below -->
        </div>
1. Fill the wrapper with `data-product` shortcuts and/or custom Underscore templates. See Product Templates below for examples.

Finally, prepare the markup for the cart page:

1. **Wrap your cart in an element with `data-cart-id` set.** `data-cart-id` can be left blank:

        <div data-cart-id=""></div>

1. Fill the wrapper with `data-cart` shortcuts and/or custom Underscore templates. See Cart Templates below for examples.

## Product Templates (TODO)

## Cart Templates (TODO)

## Advanced

### Updating Products

When you add new product(s) to your Shopify store, you'll need to refresh your products in Wordpress.

From your WP backend, go to __Settings > WP-Shopify__, set your refresh preferences with the checkboxes, and hit 'Refresh Products.' This will automatically pull product data from your linked Shopify store into Wordpress.

### Permalink Structure Slug

You'll see this option under __Settings > WP-Shopify__. Changing its value will rewrite the store's parent directory:

```
// Permalink Structure Slug set to 'store'
your-site.com/store/product-1

// Permalink Structure Slug set to 'xyz'
your-site.com/xyz/product-1
```

### Events (TODO)

### Wrapper Classes
There are informational classes added to product wrappers upon rendering:
* `hasVariants` will be added to any product that has variants on Shopify.
* `productUnavailable` will be added to any product whose inventory is less than or equal to 0 (or is unavailable for any other reason).

There are also classes added to cart wrappers upon rendering:
* `empty-cart` will be added to an empty cart.

### Convenience Functions
wp-shopify comes with PHP convenience functions to check for, fetch, and display product IDs. Note that `$post` is optional in all of these functions and defaults to the current post.
* `has_product( $post )` returns `true` if the page has a product ID set, `false` if not.
* `get_the_product_id( $post )` is returns the product ID of a given page, as defined in the 'Product ID' metadata. If there is no product ID attached to a page, it returns a blank string.
* `the_product_id( $post )` echoes the return value of `get_the_product_id()`.


## What's Going on Behind the Scenes (TODO)


--------

__wp-shopify__

http://funkhaus.us

Version: 2.0

Requires at least WP 3.8
