<!-- BEGIN: Cart line item template (this template is looped in the cart) -->
<script type="text/template" class="wshop-cart-line-item">

    <div class="line-item" data-lineitem-id="<%- data.id %>">

        <% if ( data.image ){ %>
            <div class="thumbnail">
                <img src="<%- data.image.src %>" alt="" />
            </div>
        <% } %>

        <div class="meta">
            <div class="title"><%- data.title %></div>
            <div class="controls">
<!--
                <button class="add" data-cart="add">+</button>
                <button class="subtract" data-cart="subtract">-</button>
-->
                <button class="remove" data-cart="remove">X</button>
            </div>
            <div class="price">
                <span>Price:</span>
                <span>$<%- data.price %></span>
            </div>
            <div class="size">
                <span>Size:</span>
                <span><%- data.variant_title %></span>
            </div>
            <div class="quantity">
                <span>QTY:</span>
                <span><%- data.quantity %></span>
            </div>
            <div class="line-price">
                <span>Subtotal:</span>
                <span>$<%- data.line_price %></span>
            </div>
        </div>

    </div>

</script>