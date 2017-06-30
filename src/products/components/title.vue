<template>
    <span class="title-wrap">
        <slot name="before"></slot>
        <span class="wpshop-product-title">{{ title }}</span>
        <slot></slot>
    </span>
</template>


<script>
    export default {
        name: 'title',
        computed: {
            title () { return _.get(this.$root, 'product.attrs.title') }
        }
    }
</script>
