<script>
import { useSidebarStore } from '../../stores/sidebar'
import { useAuthStore } from '../../stores/auth'
import SidebarMenuItem from './SidebarMenuItem.vue'
import UserSettingsDropdown from './dropdown/UserSettingsDropdown.vue'

export default {
    setup() {
        const sidebarStore = useSidebarStore()
        const authStore = useAuthStore()

        const switcher = () => sidebarStore.switcher()

        return {sidebarStore, authStore, switcher}
    },
    data: () => ({
        sidebarMinimized: false,
        menuTree: [
            {
                type: "nav",
                label: "Dashboard",
                route: "dashboard.index",
                icon: "fa-gauge-high"
            },
            {
                type: "header",
                label: "Manajemen"
            },
            {
                type: "nav",
                label: "Kategori",
                route: "dashboard.kategori",
                icon: "fa-layer-group"
            },
            {
                type: "nav",
                label: "Produk",
                route: "dashboard.produk",
                icon: "fa-box"
            },
            {
                type: "nav",
                label: "Kelola Stok",
                route: "dashboard.stok",
                icon: "fa-boxes-stacked"
            },
            {
                type: "nav",
                label: "Customer",
                route: "dashboard.customer",
                icon: "fa-users"
            },
            {
                type: "nav",
                label: "Supplier",
                route: "dashboard.supplier",
                icon: "fa-truck"
            },
            {
                type: "nav",
                label: "Transaksi",
                route: "dashboard.transaksi",
                icon: "fa-right-left"
            },
            {
                type: "header",
                label: "Laporan"
            },
            {
                type: "nav",
                label: "Penjualan",
                route: "dashboard.laporan",
                icon: "fa-chart-column"
            },
            {
                type: "nav",
                label: "Per Produk",
                route: "dashboard.lapproduk",
                icon: "fa-chart-column"
            },
            {
                type: "nav",
                label: "Forecast",
                route: "dashboard.forecast",
                icon: "fa-chart-column"
            },
            {
                type: "header",
                label: "Pengaturan"
            },
            {
                type: "nav",
                label: "Pengguna",
                route: "dashboard.user",
                icon: "fa-user"
            },
            {
                type: "nav",
                label: "Satuan",
                route: "dashboard.satuan",
                icon: "fa-weight-scale"
            },
        ]
    }),
    computed: {
        open() {
            return this.sidebarStore.open
        },
    },
    methods: {
        minimizeSidebar() {
            this.sidebarMinimized = !this.sidebarMinimized
            this.$emit('sidebar', this.sidebarMinimized)
        },
    },
    components: {
        SidebarMenuItem, UserSettingsDropdown
    },
    async created() {
        return await this.authStore.getMe()
    }
}
</script>

<template>
    <aside class="min-h-screen bg-white fixed z-10 shadow-lg transition-width duration-300 lg:block xl:shadow-none dark:bg-slate-800" :class="sidebarMinimized ? 'w-16' : 'w-72'" v-show="open">
        <div class="flex items-center p-4 relative">
            <div class="flex items-center space-x-2">
                <img alt="Vue logo" class="w-8" src="@/assets/logo.svg" />
                <Transition name="slide-fade">
                    <h1 class="text-2xl font-bold tracking-wide dark:text-slate-200" v-show="!sidebarMinimized">Admin<span class="text-blue-500">ku</span></h1>
                </Transition>
            </div>
            <button type="button" class="cursor-pointer absolute rounded-full bg-white dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 text-md dark:text-slate-200 w-7 h-7 -right-3 bottom-1" @click="minimizeSidebar()">
                <font-awesome-icon icon="fa-solid fa-angles-left" v-if="!sidebarMinimized" />
                <font-awesome-icon icon="fa-solid fa-angles-right" v-else />
            </button>
        </div>
        <nav class="flex flex-col space-y-1 mt-8 mb-auto text-neutral-500 dark:text-slate-400">
            <SidebarMenuItem v-for="(item, index) in menuTree" :sidebarMinimized="sidebarMinimized" :menuType="item.type" :label="item.label" :routeName="item.route" :icon="item.icon" />
        </nav>
        <div class="sticky top-[100vh] bg-neutral-100 dark:bg-slate-700">
            <div class="px-4 py-3 flex items-center" :class="sidebarMinimized ? 'justify-center' : 'justify-between'">
                <Transition name="slide-fade">
                    <div class="flex w-full space-x-3" v-show="!sidebarMinimized">
                        <img src="@/assets/images/default.png" alt="Profile Photo" class="h-10 rounded-full">
                        <div class="flex flex-col">
                            <span class="text-md font-bold text-neutral-700 dark:text-slate-200">{{ authStore.user.fullname }}</span>
                            <small class="text-xs text-neutral-400 dark:text-slate-400">{{ authStore.user.email }}</small>
                        </div>
                    </div>
                </Transition>
                <div class="relative">
                    <UserSettingsDropdown :sidebar-minimized="sidebarMinimized" />
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
/* Transition Class */
.slide-fade-enter-active, .slide-fade-leave-active{
    @apply transition-all duration-150 ease-out
}

.slide-fade-enter-from, .slide-fade-leave-to{
    @apply -translate-x-4 opacity-0
}
</style>