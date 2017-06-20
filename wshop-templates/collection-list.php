<!-- BEGIN: Collections list template -->
<script type="text/template" id="collection-list">

    <ul class="collection-list">

        <% data.forEach(function(collection){ %>

            <% console.log(collection); %>

            <li>

                <% if( collection.attrs.image ){ %>
                    <img src="<%= collection.attrs.image.src %>">
                <% } %>

                <%= collection.attrs.title %>

            </li>

        <% }); %>

    </ul>

</script>