<script>
import Sidebar from '../../components/dashboard/Sidebar.vue';
import Insight from '../../components/dashboard/Insight.vue';
import InsightLoading from '../../components/dashboard/InsightLoading.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import RecentActivity from '../../components/dashboard/RecentActivity.vue';
import { DateTime } from 'luxon';

export default {
    setup() {
        // 
    },
    data: () => ({
        dt: DateTime,
        sidebarMinimized: false,
        rentang: 'thismonth',
        awalTanggal: new Date(),
        akhirTanggal: new Date()
    }),
    components: {
        Sidebar, Insight, InsightLoading, TopBar, RecentActivity
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        gantiRentangTanggal() {
            const hariIni = new Date()
            switch (this.rentang) {
                case 'today':
                    this.awalTanggal = hariIni,
                    this.akhirTanggal = hariIni
                    break
                case 'yesterday':
                    const kemarin = new Date(hariIni)
                    kemarin.setDate(hariIni.getDate() - 1)
                    this.awalTanggal = kemarin
                    this.akhirTanggal = kemarin
                    break
                case 'thisweek':
                    const awalMingguIni = new Date()
                    awalMingguIni.setDate(hariIni.getDate() - 6)
                    this.awalTanggal = awalMingguIni
                    this.akhirTanggal = hariIni
                    break
                case 'lastweek':
                    const awalMingguLalu = new Date()
                    awalMingguLalu.setDate(hariIni.getDate() - 7 - 6)
                    const akhirMingguLalu = new Date()
                    akhirMingguLalu.setDate(hariIni.getDate() - 7)
                    this.awalTanggal = awalMingguLalu
                    this.akhirTanggal = akhirMingguLalu
                    break
                case 'thismonth':
                    const awalBulanIni = new Date(hariIni.getFullYear(), hariIni.getMonth(), 1)
                    this.awalTanggal = awalBulanIni
                    this.akhirTanggal = hariIni
                    break
                case 'lastmonth':
                    const awalBulanLalu = new Date(hariIni.getFullYear(), hariIni.getMonth() - 1, 1)
                    const akhirBulanLalu = new Date(hariIni.getFullYear(), hariIni.getMonth(), 0)
                    this.awalTanggal = awalBulanLalu
                    this.akhirTanggal = akhirBulanLalu
                    break
                case 'thisyear':
                    const awalTahunIni = new Date(hariIni.getFullYear(), 0, 1)
                    this.awalTanggal = awalTahunIni
                    this.akhirTanggal = hariIni
                    break
                case 'lastyear':
                    const awalTahunLalu = new Date(hariIni.getFullYear() - 1, 0, 1)
                    const akhirTahunLalu = new Date(hariIni.getFullYear() - 1, 11, 31)
                    this.awalTanggal = awalTahunLalu
                    this.akhirTanggal = akhirTahunLalu
                    break
            }
        }
    },
    mounted() {
        this.gantiRentangTanggal()
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
                <div class="w-full mt-8 space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold dark:text-slate-200">Ringkasan Penjualan</h2>
                        <div class="space-x-2">
                            <small class="text-xs text-neutral-600 dark:text-slate-400">{{ dt.fromJSDate(awalTanggal).toLocaleString(dt.DATE_FULL) }} s.d. {{ dt.fromJSDate(akhirTanggal).toLocaleString(dt.DATE_FULL) }}</small>
                            <select name="rentang" id="rentang" class="border p-2 w-48 text-sm rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" v-model="rentang" @change="gantiRentangTanggal()">
                                <option value="today">Hari Ini</option>
                                <option value="yesterday">Kemarin</option>
                                <option value="thisweek">Minggu Ini</option>
                                <option value="lastweek">Minggu Lalu</option>
                                <option value="thismonth">Bulan Ini</option>
                                <option value="lastmonth">Bulan Lalu</option>
                                <option value="thisyear">Tahun Ini</option>
                                <option value="lastyear">Tahun Lalu</option>
                            </select>
                        </div>
                    </div>
                    <!-- Insight Card -->
                    <Suspense>
                        <template #default>
                            <Insight :tanggal-awal="awalTanggal" :tanggal-akhir="akhirTanggal" :rentang="rentang" />
                        </template>
                        <template #fallback>
                            <InsightLoading />
                        </template>
                    </Suspense>
                </div>
                <!-- Right Content -->
                <!-- <div class="w-full lg:w-1/4 pt-8">
                    <RecentActivity />
                </div> -->
            </div>
        </main>
    </div>
</template>