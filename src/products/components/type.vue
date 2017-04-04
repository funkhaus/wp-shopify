<template>
    <span class="wpshop-product-type">{{ type }}</span>
</template>

<script>
    export default {
        name: 'type',
        computed: {
            type () { return _.get(this.$root, 'product.attrs.product_type') }
        }
    }
</script>
