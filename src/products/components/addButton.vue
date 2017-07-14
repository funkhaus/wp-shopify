<template>

    <button @click="$root.$emit('product-added')">
        <slot></slot>
    </button>

</template>
