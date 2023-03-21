<script>
import Sidebar from '../../components/dashboard/Sidebar.vue';
import Insight from '../../components/dashboard/Insight.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import RecentActivity from '../../components/dashboard/RecentActivity.vue';

export default {
    setup() {
        // 
    },
    data: () => ({
        sidebarMinimized: false
    }),
    components: {
        Sidebar, Insight, TopBar, RecentActivity
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Dashboard</h1>
                <TopBar />
            </div>
            <div class="flex flex-col lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Center Main -->
                <div class="w-full lg:w-3/4 mt-8">
                    <!-- Insight Card -->
                    <Insight />
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-1/4 pt-8">
                    <!-- Recent Activity -->
                    <RecentActivity />
                </div>
            </div>
        </main>
    </div>
</template>