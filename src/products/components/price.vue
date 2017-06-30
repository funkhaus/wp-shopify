<template>
    <span class="price-wrap">
        <slot name="before"></slot>
        <span class="wpshop-product-price">{{ price }}</span>
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: 'price',
        computed: {
            price () { return _.get( this.$root, 'selectedVariant.attrs.variant.price') }
        }
    }
</script>
