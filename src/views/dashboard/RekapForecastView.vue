<script>
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import Modal from '../../components/dashboard/Modal.vue';
import BigModal from '../../components/dashboard/BigModal.vue';
import BarChart from '../../components/chart/BarChart.vue';

export default {
    setup() {
        // 
    },
    data: () => ({
        sidebarMinimized: false,
        forecast: [],
        forecastTopChart: [],
        tableConfig: {
            orderBy: "nilai",
            orderDir: "DESC",
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        },
        chartData: null,
        chartOptions: {
            responsive: true,
            tooltips: {
                mode: 'index'
            }
        }
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal, BigModal, BarChart
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setDataForecast(data) {
            this.forecast = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        setChartData(data) {
            this.forecastTopChart = data.result
            // Map Nama Produk untuk Label
            const labelChart = this.forecastTopChart.map(index => {
                return index.produk.nama
            })
            // Map Nilai Forecast
            const nilai = this.forecastTopChart.map(index => {
                return index.nilai
            })
            // Update Data Chart
            this.chartData = {
                labels: labelChart,
                datasets: [{
                    label: 'Nilai Forecast',
                    data: nilai,
                    backgroundColor: [
                        '#D98880',
                        '#BB8FCE',
                        '#85C1E9',
                        '#76D7C4',
                        '#F7DC6F',
                        '#F8C471',
                        '#F1948A',
                        '#7DCEA0',
                        '#F8C471',
                        '#85C1E9'
                    ],
                    borderColor: [
                        '#922B21',
                        '#BB8FCE',
                        '#2874A6',
                        '#148F77',
                        '#B7950B',
                        '#B9770E',
                        '#B03A2E',
                        '#1E8449',
                        '#B9770E',
                        '#2874A6'
                    ],
                    borderWidth: 1
                }]
            }
        },
        async updateTable() {
            let tanggal = new Date()
            tanggal.setDate(1)
            tanggal.setMonth(tanggal.getMonth() + 1)
            await axios.get("rekapForecast", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search,
                    periode: tanggal
                }
            }).then((response) => this.setDataForecast(response.data)).catch((error) => console.log(error.response))
        },
        async getTopForecast() {
            let tanggal = new Date()
            tanggal.setDate(1)
            tanggal.setMonth(tanggal.getMonth() + 1)
            await axios.get("topForecast", {
                params: {
                    periode: tanggal
                }
            }).then((response) => this.setChartData(response.data)).catch((error) => console.log(error.response))
        },
        onPageChange(page) {
            this.tableConfig.activePage = page
            this.updateTable()
        },
    },
    mounted() {
        this.updateTable()
        this.getTopForecast()
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Rekap Hasil Forecast</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-3/5 space-y-4">
                    <div class="shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 overflow-hidden">
                        <BarChart v-if="forecastTopChart.length != 0 && chartData != null" :chartData="chartData" :options="chartOptions" />
                    </div>
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-2/5 space-y-4">
                    <div class="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-4 overflow-hidden space-y-4">
                        <div class="flex space-x-2 items-center">
                            <span class="text-sm text-neutral-700 dark:text-slate-300">Tampilkan</span>
                            <select name="entri" id="entri" v-model="tableConfig.limit" @change="updateTable()" class="text-sm border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span class="text-sm text-neutral-700 dark:text-slate-300">entri</span>
                        </div>
                        <div class="overflow-auto rounded-lg shadow">
                            <table class="table-auto w-full">
                                <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                    <tr>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nama Produk</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                    <tr v-if="forecast.length != 0" v-for="(item, index) in forecast" :key="item.id">
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.produk.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.nilai }}</td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="3" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)" :current-page="tableConfig.activePage"
                            :total-items="tableConfig.totalRows" @pagechanged="onPageChange" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>