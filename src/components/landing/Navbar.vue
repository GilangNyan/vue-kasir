<script setup>
const menus = [{ name: "Home", url: "/" }, { name: "Katalog", url: "/katalog" }, { name: "Tentang", url: "/about" }, { name: "Kontak", url: "/kontak" }]
</script>

<template>
    <nav class="flex items-center justify-between px-24 py-8 max-w-screen-xl mx-auto">
        <RouterLink to="/" class="flex items-center space-x-2">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="24" height="24" />
            <span class="text-2xl font-bold tracking-wide">Kasir<span class="text-blue-500">ku</span></span>
        </RouterLink>
        <div class="flex items-center space-x-10">
            <ul class="flex items-center space-x-8">
                <li class="font-medium text-gray-800 group" v-for="menu in menus">
                    <RouterLink :to="menu.url">{{ menu.name }}</RouterLink>
                    <div
                        class="h-0.5 bg-blue-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out">
                    </div>
                </li>
            </ul>
            <RouterLink :to="{name: 'auth.login'}" class="px-4 py-2 bg-blue-500 rounded-lg text-white space-x-1 hover:bg-blue-700"><font-awesome-icon icon="fa-solid fa-right-to-bracket" /><span>Masuk</span></RouterLink>
        </div>
    </nav>
</template>

<style scoped>
li > .router-link-active {
    @apply text-blue-500;
}
</style>