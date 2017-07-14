<template>

    <span class="line-price">{{ linePrice }}</span>

</template>

<script>

export default {
    props: ['item'],
    computed: {
        linePrice(){
            return this.item.line_price
        }
    }
}

</script>
