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

# Line Item Markup

When you automatically create a cart of items using the Wordpress Shopify plugin, each item will be rendered using this PHP/Underscore template.

# How Do I Use It?

You have several properties available through the `data` object accessible in the Underscore template. Some of the most useful include:

* `data.id` - a Shopify-specific alphanumeric ID.
* `data.image` - The preview image set in Shopify, including `data.image.src` (the source of the image).
* `data.line_price` - Subtotal for this product in the cart (price * quantity).
* `data.price` - Price of a single unit of this product.
* `data.product_id` - Integer ID of this product (`data.id` is alphanumeric, `data.product_id` is numeric).
* `data.quantity` - Quantity of this product in the cart.
* `data.title` - The name of this product.
* `data.variant_id` - the numeric ID for this product variant.
* `data.variant_title` - The name of this product variant.

To see the rest of the properties available, you can `console.log(wshop.cart.lineItems)` on a page with a populated cart.