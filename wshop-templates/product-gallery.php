<!-- BEGIN: Product gallery template -->
<script type="text/template" id="gallery-template">

    <div class="product-gallery">

        <% for( var i = 1; i < product.images.length; i++ ){ // loop through all except the first image %>

            <div class="slide" style="background-image: url(<%= product.images[i].src %>);">

                <img src="<%= data.images[i].src %>">

            </div>

        <% } %>

    </div>

</script>