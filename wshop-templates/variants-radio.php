<!-- Begin custom template: variants-radio.php -->
<script type="text/template" id="variants-radio">

    <% data.options.forEach(function(option){ %>

        <form class="variants-wrap">

            <% option.values.forEach(function(variant){  %>

                <input type="radio" name="<%= option.name %>" value="<%= variant %>"> <%= variant %>

            <% }); %>

        </form>

    <% }); %>

</script>