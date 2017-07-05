<template>

    <a :href="bus.cart.checkoutUrl" target="_blank"><slot></slot></a>

</template>

<script>

import bus from 'src/bus'

export default {
    data(){
        return {
            bus
        }
    }
}

</script>
