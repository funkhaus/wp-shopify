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

# TODO
* Convert `data-product="select"` to radio

# Table of Contents
1. What Is It?
1. Installation
1. How to Use
    1. Setting Up a Product
    1. Product Templating Reference
        1. `data-product` Shortcuts
        1. Custom Templates
    1. Setting Up a Cart
1. Examples
1. Advanced
    1. Wrapper Classes
    1. Convenience PHP Functions
    1. Events

## What is it?
wp-shopify is an integration tool built around the [Shopify Buy API](https://help.shopify.com/api/sdks/js-buy-sdk).

wp-shopify integrates a basic e-commerce store into a Wordpress site without having to get your hands dirty in all the messy logic that comes with e-commerce projects. You can write templates and develop a theme just as you normally would, pulling product and cart data straight from Shopify and leveraging the API for all the hard work.

## Installation

### Shopify
First, you'll need your Shopify store up and running.

1. Set up a Shopify store and enable the [Buy Button Channel](https://www.shopify.com/buy-button).
1. Create an access token by going to the Buy Button Extensions page at your-site.myshopify.com/admin/apps/private/extensions and clicking **Create Extension** in the top right corner.
1. Add any product(s) you'll be selling.

### Wordpress
After Shopify has been set up, you'll be able to start the Wordpress installation.

1. Download this repo and drop it into your plugins folder. Enable it through your plugin settings and then navigate to __Tools > Shopify__. 
1. Put in your API key (the access token from step 2 above), Shopify domain, and app ID. More info here on where to find that: https://help.shopify.com/api/guides/api-credentials

You can now start creating a page or pages that will serve as a placeholder for an individual product. 

## How to Use
After installation, you'll need to set up both your product on Shopify and a page for that product in Wordpress.

### Setting Up a Product Page
1. Create and name a page for a product as you normally would in Wordpress.
1. You should see a new metabox under the page content that has a field for the product ID. Fill in the product ID from your Shopify store. 
     * The easiest way to find the ID of a product is to navigate to the "edit" page for that product within Shopify, and copy the last section of the URL for that page. For example, if when editing the product your url is *example.myshopify.com/admin/products/__12345__*, then the ID for that product is __12345__.

Once you have at least one product set up and the Shopify ID saved, then you're ready to start templating product information.

### Product Templating Reference
First, **prepare a wrapper for your product.** Include a `data-product-id` attribute set to the product ID.
```html
<div class="product-wrapper" data-product-id="<?php the_product_id(); ?>">
    <!-- the_product_id() will fill in the product ID - see "Advanced" below -->
</div>
```

Inside your wrapper, you can use any combination of these features to display product information:
* `data-product` shortcuts to display basic information, and/or
* Custom templates for more in-depth display control.

#### `data-product` Shortcuts
You can set the attribute `data-product` on any HTML tag to fill in some common information about products pulled from Shopify.

First, we create the product wrapper:

```html
<div data-product-id="<?php the_product_id(); ?>">
    
</div>
```

Next, we can fill in the following product attributes:

```html
<div data-product-id="<?php the_product_id(); ?>">

      <!-- Fills the h3 tags with the product's name. -->
      <h3 data-product="title"></h3>
      
      <!-- Fills the span tags with the product's price. Note that we needed to specify currency type. -->
      <div>$<span data-product="price"></span></div>

      <!-- Fills the div with the description of the product. Includes HTML tags and formatting from Shopify. -->
      <div data-product="description"></div>
      
      <!-- Fills in the product-type. -->
      <div data-product="type"></div>
      
      <!-- Places first image of the product in this div. -->
      <div data-product="image"></div>
      
      <!-- Show any variations of the product in a dropdown menu. -->
      <div data-product="select"></div>

      <!-- Attach event handlers to this button indicating that the selected product (and selected variant, if variations exist) will be added to the Shopify cart. -->
      <button data-product="add-to-cart">Add To Cart</button>

</div>
```

See the Examples section for more information.

### Custom Templates

If you want more control over rendering data, you can use custom [underscore.js](http://underscorejs.org/#template) templates. Simply include a `data-template` attribute on your target element and set the value to your template's name.

```html
<div data-template="my-template-name"></div>
```

#### Included Templates Reference
wp-shopify includes a few standard templates:

* `cart-line-item` renders single items in the cart.
* `product-gallery` renders a product gallery using all images attached to a product.

For example, to use the included gallery template (and avoid needing to touch any Underscore code):

```html
<div data-product-id="<?php the_product_id(); // Don't forget the product wrapper! ?>">
    <div data-template="product-gallery"></div>
</div>
```

This will automatically create a gallery of `img` elements in the inner `div`, using wp-shopify's built-in template.

#### Custom Templates Reference
To create your own templates, follow these steps:

1. If one doesn't exist yet, create a folder in your theme's directory called `wshop-templates`.
1. Create a PHP file. This file's name will be the template name. For example: `wshop-templates/custom-template.php`.
1. Create an an inline script in the PHP file to serve as the Underscore template.
1. **Set the script's ID to match the file name.** For example: 

```html
<!-- Begin custom template: custom-template.php -->
<script type="text/template" id="custom-template">
    <% console.log(data); // Show the current information available %>
</script>
```
In this script, you have access to the `data` variable, which contains all information about the current product returned from Shopify's API.

That's it! All contents of the `wshop-templates` directory will be included in the footer of your site, hooking into the `get_footer()` function. You can have full control over the data you received from Shopify this way. See the Examples section for more information.

## Setting Up a Cart
Any carts on the page will work much in the same way as the products do. The main difference is that the information within a cart is primarily determined by the user, rather than an individual product. For that reason we don't necessarily have to specify a cart ID.

### Cart `data`-attribute Reference
Remember to wrap the cart with a data-cart-id, even if the data-cart-id is empty!

```html
<div data-cart-id="">

    <!-- The individual items -->
    <div data-cart="line-items">
        <!-- Each item in the cart will be rendered using wshop-templates/cart-line-item.php here -->
    </div>
    
    <!-- The subtotal of the user's cart -->
    <div data-cart="subtotal"></div>
    
    <!-- The total number of items in the current cart (default 0) -->
    <div data-cart="line-item-count"></div>
 
    <!-- MUST BE AN <a> TAG. href will automatically be set to Shopify checkout URL. You can also use wshop.cart.checkoutUrl at any time to get the checkout URL. -->
    <a data-cart="checkout">Checkout</a>
    
    <!-- Increment one of the quantity of the given item in the cart -->
    <div data-cart="add"></div>
    
    <!-- Decrement one of the quantity of the given item in the cart -->
    <div data-cart="subtract"></div>
    
    <!-- Remove an item from the cart entirely -->
    <div data-cart="remove"></div>

</div>
```

### Cart Custom Templates Reference
Custom Underscore cart templates are set up in the same way as custom product templates. You have access to a `data` variable that contains all the information about each item in a cart, as well as the quantity in the cart and other stats. For example:

```html
<script type="text/template" id="cart-line-item">
    <% console.log(data); // Log available data %>
</script>
```

## Examples
Assuming we have a product on Shopify with the following information:
* *Name:* Foo
* *Price:* $50
* *Description:* Sample Description

We can create a template like this:
```html
<div data-product-id="<?php the_product_id(); ?>">

    My product's name is <span data-product="title"></span>.
    My price is $<span data-product="price"></span>.
    Click <span data-product="add-to-cart">here</span> to add me to the cart.

</div>

<div data-cart-id="">

    <div data-cart="line-items"></div>
    <a data-cart="checkout">Checkout</a>

</div>
```

And a custom line-items template like this (contained in `wshop-templates/cart-line-item.php`):

```html
<script type="text/template" id="cart-line-item">
    Cart Item: <%= data.quantity %> <%= data.title %>(s)
    
    <% if( data.attrs.product_type ){ // A sample data attribute from Shopify %>
        <%= data.attrs.product_type %>
    <% } else { %>
        No product type specified!
    <% } %>
    
    <span data-cart="remove">Remove</span>

</script>
```

Which will render like this:

```html

My product's name is Foo.
My price is $50.
Click here to add me to the cart. [Clicking 'here' adds the item to the cart, as shown below]

Cart Item: 1 Foo(s)
No product type specified!
Remove [Clicking removes this item from the cart]
Checkout [Links to Shopify checkout]

```

## Advanced
### Events

There are a few events available for you to hook into:

* `wshop.cartInitialized` is triggered on `jQuery(document)` when the cart is set up.
* `wshop.productsInitialized` is triggered on `jQuery(document)` when the products have been initialized, and passes `products.length` as a parameter.
* `wshop.imageLoaded` is triggered on its containg product block when a `data-product="image"` finishes loading its image.
* `wshop.variantChange` is triggered on its containing product block when a product variant is selected.
* `wshop.productAdded` is triggered on `jQuery(document)` when a product is added to the cart.

For example: 
```js
jQuery(document).on('wshop.productAdded'), function(){ 
    console.log('Product added!'); 
});
```

### Wrapper Classes
There are informational classes added to product wrappers upon rendering:
* `has-variants` will be added to any product that has variants on Shopify.
* `product-unavailable` will be added to any product whose inventory is less than or equal to 0 (or is unavailable for any other reason). 

### Convenience Functions
wp-shopify comes with PHP convenience functions to check for, fetch, and display product IDs. Note that `$post` is optional in all of these functions and defaults to the current post.
* `has_product( $post )` returns `true` if the page has a product ID set, `false` if not.
* `get_the_product_id( $post )` is returns the product ID of a given page, as defined in the 'Product ID' metadata. If there is no product ID attached to a page, it returns a blank string.
* `the_product_id( $post )` echoes the return value of `get_the_product_id()`.

### Overriding Included Templates
Making a file with the same name as one of the included templates will override that template - so, for example, if you create a `product-gallery` template in your theme's `wshop-templates` directory, it will override the plugin's default `product-gallery` template.
### Setting Up External Custom Styling
If you want custom styling on the Shopify side of the site, you'll need to set up a couple files on your Shopify account. _Remember that you'll still have to edit any email notifications by hand in your Shopify account settings._

__If you just want to be able to edit the CSS in the Shopify editor__, you can upload `/shopify/wp-shopify-theme` at your store's `admin/themes` page. You can edit `wp-shopify.css` in the Assets folder from there and see your changes immediately.

__If you want to set up custom external styling (say, from a CSS file hosted on your own server)__, go to your Shopify themes page (`https://YOUR-STORE-NAME.myshopify.com/admin/themes`), click the ellipsis to the left of 'Customize Theme', and click 'Edit HTML/CSS.' Add in this line: `<link rel="stylesheet" href="YOUR_STYLESHEET_URL_HERE">` to load in an external stylesheet.

**Note that you'll need to deliver your stylesheet over `https` rather than `http` because of Shopify's security settings** - usually this is just a matter of adding the `s` to `http` in the URL.

## What's Going on Behind the Scenes

First, wp-shopify includes the javascript buy SDK off of Shopify's servers. It waits for the document ready event, and then looks for any elements on the page with `data-product-id` set. If it finds any, it fetches all the necessary data from Shopify's servers and saves all of the information. It then searches through child elements of each product and fills in any necessary data based on the data-attributes.

The process of filling in the data for an individual product is wrapped in the function `wshop.renderProduct`. With this information, manually re-rendering the data in any single product is trivial:

The ID you saved to the product in Wordpress was saved with the key `_wshop_product_id`, which was accessed and echoed with `the_product_id()`. The line above will tell wp-shopify that everything within this div will be in reference to this product's ID.

```js
jQuery('.single-product').each(wshop.renderProduct);
```

Once all the data has been added, wp-shopify will set listeners on `<select>` elements, `add-to-cart` elements, and anything else that will need to interact with the state of the product.

--------

__wp-shopify__

http://funkhaus.us

Version: 1.0

Requires at least WP 3.8