<template>
    <div class="wpshop-product-select" v-if="options && options.length">

        <product-option
            v-for="(option, i) in $root.product.options"
            :key="i"
            input-mode="select"
            :option="option">
        </product-option>

    </div>
</template>

<script>
    import productOption from './product-option.vue'

    export default {
        components: {
            'product-option': productOption
        },
        computed: {
            options () {
                return _.get(this.$root, 'product.options')
            }
        }
    }
</script>
