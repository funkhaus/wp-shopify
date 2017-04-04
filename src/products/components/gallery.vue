<template>
    <div class="wps-product-gallery">
        <product-image
            v-for="(image, index) in images"
            :image="image"
            :key="index"
        ></product-image>
    </div>
</template>

<script>
    export default {
        name: 'gallery',
        computed: {
            images () {
                return _.get(this.$root, 'product.attrs.images') || []
            }
        }
    }
</script>
