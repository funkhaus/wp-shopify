<template>

    <button @click="addToCart">
        <slot></slot>
    </button>

</template>

<script>

export default {
    methods: {
        addToCart(){

            if( this.$root.productUnavailable ){
                alert('unavailable')
            } else {
                alert('added')
            }

        }
    }

}

</script>
