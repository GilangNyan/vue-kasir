<script>
import { inject } from 'vue';

export default {
    props: ['title'],
    setup() {
        const selectedTitle = inject('selectedTitle')

        return {
            selectedTitle
        }
    }
}
</script>

<template>
    <div v-if="title == selectedTitle">
        <slot></slot>
    </div>
</template>