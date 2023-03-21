<script>
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';

export default {
    setup() {
        // 
    },
    data: () => ({
        sidebarMinimized: false
    }),
    components: {
        Sidebar, TopBar
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        }
    }
}
</script>

<template>
    <div class="flex bg-slate-100 w-full min-h-screen dark:bg-slate-900 transition-all duration-200 ease-in-out">
        <!-- Sidebar -->
        <Sidebar @sidebar="checkSidebarSize" />
    
        <!-- Main -->
        <main class="w-full mr-4 mb-4 mt-24 md:pl-4 lg:mt-4 transition-width duration-300" :class="sidebarMinimized ? 'ml-16' : 'ml-72'">
            <!-- Top -->
            <div class="flex items-center justify-between pl-8 lg:bg-white lg:dark:bg-slate-800 rounded-xl">
                <h1 class="text-2xl font-bold dark:text-slate-200">Transaksi</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-2/3 shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                    <!--  -->
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-1/3 shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                    <!--  -->
                </div>
            </div>
        </main>
    </div>
</template>