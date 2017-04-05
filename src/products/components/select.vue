<template>
    <div class="wpshop-product-select" v-if="options && options.length" @click="log">

        <select v-for="option in options" v-model="option.selected">

            <option disabled>
                {{ option.name }}
            </option>

            <option
                v-for="value in option.values"
                :value="value"
            >
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
        },
        methods: {
            log(){
                console.log(this.$root.product)
            }
        }
    }
</script>
