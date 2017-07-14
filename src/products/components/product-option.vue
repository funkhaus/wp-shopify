<template>
    <div class="wpshop-option">
        <slot name="before"></slot>

        <select
            v-if="inputMode == 'select'"
            v-model="$root.product.options[index].selected"
            >

            <option disabled value="">{{ option.name }}</option>

            <option v-for="value in option.values">{{ value }}</option>

        </select>

        <div v-else>
            <div v-for="value in option.values">
                <input type="radio" :id="value" :value="value" v-model="$root.product.options[index].selected">
                <label :for="value">{{ value }}</label>
            </div>
        </div>

    </input>

        <slot></slot>
    </div>
</template>

<script>

    export default {
        computed: {
            index(){
                return _.findIndex(this.$root.product.options, option => option.name == this.option.attrs.name)
            }
        },
        props: {
            'input-mode': {
                type: String,
                default: 'select'
            },
            option: {
                type: Object,
                default: null
            }
        }

    }

</script>
