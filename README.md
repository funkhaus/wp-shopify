## Start on:
* Radio buttons
* Select buttons

## Readme below:

wp-shopify (WPS) is a Wordpress plugin that integrates the [Shopify Buy Button](https://help.shopify.com/api/sdks/js-buy-sdk) API with Wordpress for easy and powerful store construction.

It consists of two parts:

* A __syncing__ tool to keep your Wordpress site connected to your Shopify store, and
* A set of __templating__ functions to make building a store and a shopping cart easier.

# Table of Contents
1. [Installation](#installation)
1. [Syncing](#syncing)
    1. [Collections](#collections)
1. [Templating Products](#templating-products)
    1. [Example](#example)
        1. [Single Products](#single-products)
        1. [Product Archives](#product-archives)
    1. [Product Component Reference](#product-component-reference)
1. [Templating Carts](#templating-carts)


# Installation
1. Set up Shopify:
    1. Set up a Shopify store and enable the [Buy Button Channel](https://www.shopify.com/buy-button).
    1. Create an __access token__ by going to the Buy Button Extensions page at `your-site.myshopify.com/admin/apps/private/extensions` and clicking `Create Extension` in the top right corner.
1. Set up Wordpress:
    1. Download this repo and drop it into your plugins folder. Enable it through your plugin settings and then navigate to `Settings > WP-Shopify`.
    1. Put your __access token__, Shopify domain, and app ID in the WPS settings. More info on where to find those [here]( https://help.shopify.com/api/guides/api-credentials).
    1. Save your changes, then click Refresh Products. Your products and collections will auto-populate from your Shopify store.


# Syncing
Your Wordpress site will now be synced to your Shopify Products and Collections. Products are stored as a custom post type called `wps-product`.

The product ID meta field (stored under the key `_wshop_product_id` on a `wps-product`) connects a product to its data on Shopify; that data is treated as the source of truth for all product information. Prices, images, variants, names, etc. - every piece of data except Collections - will make requests directly from the Shopify store, ensuring that all information is up-to-date.

The only times you need to manually refresh your store (Settings > WP-Shopify > Refresh Products) are when:

* You want to add or remove Products from your Wordpress site after setting them up on Shopify, or
* You want to update your Collections information.

Basically, it's a good rule of thumb to refresh your store manually after making any significant changes on Shopify.

## Collections

WPS imports Collections as a custom taxonomy called `wps_collection`. Each Collection in Shopify becomes a term in the `wps_collection` taxonomy.

Each of those terms has a custom piece of metadata called `_wps_collection_image` that contains the URL to the image associated with a Collection. You can set this image on Shopify, then show the image on your site like this:   `<image src="<?php echo $your_term->_wps_collection_image; ?>">`

# Templating Products

Once your Shopify data has been synced to your Wordpress site, you can start templating products and collections easily, following the cardinal rule of WPS products:

__Any element with the `data-product-id` attribute set to a valid Product ID will turn into a product template.__

## Example

### Single Products

Let's say your site, `example.com`, has WPS set up and synced. Your first product, Tofu, is ready to be sold.

Since WPS treats products as the custom post type `wps-product`, all you need to do is create a template for a single product called `single-wps-product.php` in your theme. (See the [Template Hierarchy](https://developer.wordpress.org/files/2014/10/template-hierarchy.png) if you need a refresher on custom hierarchies.)

The contents of that file can look something like this:

```
<?php get_header(); ?>

    <div data-product-id="<?php the_product_id(); ?>">
        <h2><product-title></product-title></h2>
    </div>

<?php get_footer(); ?>
```

When you go to `example.com/store/tofu` (assuming you have your store permalink set to 'store'), you'll see the name of your Tofu product in an h2 tag!

There are a couple things going here:

* First, we wrap the entire product in an element with the `data-product-id` attribute set. Nothing outside this element will receive the correct product data or render the custom components.
* Next, we set the value of `data-product-id` using the `the_product_id()` [convenience function](#convenience-functions).
* Finally, we included a custom component called `product-title`, which renders the product title. We'll cover more about WPS custom components later.

### Product Archives

Let's say you've added a new product, Seitan, to your store, and you want to create an archive for products.

Just like with any other post type, you can create an `archive-wps-product.php` file and fill it with something like this:

```
<?php get_header(); ?>

    <ul>
        <?php if( have_posts() ) : ?>
        <?php while( have_posts() ) : the_post(); ?>

            <li>
                <div data-product-id="<?php the_product_id(); ?>">
                    <a href="<?php the_permalink(); ?>">
                        <product-title></product-title>
                    </a>
                </div>
            </li>

        <?php endwhile; ?>
        <?php endif; ?>
    </ul>

<?php get_footer(); ?>

```

Now, when you go to `example.com/store`, you see links for `Tofu` and `Seitan`, both leading to their own instance of the `single-wps-product` template we defined above!

There are a few things to note here:

* We're setting up The Loop just like any other archive page.
* `data-product-id` is again set to `the_product_id()`, but we have an extra `<li>` above the `data-product-id` div.
    * This is because the `data-product-id` element is always replaced with a `<div>`, no matter what the original's type - an `<li data-product-id="...">` would become a `<div>`.
* We can still use normal WP templating functions like `the_permalink()` in the template. Mixing PHP with Vue will work just fine.

## Product Component Reference

Unless otherwise noted, all product components have two [slots](https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots): one named `before` and the default slot, which comes after the rendered information.

* `product-add` Creates a button that adds 1 of the product to the cart. Fires `wshop.productAdded` event on product container if jQuery installed. No `before` slot - default slot renders the button content.
* `product-description` The product description.
* `product-gallery` Renders a `product-image` for each image attached to the product.
* `product-image` Renders an image for the product.
    * Picks the first of the following available: manual image (set via `<product-image :image="{ src = \"manual-source.jpg\" }"`), selected variant image, or first image attached to product.
* `product-price` Cost of the product.
* `product-title` The name of the product.
* `product-type` The product type.

TODO: Document `product-select` and `product-radio`

# Templating Carts

You can easily show the contents of a user's cart in much the same way as products.

Just wrap the cart in a div with the `data-cart` attribute:

```
<div data-cart>

    <h2>My Cart</h2>

</div>
```

From here, you can access any of the custom components in the [reference](#cart-reference) below.

## Line Items

One notable difference is iterating through the items in a cart (referred to as "line items") - instead of the expected

```
<line-items></line-items>
```

you'll need to manually set up your line items:

```
<div v-for="item in this.$root.cartItems">
    {{ item }}
</div>
```

Replace `{{ item }}` with any custom templating you'd like to see for individual line items - for example:

```
<div data-cart>

    <h2>My Cart</h2>

    <div v-for="(item, index) in this.$root.cartItems">
        <h3>Item number {{ index + 1 }}</h3>
        <single-image :item="item"/>
    </div>

</div>

```

Make sure you include the `item` prop on every custom component in the line-item loop.

### Raw Line Item Data

TODO: Continue or remove

For most line item templating, it's easiest just to refer to the raw data. Here's a list of some of the most commonly used information:

* `title` - The title of the product.
* `quantity` - The quantity of this product in the cart.

## Cart Reference

TODO: Document custom cart components

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
WPS comes with PHP convenience functions to check for, fetch, and display product IDs. Note that `$post` is optional in all of these functions and defaults to the current post.
* `has_product( $post )` returns `true` if the page has a product ID set, `false` if not.
* `get_the_product_id( $post )` is returns the product ID of a given page, as defined in the 'Product ID' metadata. If there is no product ID attached to a page, it returns a blank string.
* `the_product_id( $post )` echoes the return value of `get_the_product_id()`.


## What's Going on Behind the Scenes (TODO)


--------

__wp-shopify__

http://funkhaus.us

Version: 2.0

Requires at least WP 3.8
