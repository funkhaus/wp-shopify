<!-- Begin custom template: variants-select.php -->
<script type="text/template" id="variants-select">

    <% data.options.forEach(function(option){ %>

        <select name="<%= option.name %>" class="variants-select">

            <option selected disabled>
                <%= option.name %>
            </option>

            <% option.values.forEach(function(value){ %>

                <option value="<%= value %>">
                    <%= value %>
                </option>

            <% }); %>

        </select>

    <% }); %>


</script>