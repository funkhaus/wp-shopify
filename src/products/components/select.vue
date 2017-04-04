<template>
    <div class="wpshop-product-select">

        <select v-for="option in options" >

            <option selected disabled>{{ option.name }}</option>

            <option v-for="value in option.values">
                {{ value }}
            </option>

        </select>

    </div>
</template>

<script>
    export default {
        computed: {
            options () {
                return _.get(this.$root, 'product.options')
            }
        }
    }
</script>
