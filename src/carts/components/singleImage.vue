<template>

    <div class="thumbnail">
        <img :src="item.attrs.image.src">
    </div>

</template>

<script>

export default {
    props: ['item']
}

</script>
