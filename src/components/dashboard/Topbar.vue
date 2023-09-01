<script>
import { useSidebarStore } from '../../stores/sidebar'
import { useAuthStore } from '../../stores/auth'
import { useDark, useToggle } from '@vueuse/core'
import NotificationsDropdown from './dropdown/NotificationsDropdown.vue'

export default {
    setup() {
        const sidebar = useSidebarStore()
        const authStore = useAuthStore()
        const isDark = useDark()
        const toggleDark = useToggle(isDark)

        const switcher = () => sidebar.switcher()

        return {
            sidebar, isDark, toggleDark, switcher, authStore
        }
    },
    methods: {
        screenWidthChecker(width) {
            this.sidebar.screenWidthChecker(width)
        }
    },
    components: {
        NotificationsDropdown
    },
    mounted() {
        this.screenWidthChecker(screen.width)
    },
}
</script>

<template>
    <div class="fixed top-0 left-0 px-4 py-2 w-full bg-white shadow-lg flex items-center justify-between lg:static lg:w-auto lg:shadow-none lg:bg-transparent lg:justify-end dark:bg-slate-800 lg:dark:bg-transparent">
        <!-- Sidebar Opener -->
        <button type="button" class="lg:hidden dark:text-slate-200" @click="switcher()">
            <font-awesome-icon icon="fa-solid fa-bars" class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-6">
            <!-- To Kasir -->
            <router-link :to="{name: 'dashboard.kasir'}" class="flex items-center space-x-2 text-neutral-500 dark:text-slate-400 hover:text-neutral-600 dark:hover:text-slate-200">
                <font-awesome-icon icon="fas fa-cash-register" />
                <h3>Kasir</h3>
            </router-link>
            <!-- Dark Mode Toggler -->
            <div class="bg-blue-100 flex justify-between items-center h-6 w-16 cursor-pointer rounded-lg dark:bg-slate-900" @click="toggleDark()">
                <span class="flex items-center justify-center text-sm p-1 w-1/2 h-full dark:text-slate-200" :class="isDark ? '' : 'toggler-active'">
                    <font-awesome-icon icon="fa-solid fa-sun" />
                </span>
                <span class="flex items-center justify-center text-sm p-1 w-1/2 h-full" :class="isDark ? 'toggler-active' : ''">
                    <font-awesome-icon icon="fa-solid fa-moon" />
                </span>
            </div>
            <!-- Notification -->
            <NotificationsDropdown />
            <!-- User Greeting -->
            <div class="flex text-right items-center space-x-4">
                <div class="hidden lg:block">
                    <p class="dark:text-slate-200">Halo, <b>{{ authStore.user.fullname }}</b></p>
                    <small class="text-xs text-neutral-400 dark:text-slate-400">{{ authStore.user.email }}</small>
                </div>
                <img src="@/assets/images/default.png" alt="Profile Photo" class="h-10 rounded-full">
            </div>
        </div>
    </div>
</template>

<style scoped>
.toggler-active {
    @apply bg-blue-500 text-white rounded-lg
}
.router-link-active {
    @apply text-neutral-600 dark:text-slate-200
}
</style>