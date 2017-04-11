<template>
    <div class="wpshop-option">

        <select
            v-if="inputMode == 'select'"
            @change="$root.$emit('option-changed', option.name, $event.target.value)">

            <option disabled>{{ option.name }}</option>

            <option
                :selected="option.selected == value"
                v-for="value in option.values"
                :value="value">
                {{ value }}
            </option>

        </select>

        <form v-else>
            RADIO
        </form>

    </div>
</template>

<script>

    export default {

        props: {
            'input-mode': {
                type: String,
                default: 'select'
            },
            option: {
                type: Object,
                default: null
            }
        },
        mounted () {
            this.$root.$on('option-changed', () => {
                this.$forceUpdate()
            })
        }

    }

</script>
