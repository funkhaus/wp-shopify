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
1. Link each product page in Wordpress to a Shopify product using the page metadata
1. Route and template your theme just like you normally would. When you want to display information from Shopify about a product, you can easily do so using a combination of [the page metadata and custom data-attributes.](google.com)
1. Add a cart (or carts) to your theme wherever you want. Just like information for individual products, carts are templated with regular html and given specific data-attributes to tell this plugin to fill them with Shopify data.
1. Add a [checkout link](google.com) to your site. When the user clicks this, they will be sent off to the checkout section of Shopify with all of their cart data. Shopify will handle the rest.

## Setting Up
To set up the plugin, download this repo and drop it into your plugins folder. Enable it through the settings and then navigate to __Tools > Shopify__. 

Put in your API key, Shopify domain, and app ID. More info here on where to find that: https://help.shopify.com/api/guides/api-credentials

The next step after that id to create a page(s) that will serve as a placeholder for an individual product(s). Create and name the page as you normally would, you should see a new metabox under the page content that has a field for the product ID. The easiest way to find the ID of a product is to navigate to the "edit" page for that product within Shopify, and copy the last section of the URL for that page. 

i.e. If when editing the product your url is: *example.myshopify.com/admin/products/__12345__*, then the ID for that product is __12345__.

Once you have at least one product set up, and the Shopify ID saved, then you're ready to start building templates.

## Product Markup

When writing the markup for an individual product, be it in a grid or on a detail page, you need to first identify the product using the data-attribute `data-product-id`. You can then fill whatever markup you need to within that element, and when you need to pull data about the product from Shopify, just specify the type of data using the data-attribute `data-product`.

### Data-attribute Reference

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
1. Link each product page in Wordpress to a Shopify product using the page metadata
1. Route and template your theme just like you normally would. When you want to display information from Shopify about a product, you can easily do so using a combination of [the page metadata and custom data-attributes.](google.com)
1. Add a cart (or carts) to your theme wherever you want. Just like information for individual products, carts are templated with regular html and given specific data-attributes to tell this plugin to fill them with Shopify data.
1. Add a [checkout link](google.com) to your site. When the user clicks this, they will be sent off to the checkout section of Shopify with all of their cart data. Shopify will handle the rest.

## Setting Up
To set up the plugin, download this repo and drop it into your plugins folder. Enable it through the settings and then navigate to __Tools > Shopify__. 

Put in your API key, Shopify domain, and app ID. More info here on where to find that: https://help.shopify.com/api/guides/api-credentials

The next step after that id to create a page(s) that will serve as a placeholder for an individual product(s). Create and name the page as you normally would, you should see a new metabox under the page content that has a field for the product ID. The easiest way to find the ID of a product is to navigate to the "edit" page for that product within Shopify, and copy the last section of the URL for that page. 

i.e. If when editing the product your url is: *example.myshopify.com/admin/products/__12345__*, then the ID for that product is __12345__.

Once you have at least one product set up, and the Shopify ID saved, then you're ready to start building templates.

## Product Markup

When writing the markup for an individual product, be it in a grid or on a detail page, you need to first identify the product using the data-attribute `data-product-id`. You can then fill whatever markup you need to within that element, and when you need to pull data about the product from Shopify, just specify the type of data using the data-attribute `data-product`.

### Data-attribute Reference

- `data-product="title"`: The Shopify title of the product.
- `data-product="price"`: The price of the product, does not include symbol of currency.
- `data-product="description"`: The Shopify description of the product.
- `data-product="image"`: The featured image of the product from Shopify. Image will be inserted into the element as an img tag.
- `data-product="select"`: If the product has any variants, this element will be filled with a `<select>` that when changed by the user will switch out which variant of the product is being selected.
- `data-product="add-to-cart"`: When clicked, the element with this data-attribute will add the product (or currently selected variant of the product) to the current user's cart.

Using the above list of attributes, you can fill in whatever product information you need. Here is an example:

Starting with the containing element of the product, we need to tell wp-shopify which product we are working with. Assuming you are in the loop, this is how you start: 

```
<div class="single-product" data-product-id="<?php echo $post->_wshop_product_id; ?>"></div>
```

The ID you saved to the product in Wordpress was saved with the key `_wshop_product_id`, so the line above will tell wp-shopify that everything within this div will be in reference to this product, by ID.

Let's add some basic data to the product:

```
<div class="single-product" data-product-id="<?php echo $post->_wshop_product_id; ?>">

      <div class="image" data-product="image"></div>

      <h3 data-product="title"></h3>
      <div class="price">$<span data-product="price"></span></div>
      <div class="select" data-product="select"></div>

      <div class="description" data-product="description"></div>

      <button data-product="add-to-cart">Add To Cart</button>
</div>
```



Using the above list of attributes, you can fill in whatever product information you need. Here is an example:

Starting with the containing element of the product, we need to tell wp-shopify which product we are working with. Assuming you are in the loop, this is how you start: 

```html
<div class="single-product" data-product-id="<?php echo $post->_wshop_product_id; ?>"></div>
```

The ID you saved to the product in Wordpress was saved with the key `_wshop_product_id`, so the line above will tell wp-shopify that everything within this div will be in reference to this product, by ID.

Let's add some basic data to the product:

```html
<div class="single-product" data-product-id="<?php echo $post->_wshop_product_id; ?>">

      <div class="image" data-product="image"></div>

      <h3 data-product="title"></h3>
      <div class="price">$<span data-product="price"></span></div>
      <div class="select" data-product="select"></div>

      <div class="description" data-product="description"></div>

      <button data-product="add-to-cart">Add To Cart</button>
</div>
```

