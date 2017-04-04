<template>
    <span class="wpshop-product-price">{{ price }}</span>
</template>

<script>
    export default {
        name: 'price',
        computed: {
            price () { return _.get( this.$root, 'selectedVariant.attrs.variant.price') }
        }
    }
</script>
