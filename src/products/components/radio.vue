<template>
    <div class="wpshop-product-radio" v-if="options && options.length">

        <span v-for="option in options">

            <span>{{ option.name }}</span>

            <span v-for="value in option.values">

                <input
                    :name="option.name"
                    :value="value"
                    type="radio"
                    v-bind="{ id: option.name + '-' + value }"
                    v-model="option.selected"
                >

                <label v-bind="{ for: option.name + '-' + value }">
                    {{ value }}
                </label>

            </span>

        </span>

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
