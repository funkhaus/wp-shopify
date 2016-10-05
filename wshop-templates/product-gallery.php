<!-- BEGIN: Product gallery template -->
<script type="text/template" class="wshop-product-gallery">

    <div class="product-gallery">

        <% for( var i = 1; i < product.images.length; i++ ){ // loop through all except the first image %>

            <div class="slide">

                <img src="<%= product.images[i].src %>">

            </div>

        <% } %>

    </div>

</script>