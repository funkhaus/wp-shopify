## TODO
* Hide Products
* Delete unused Collections
* Ordering

## What 
wp-shopify is an integration tool built around the [Shopify Buy Button API](https://help.shopify.com/api/sdks/js-buy-sdk).

It consists of two parts:

* A tool to keep your Wordpress site synced to your Shopify store, and
* A set of convenience templating functions to ease the Wordpress store creation process.

## How

### Installation
1. Set up Shopify:
    1. Set up a Shopify store and enable the [Buy Button Channel](https://www.shopify.com/buy-button).
    1. Create an __access token__ by going to the Buy Button Extensions page at `your-site.myshopify.com/admin/apps/private/extensions` and clicking `Create Extension` in the top right corner.
1. Set up Wordpress:
    1. Download this repo and drop it into your plugins folder. Enable it through your plugin settings and then navigate to `Settings > WP-Shopify`. 
    1. Put your __access token__, Shopify domain, and app ID in the WP-Shopify settings. More info on where to find that info [here]( https://help.shopify.com/api/guides/api-credentials).
    1. Go to `Tools > Shopify` in your WP backend and hit Refresh Products. Your products and collections will auto-populate from your Shopify store.
    
### Templating

In the Installation step, you synced your product data to your Shopify store. Now you'll define how to display that data on your Wordpress site.

1. Your Shopify products are a custom post type called `wps-product`. This gives you full access to Wordpress's built-in post type functionality - see [this page](https://codex.wordpress.org/Post_Types#Custom_Post_Type_Templates) for more details.
1. **Wrap your product in an element with `data-product-id` set correctly.** For example, when in the Loop:
    
        <div class="product-wrapper" data-product-id="<?php the_product_id(); ?>">
            <!-- the_product_id() will fill in the product ID - see "Advanced -> Convenience Functions" below -->
        </div>
1. Fill the wrapper with `data-product` shortcuts and/or custom Underscore templates. See Product Templates below for examples.

Finally, prepare the markup for the cart page:

1. **Wrap your cart in an element with `data-cart-id` set.** `data-cart-id` can be left blank:

        <div data-cart-id=""></div>
        
1. Fill the wrapper with `data-cart` shortcuts and/or custom Underscore templates. See Cart Templates below for examples.

## Product Templates

#### Using `data-product`
Place any of the following attributes on elements in the `data-product-id` wrap. They will automatically fill themselves with the relevant information.

* `data-product="title"` - The product's name.
* `data-product="price"` - The price. Currency is not specified automatically.
* `data-product="description"` - The description. Includes HTML tags and formatting.
* `data-product="type"` - The product type.
* `data-product="image'` - The first image uploaded to this product on Shopify.
* `data-product="select"` - Variations (size, color, etc.) in a drop-down menu.
* `data-product="radio"` - Variations (size, color, etc.) in a radio menu.
* `data-product="add-to-cart"` - Automatically attach a click event handler to this element. When activated, the selected product (and variation, if any), will be added to the user's cart.

### Using Custom Product Templates
You can use custom [underscore.js](http://underscorejs.org/#template) templates:

```html
<div data-template="my-template-name"></div>
```

Set the `data-template` attribute equal to one of these included templates:

* `product-gallery` (renders a product gallery using all images attached to a product)
* `variants-radio` (renders a product's variants as radio buttons - does not handle callbacks! Use `data-product="radio"` to render the template and have wp-shopify set up the callbacks for you)
* `variants-select` (renders a product's variants as a dropdown menu - does not handle callbacks! Use `data-product="select"` to render the template and have wp-shopify set up the callbacks for you)

You can also build your own custom templates:

1. If one doesn't exist yet, create a folder in your theme's directory called `wshop-templates`.
1. Create a PHP file. This file's name will be the template name. For example: `wshop-templates/custom-template.php`.
1. Create an an inline script in the PHP file to serve as the Underscore template.
1. Set the script's ID to match the file name: `<script type="text/template" id="custom-template">`

Custom templates have access to the `data` variable, which contains all information about the current product returned from Shopify's API.

All contents of the `wshop-templates` directory will be included in the footer of your site, hooking into the `get_footer()` function.

## Cart Templates
Any carts on the page will work much in the same way as the products do. The main difference is that we don't necessarily have to specify a cart ID:
```html
<!-- Perfectly valid cart wrapper -->
<div data-cart-id="">

</div>
```

#### Using `data-cart`

You can use `data-cart` attributes just like `data-product`. Place any of the following attributes on elements in the `data-cart-id` wrap:

* `data-cart="line-items"` - Renders each item in the cart with the `cart-line-items` template.
* `data-cart="subtotal"` - The subtotal of the products in the cart.
* `data-cart="line-item-count"` - The number of items in the cart (default 0).
* `data-cart="checkout"` - **Must be on an <a> tag.** Sets `href` to the Shopify checkout URL. You can also access this URL in JS any time via `wshop.cart.checkoutUrl`.
* `data-cart="add"` - Add one of a given item to your cart on click. Rerenders the cart.
* `data-cart="subtract"` - Remove one of a given item from your cart on click. Rerenders the cart.
* `data-cart="remove"` - Remove all of a given item from your cart on click. Rerenders the cart.

### Using Custom Cart Templates
Custom Underscore cart templates are set up in the same way as custom product templates. You have access to a `data` variable that contains all the information about each item in a cart, as well as the quantity in the cart and other stats. For example:


```html
<script type="text/template" id="cart-line-item">
    <% console.log(data); // Log available data %>
</script>
```

## Collections

The plugin imports Shopify Collections as a custom taxonomy called `wps_collection`. 

Each Collection in Shopify becomes a term in the `wps_collection` taxonomy.

Each term has a custom piece of metadata called `_wps_collection_image` that contains the URL to the image associated with a Collection. You can set this image on Shopify, then show the image on your site like this:

`<image src="<?php echo $your_term->_wps_collection_image; ?>">` 

All functions having to do with `wps_collection` terms fall under standard Wordpress methods for dealing with custom taxonomies and terms - for example, to set up custom collection templates, create `taxonomy-wps_collection.php` in your theme (see the [Template Hierarchy](https://developer.wordpress.org/files/2014/10/template-hierarchy.png)). 

## Advanced
### Updating Products

When you add new product(s) to your Shopify store, you'll need to refresh your products in Wordpress.

From your WP backend, go to Tools > Shopify, set your refresh preferences with the checkboxes, and hit 'Refresh Products.' This will automatically pull product data from your linked Shopify store into Wordpress.

### Permalink Structure Slug

You'll see this option under Tools > Shopify. Changing its value will rewrite the store's parent directory:

```
// Permalink Structure Slug set to 'store'
your-site.com/store/product-1

// Permalink Structure Slug set to 'xyz'
your-site.com/xyz/product-1
```

### Events

There are a few events available for you to hook into:

* `wshop.cartInitialized` is triggered on `jQuery(document)` when the cart is set up.
* `wshop.productsInitialized` is triggered on `jQuery(document)` when the products have been initialized, and passes `products.length` as a parameter.
* `wshop.imageLoaded` is triggered on its containg product block when a `data-product="image"` finishes loading its image.
* `wshop.productsRendered` is triggered on `jQuery(document)` when all products have finished rendering.
* `wshop.variantChange` is triggered on its containing product block when a product variant is selected.
* `wshop.productAdded` is triggered on `jQuery(document)` when a product is added to the cart.
* `wshop.unavailableProductAdded` is trigged on the containing product block when the user attempts to add an unavailable product to their cart.
* `wshop.cartEmpty` is triggered on `jQuery(document)` when rendering a cart with 0 items in it.
* `wshop.allProductsRendered` is triggered on `jQuery(document)` when all product blocks have finised rendering.

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

There are also classes added to cart wrappers upon rendering:
* `empty-cart` will be added to an empty cart.

### Convenience Functions
wp-shopify comes with PHP convenience functions to check for, fetch, and display product IDs. Note that `$post` is optional in all of these functions and defaults to the current post.
* `has_product( $post )` returns `true` if the page has a product ID set, `false` if not.
* `get_the_product_id( $post )` is returns the product ID of a given page, as defined in the 'Product ID' metadata. If there is no product ID attached to a page, it returns a blank string.
* `the_product_id( $post )` echoes the return value of `get_the_product_id()`.

### Adding Custom Quantities to Carts
The `data-product="add-to-cart"` element will only add one of a given product to a cart. To add custom quantities, do this in your JS:

```
// html
<div data-product-id="...">
    <div id="example"> Click me to add custom quantities </div>
</div>

// js
jQuery('#example').on('click', function(){
    // the custom quantity (any integer)
    var quantity = 5; 
    
    // bind `wshop.addToCart` to `this`, then pass the custom quantity
    wshop.addToCart.bind(this)(quantity);
});
```

`addToCart.bind(this)` makes sure that the addToCart function looks for `this`'s product wrapper and adds the appropriate amount and variant.

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

## Starting Points
Product wrapper:
```html
<div data-product-id="<?php the_product_id(); ?>">

</div>
```
Cart wrapper:
```html
<div data-cart-id="">

</div>
```
Custom Underscore template:
```html
<!-- Begin custom template: custom-template.php -->
<script type="text/template" id="custom-template">
    <% console.log(data); // Show the current information available %>
</script>
```



--------

__wp-shopify__

http://funkhaus.us

Version: 1.2 - Added Collections capability

Requires at least WP 3.8