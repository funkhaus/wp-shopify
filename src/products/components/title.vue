<template>
    <span class="wpshop-product-title">{{ title }}</span>
</template>


<script>
    export default {
        name: 'title',
        computed: {
            title () { return _.get(this.$root, 'product.attrs.title') }
        }
    }
</script>
