<script>
import { provide, ref } from 'vue';

export default {
    setup(props, {slots}) {
        const tabTitles = ref(slots.default().map((tab) => tab.props.title))
        const selectedTitle = ref(tabTitles.value[0])

        provide('selectedTitle', selectedTitle)
        return {
            tabTitles, selectedTitle
        }
    }
}
</script>

<template>
    <ul class="relative w-max mx-auto p-1 grid grid-cols-3 items-center rounded-full overflow-hidden bg-neutral-100 dark:bg-slate-700">
        <li v-for="title in tabTitles" :key="title" @click="selectedTitle = title" class="relative block px-4 py-2 text-center dark:text-white rounded-full cursor-pointer" :class="{selected: title == selectedTitle}">
            {{ title }}
        </li>
    </ul>
    <slot></slot>
</template>

<style scoped>
.selected {
    @apply bg-blue-500 font-semibold text-white transition-all
}
</style>