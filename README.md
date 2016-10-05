```
A Wordpress-Shopify Integration plugin by Funkhaus
      ___ _   _ _  _ _  __
     | __| | | | \| | |/ /
     | _|| |_| | .` | ' <
     |_| _\___/|_|\_|_|\_\
     | || | /_\| | | / __|
     | __ |/ _ \ |_| \__ \
     |_||_/_/ \_\___/|___/

```

# What is it?
wp-shopify is an integration tool built around the [Shopify Buy API](https://help.shopify.com/api/sdks/js-buy-sdk).

From a high-level perspective, the plugin allows you to easily add a basic e-commerce store into a Wordpress site without having to get your hands dirty in all the messy logic that comes with e-commerce projects. It allows you to write templates and develop a theme just as you normally would, pulling product and cart data straight from Shopify and leveraging the API for all the hard work.

# How do I use it?
The basic workflow looks like this:

1. Set up a shopify store, you only need to enable the [Buy Button Channel](https://www.shopify.com/buy-button)
1. Set up a section of your Wordpress site to put products in using pages. A common structure might be something like this:
      * __Store__
        * Product 1
        * Product 2
        * Product 3
1. Link each product page in Wordpress to a Shopify product using the page metadata.
1. Route and template your theme just like you normally would. When you want to display information from Shopify about a product, you can easily do so using a combination of the page metadata and custom data-attributes. For example:
```html
<?php // First, associate the div with a product, using the_product_id() ?>
<div data-product-id="<?php the_product_id(); ?>">
    <?php // Next, use a custom data attribute to autopopulate the product's title ?>
    <div data-product="title"></div>
</div>
```
1. Add a cart (or carts) to your theme wherever you want. Just like information for individual products, carts are templated with regular html and given specific data-attributes to tell this plugin to fill them with Shopify data.
1. Add a checkout link to your site. When the user clicks this, they will be sent off to the checkout section of Shopify with all of their cart data. Shopify will handle the rest. For example:
```html
<?php // Make sure this is an <a> element and contained within a div with data-product-id set ?>
<a href="#" data-cart="checkout">Checkout</a>
```

## Setting Up
To set up the plugin, download this repo and drop it into your plugins folder. Enable it through the settings and then navigate to __Tools > Shopify__. 

Put in your API key, Shopify domain, and app ID. More info here on where to find that: https://help.shopify.com/api/guides/api-credentials

The next step after that id to create a page(s) that will serve as a placeholder for an individual product(s). Create and name the page as you normally would, you should see a new metabox under the page content that has a field for the product ID. The easiest way to find the ID of a product is to navigate to the "edit" page for that product within Shopify, and copy the last section of the URL for that page. 

i.e. If when editing the product your url is: *example.myshopify.com/admin/products/__12345__*, then the ID for that product is __12345__.

Once you have at least one product set up, and the Shopify ID saved, then you're ready to start building templates.

### Setting Up External Custom Styling
If you want custom styling on the Shopify side of the site, you'll need to set up a couple files on your Shopify account. _Remember that you'll still have to edit any email notifications by hand in your Shopify account settings._

__If you just want to be able to edit the CSS in the Shopify editor__, you can upload `/shopify/wp-shopify-theme` at your store's `admin/themes` page. You can edit `wp-shopify.css` in the Assets folder from there and see your changes immediately.

__If you want to set up custom external styling (say, from a CSS file hosted on your own server)__, go to your Shopify themes page (`https://YOUR-STORE-NAME.myshopify.com/admin/themes`), click the ellipsis to the left of 'Customize Theme', and click 'Edit HTML/CSS.' Add in this line: `<link rel="stylesheet" href="YOUR_STYLESHEET_URL_HERE">` to load in an external stylesheet.

**Note that you'll need to deliver your stylesheet over `https` rather than `http` because of Shopify's security settings** - usually this is just a matter of adding the `s` to `http` in the URL.

## Product Markup

When writing the markup for an individual product, be it in a grid or on a detail page, you need to first identify the product using the data-attribute `data-product-id`. 

You can use the wrapper functions `get_the_product_id($post)` (which returns the product ID, if any, attached to a post) and `the_product_id($post)` (which echoes the product ID attached to a post) to get a product ID. Note that `$post` is optional in both these wrappers and defaults to the current post.

You can then fill whatever markup you need to within that element, and when you need to pull data about the product from Shopify, just specify the type of data using the data-attribute `data-product`.

### Product data-attribute Reference

- __`data-product="title"`__: The Shopify title of the product.
- __`data-product="price"`__: The price of the product, does not include symbol of currency.
- __`data-product="description"`__: The Shopify description of the product.
- __`data-product="type"`__: The Shopify product-type of the product.
- __`data-product="image"`__: The featured image of the product from Shopify. Image will be inserted into the element as an img tag.
- __`data-product="gallery"`__: A gallery of images attached to your product in Shopify. Rendered using `wshop-templates/product-gallery.php`.
- __`data-product="select"`__: If the product has any variants, this element will be filled with a `<select>` that when changed by the user will switch out which variant of the product is being selected.
- __`data-product="add-to-cart"`__: When clicked, the element with this data-attribute will add the product (or currently selected variant of the product) to the current user's cart.

Using the above list of attributes, you can fill in whatever product information you need. Here is an example:

Starting with the containing element of the product, we need to tell wp-shopify which product we are working with. Assuming you are in the loop, this is how you start: 

```html
<div class="single-product" data-product-id="<?php the_product_id(); ?>"></div>
```

The ID you saved to the product in Wordpress was saved with the key `_wshop_product_id`, which was accessed and echoed with `the_product_id()`, so the line above will tell wp-shopify that everything within this div will be in reference to this product's ID.

Let's add some basic data to the product:

```html
<div class="single-product" data-product-id="<?php the_product_id(); ?>">

      <div class="image" data-product="image"></div>

      <h3 data-product="title"></h3>
      <div class="price">$<span data-product="price"></span></div>
      <div class="select" data-product="select"></div>

      <div class="description" data-product="description"></div>

      <button data-product="add-to-cart">Add To Cart</button>

</div>
```

That's all that we need for the information to be filled in. When this markup is rendered on the front end, wp-shopify will automatically fill in the necessary information and set up some javascript listeners to handle user interactions.

### What's Going on Behind the Scenes

First, wp-shopify includes the javascript buy SDK off of Shopify's servers. It waits for the document ready event, and then looks for any elements on the page with `data-product-id` set. If it finds any, it fetches all the necessary data from Shopify's servers and saves all of the information. It then searches through child elements of each product and fills in any necessary data based on the data-attributes.

The process of filling in the data for an individual product is wrapped in the function `wshop.renderProduct`. With this information, manually re-rendering the data in any single product is trivial:

```js
jQuery('.single-product').each(wshop.renderProduct);
```

Once all the data has been added, wp-shopify will set listeners on `<select>` elements, `add-to-cart` elements, and anything else that will need to interact with the state of the product.

## Cart Markup

Any carts on the page will work much in the same way as the products do. The main difference is that the information within a cart is primarily determined by the user, rather than an individual product. For that reason we don't necessarily have to specify a cart ID.

### Cart data-attribute Reference

* __`data-cart="subtotal"`__: The subtotal of the current user's cart
* __`data-cart="line-item-count"`__: The total number of items within the current cart. Defaults to 0
* __`data-cart="checkout"`__: This attribute must exist on an `<a>` tag. The href of the tag will be automatically set to be the checkout URL for the current cart. If you'd like to get the user to the checkout location by some other mechanism, you can use `wshop.cart.checkoutUrl` at any time to get the checkout URL.
* __`data-cart="line-items"`__: The element with this attribute will be populated with an html element for each line item within the cart. To modify the html that is rendered here, see [Line Item Markup](wshop-templates).
* __`data-cart="add"`__: A button that increments one of the quantity of the given item in the cart
* __`data-cart="subtract"`__: A button that decrements the quantity of one of the given item in the cart
* __`data-cart="remove"`__: A button that removes an item from the cart entirely

Using these attributes, you can build any carts you may need throughout the page. Here is an example cart:

```html
<div data-cart-id="">

    <?php // The individual items ?>
    <div data-cart="line-items">
        <?php // Each item in the cart will be rendered using /wshop-templates/cart-line-item.php here ?>
    </div>
    
    <?php // The cart summary ?>
    <div class="cart-meta">
        <div class="table">
            <div>
                <span>Total Items: </span>
                <span data-cart="line-item-count"></span>
            </div>
            <div>
                <span>Subtotal: </span>
                <span>$<span data-cart="subtotal"></span></span>
            </div>
        </div>
        <a href="#" class="checkout-button" data-cart="checkout">Checkout</a>
    </div>

</div>
```

Remember that tags marked with data attributes like `data-cart="line-items"` and `data-cart="line-item-count"` will fill themselves automatically - all you need to do is make sure the product ID metadata is set on the product's Page.

### Events

There are a few events available for you to hook into:

* `wshop-cart-initialized` is triggered on `jQuery(document)` when the cart is set up.
* `wshop-products-initialized` is triggered on `jQuery(document)` when the products have been initialized, and passes products.length as a parameter.
* `wshop-image-loaded` is triggered on its containg product block when a `data-product="image"` finishes loading its image.
* `wshop-variant-change` is triggered on its containing product block when a product variant is selected.
* `wshop-product-added` is triggered on `jQuery(document)` when a product is added to the cart.

### Classes

There are informational classes added to product wrappers upon rendering:

* `has-variants` will be added to any product that has variants on Shopify.
* `product-unavailable` will be added to any product whose inventory is less than or equal to 0 (or is unavailable for any other reason). 

### Templates

wshop includes a few standard templates, prepared using underscore.js, to help you render data efficiently:

* `wshop-templates/cart-line-item.php` renders single items in the cart.
* `wshop-templates/product-gallery.php` renders a product gallery using all images attached to a product.

--------

__wp-shopify__

http://funkhaus.us

Version: 1.0

Requires at least WP 3.8