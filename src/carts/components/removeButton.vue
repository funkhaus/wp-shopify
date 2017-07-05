<template>

    <button @click="remove">X</button>

</template>

<script>
import bus from 'src/bus'

export default {
    props: ['item'],
    methods: {
        remove(){
            bus.cart.updateLineItem(this.item.id, 0)
        }
    }
}

</script>
