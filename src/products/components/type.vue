<template>
    <span class="type-wrap">
        <slot name="before"></slot>
        <span class="wpshop-product-type">{{ type }}</span>
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: 'type',
        computed: {
            type () { return _.get(this.$root, 'product.attrs.product_type') }
        }
    }
</script>
