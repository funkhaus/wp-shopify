wp-shopify integrates the [Shopify Buy Button](https://help.shopify.com/api/sdks/js-buy-sdk) and Wordpress for easy and powerful store construction.

It consists of two parts:

* A __syncing__ tool to keep your Wordpress site connected to your Shopify store, and
* A set of __templating__ functions to make building a store and a shopping cart easier.

# Table of Contents
1. [Installation](#installation)
1. [Syncing](#syncing)
1. [Templating Products](#templating-products)


# Installation
1. Set up Shopify:
    1. Set up a Shopify store and enable the [Buy Button Channel](https://www.shopify.com/buy-button).
    1. Create an __access token__ by going to the Buy Button Extensions page at `your-site.myshopify.com/admin/apps/private/extensions` and clicking `Create Extension` in the top right corner.
1. Set up Wordpress:
    1. Download this repo and drop it into your plugins folder. Enable it through your plugin settings and then navigate to `Settings > WP-Shopify`.
    1. Put your __access token__, Shopify domain, and app ID in the WP-Shopify settings. More info on where to find those [here]( https://help.shopify.com/api/guides/api-credentials).
    1. Go to `Tools > Shopify` in your WP backend and hit Refresh Products. Your products and collections will auto-populate from your Shopify store.


# Syncing
If you followed the steps in [Installation](#installation), your Wordpress site will now be synced to your Shopify Products and Collections.

## Products

Products are stored as a custom post type called `wps-product`.

The product ID meta field (stored under the key `_wshop_product_id` on a `wps-product`) connects a product to its data on Shopify.

The data on Shopify is treated as the source of truth for all product information except Collections.

## Collections

wp-shopify imports Collections as a custom taxonomy called `wps_collection`.

Each Collection in Shopify becomes a term in the `wps_collection` taxonomy.

### Collection Images

Each term has a custom piece of metadata called `_wps_collection_image` that contains the URL to the image associated with a Collection. You can set this image on Shopify, then show the image on your site like this:   `<image src="<?php echo $your_term->_wps_collection_image; ?>">`

# Templating Products

Once your Shopify data has been synced to your Wordpress site, you can start templating products and collections easily.

The cardinal rule of wp-shopify templating is this:

__Any element with the `data-product-id` attribute set to a valid Product ID will turn into a product template.__

## Example

### Single Products

Let's say your site, `example.com`, has wp-shopify set up and synced. Your store permalink is set to `store` and your first product, `Tofu`, is ready to be sold.

Since wp-shopify treats products as the custom post type `wps-product`, all you need to do is create a template for a single product called `single-wps-product.php` in your theme.

The contents of that file can look something like this:

```php
<?php get_header(); ?>

    <div data-product-id="<?php the_product_id(); ?>">
        <h2><product-title></product-title></h2>
    </div>

<?php get_footer(); ?>
```

When you go to `example.com/store/tofu`, you'll see the name of your `Tofu` product as an h2!

There are a couple things going here:

* First, we wrap the entire product in an element with the `data-product-id` attribute set. Nothing outside this element will receive the correct data or render the custom components!
* Next, we set the value of `data-product-id` using the `the_product_id()` convenience function.
    * wp-shopify includes `get_the_product_id()`, which returns the product ID attached to a page, and `the_product_id()`, which echoes that ID. See [Convenience Functions](#convenience-functions) below.
* Finally, we included a custom component called `product-title`, which renders the product title. We'll cover more about wp-shopify templating components later.

### Product Archives

Let's say you've added a new product, `Seitan`, to your store, and you want to create an archive for products.

Just like with any other post type, you can create an `archive-wps-product.php` file and fill it with something like this:

```php
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
* `data-product-id` is again set to `the_product_id()`, but we wrapped each `data-product-id` container in an `<li>`.
    * This is because the `data-product-id` container is replaced with a `<div>`, no matter what the original's type - an `<li data-product-id="...">` would become a `<div>`.
* We can still use normal WP templating functions like `the_permalink()` in the Vue template.

## Reference

All custom components contain two [slots](https://vuejs.org/v2/guide/components.html#Named-Slots), one named `before` and one fallback slot that is rendered below the component's content.

* `product-add` - Creates a button that fires the `addToCart` event.

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
