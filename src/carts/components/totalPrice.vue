<template>

    <span class="total-price">{{ totalPrice }}</span>

</template>

<script>
import bus from 'src/bus'

export default {
    computed: {
        totalPrice(){
            return bus.cart.subtotal
        }
    }
}

</script>
