<script>
import { useDark, useToggle } from '@vueuse/core'
import { useAuthStore } from '../../stores/auth'

export default {
    setup() {
        const isDark = useDark()
        const toggleDark = useToggle(isDark)
        const authStore = useAuthStore()

        return {isDark, toggleDark, authStore}
    },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        async loginUser() {
            const statusCode = await this.authStore.loginUser(this.username, this.password)
            if(statusCode === 200){
                this.$router.push({ name: "dashboard.index" })
            }
            return statusCode
        }
    },
}
</script>

<template>
    <main class="flex items-center justify-center h-screen bg-gray-100 dark:bg-slate-900">
        <div class="bg-white dark:bg-slate-800 flex flex-col rounded-lg shadow-lg w-full md:w-96 mx-6 sm:mx-24 overflow-hidden">
            <div class="relative">
                <img src="@/assets/images/login-image.jpg" alt="Login Page Illustration" class="h-40 w-full object-cover">
                <div class="absolute z-10 top-2 right-2 bg-blue-100 flex justify-between items-center h-6 w-16 cursor-pointer rounded-lg dark:bg-slate-900 dark:text-slate-200" @click="toggleDark()">
                    <span class="flex items-center justify-center text-sm p-1 w-1/2 h-full" :class="isDark ? '' : 'toggler-active'">
                        <font-awesome-icon icon="fa-solid fa-sun" />
                    </span>
                    <span class="flex items-center justify-center text-sm p-1 w-1/2 h-full" :class="isDark ? 'toggler-active' : ''">
                        <font-awesome-icon icon="fa-solid fa-moon" />
                    </span>
                </div>
            </div>
            <div class="flex flex-col p-6 md:p-8">
                <h1 class="text-2xl mb-4 text-center text-neutral-800 dark:text-slate-200">Masuk</h1>
                <div v-if="authStore.statusCode !== null || authStore.statusCode !== 200" class="bg-pink-100 dark:bg-pink-200 p-2 rounded-lg text-center border border-pink-600 text-pink-600">
                    {{ authStore.message }}
                </div>
                <form @submit.prevent="loginUser()" class="flex flex-col mt-6 space-y-4">
                    <input type="text" v-model="username" class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Username" required>
                    <input type="password" v-model="password" class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Password" required>
                    <div class="flex justify-between items-center">
                        <div class="space-x-2 items-center">
                            <input type="checkbox" name="remember" id="remember" class="">
                            <label for="remember" class="text-sm text-neutral-600 dark:text-slate-400">Ingat Saya</label>
                        </div>
                        <RouterLink to="/" class="text-sm text-neutral-600 dark:text-slate-400">Lupa Password?</RouterLink>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <button type="submit" class="w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">Masuk</button>
                        <RouterLink :to="{ name: 'home' }"
                            class="flex justify-center w-full p-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-neutral-200 dark:hover:bg-slate-700 dark:border-blue-600 dark:text-blue-600">Kembali
                        </RouterLink>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<style scoped>
.toggler-active {
    @apply bg-blue-500 text-white rounded-lg
}
</style>