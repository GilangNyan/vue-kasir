<script>
import { useAuthStore } from '../../../stores/auth'

export default {
    name: "usersettingsdropdown",
    setup() {
        const authStore = useAuthStore()

        return { authStore }
    },
    data() {
        return {
            isOpen: false
        }
    },
    props: {
        sidebarMinimized: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        async logoutUser() {
            await this.authStore.logoutUser()
            this.$router.push({ name: "auth.login" })
        },
    }
}
</script>

<template>
    <button type="button" @click="isOpen = !isOpen"
        class="text-xl text-neutral-500 dark:text-slate-300 hover:text-neutral-700 dark:hover:text-slate-200">
        <font-awesome-icon icon="fa-solid fa-gear"></font-awesome-icon>
    </button>
    <div class="fixed z-10 inset-0 h-full w-full" v-show="isOpen" @click="isOpen = !isOpen"></div>
    <Transition name="fadeup">
        <div class="absolute w-40 z-20 bottom-8 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 flex flex-col items-center shadow-lg divide-y dark:divide-slate-700"
            :class="sidebarMinimized ? '-left-1' : '-right-1'" v-show="isOpen">
            <a href="#"
                class="w-full font-semibold text-sm px-4 py-3 space-x-2 text-neutral-500 dark:text-slate-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <font-awesome-icon icon="fa-solid fa-user" /><span>Profil</span>
            </a>
            <a href="#"
                class="w-full font-semibold text-sm px-4 py-3 space-x-2 text-neutral-500 dark:text-slate-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer"
                @click.prevent="logoutUser()">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" /><span>Logout</span>
            </a>
        </div>
    </Transition>
</template>

<style>
.fadeup-enter-active,
.fadeup-leave-active {
    @apply transition-all duration-150 ease-out
}

.fadeup-enter-from,
.fadeup-leave-to {
    @apply opacity-0 translate-y-4
}
</style>