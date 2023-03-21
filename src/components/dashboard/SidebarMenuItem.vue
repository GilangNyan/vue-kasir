<script>
export default {
    setup() {
        // 
    },
    props: {
        sidebarMinimized: {
            type: Boolean
        },
        menuType: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        routeName: {
            type: String
        },
        icon: {
            type: String
        }
    }
}
</script>

<template>
    <router-link :to="{ name: routeName }" class="flex items-center space-x-2 pl-4 py-2 border-slate-100 hover:text-neutral-600 dark:hover:text-slate-200 group" v-if="menuType == 'nav'">
        <div class="flex justify-center w-8 group-hover:translate-x-1 transition-all duration-150">
            <font-awesome-icon :icon="['fas', icon]" class="text-xl" />
        </div>
        <Transition name="slide-fade">
            <h3 class="group-hover:translate-x-1 transition-all duration-150" v-show="!sidebarMinimized">{{ label }}</h3>
        </Transition>
    </router-link>
    <div class="text-sm font-semibold pl-4 pt-2 pb-1" v-else-if="menuType == 'header'" v-show="!sidebarMinimized">
        {{ label }}
    </div>
</template>

<style scoped>
.router-link-active {
    @apply bg-blue-500 text-white hover:bg-blue-600
}
/* Transition Class */
.slide-fade-enter-active, .slide-fade-leave-active{
    @apply transition-all duration-150 ease-out
}

.slide-fade-enter-from, .slide-fade-leave-to{
    @apply -translate-x-4 opacity-0
}
</style>