<script>
import axios from 'axios';
import Pagination from '../../../components/dashboard/Pagination.vue';
import { DateTime } from 'luxon';

export default {
    setup() {
        // 
    },
    data: () => ({
        dt: DateTime,
        transaksi: [],
        totalledValue: null,
        tableConfig: {
            orderBy: "faktur",
            orderDir: "ASC",
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        },
        message: null,
        editingTanggal: null,
        maxTanggal: null,
    }),
    components: {
        Pagination
    },
    methods: {
        setTransaksi(data) {
            this.transaksi = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
            this.totalledValue = data.totalledValue
        },
        async updateTable() {
            await axios.get("lapharian", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search,
                    tanggal: this.editingTanggal
                }
            }).then((response) => this.setTransaksi(response.data)).catch((error) => console.log(error.response))
        },
        orderData(columnName) {
            this.tableConfig.orderBy = columnName
            if (this.tableConfig.orderDir === 'ASC') {
                this.tableConfig.orderDir = 'DESC'
            } else {
                this.tableConfig.orderDir = 'ASC'
            }
            this.updateTable()
        },
        onPageChange(page) {
            this.tableConfig.activePage = page
            this.updateTable()
        },
        setTodayDate() {
            const date = new Date()
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            this.maxTanggal = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            this.editingTanggal = this.maxTanggal
            this.updateTable()
        },
        formatRibuan(angka) {
            return Number(angka).toLocaleString()
        }
    },
    mounted() {
        this.setTodayDate()
        this.updateTable()
    }
}
</script>

<template>
    <div class="space-y-4">
        <!-- Pengaturan Atas -->
        <div class="w-full p-2 bg-neutral-100 dark:bg-slate-700 border rounded-lg dark:border-slate-600 flex justify-between">
            <div class="space-x-2">
                <input type="date" name="tanggal" id="tanggal" class="border p-2 w-48 text-sm rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Masukkan tanggal" v-model="editingTanggal" :max="maxTanggal">
                <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm" @click="updateTable()">Lihat Laporan</button>
                <button type="button" class="bg-white hover:bg-neutral-200 dark:bg-slate-700 dark:hover:bg-slate-800 border rounded-lg dark:border-slate-600 dark:text-white p-2 text-sm" @click="setTodayDate()">Hari Ini</button>
            </div>
            <button type="button" class="bg-green-500 hover:bg-green-400 rounded-lg text-white text-lg px-3 my-0.5 relative group">
                <font-awesome-icon icon="fa-solid fa-file-excel" />
                <span class="absolute hidden group-hover:block transition-all dark:bg-slate-500 bg-gray-700 text-white text-sm px-3 py-2 -top-1/2 right-12 translate-y-1/2 w-max rounded-md
                after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:dark:border-l-slate-500 after:border-l-gray-700 after:transition-all">Download Format Excel</span>
            </button>
        </div>
        <h2 class="text-xl font-bold dark:text-slate-200">Laporan Harian {{ dt.fromISO(editingTanggal).toLocaleString(dt.DATE_HUGE) }}</h2>
        <!-- Pengaturan Tabel Atas -->
        <div class="flex items-center justify-between">
            <div class="flex space-x-2 items-center">
                <span class="text-sm text-neutral-700 dark:text-slate-300">Tampilkan</span>
                <select name="entri" id="entri" v-model="tableConfig.limit" @change="updateTable()"
                    class="text-sm border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <span class="text-sm text-neutral-700 dark:text-slate-300">entri</span>
            </div>
            <div class="flex items-center">
                <div
                    class="px-2 py-1 bg-neutral-100 dark:bg-slate-700 rounded-l-lg text-lg text-neutral-600 dark:text-slate-200 border border-r-0 dark:border-slate-600">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" /></div>
                <input type="text" v-model="tableConfig.search" @input="updateTable()"
                    class="border p-2 text-sm rounded-r-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                    placeholder="Cari">
            </div>
        </div>
        <!-- Tabel -->
        <div class="overflow-auto rounded-lg shadow">
            <table class="table-auto w-full relative">
                <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                    <tr>
                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Faktur</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nama Pelanggan</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Modal</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Jual</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Diskon</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Total</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Profit</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Kasir</th>
                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                    <tr v-if="transaksi.length != 0" v-for="(item, index) in transaksi">
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.faktur }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.customer != null ? item.customer.nama : '-' }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.modal) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.jual) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.diskonRp) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.total) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.total - item.modal) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.user.fullname }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 space-x-1">
                            <button class="rounded bg-cyan-500 hover:bg-cyan-400 px-2 py-1 group relative">
                                <font-awesome-icon icon="fa-solid fa-eye" class="text-white" />
                                <span class="absolute hidden group-hover:block transition-all bg-gray-700 text-white text-sm px-3 py-2 -top-1 right-10 w-max rounded-md
                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:border-l-gray-700 after:transition-all">Lihat Detail</span>
                            </button>
                            <button class="rounded bg-green-500 hover:bg-green-400 px-2 py-1 group relative">
                                <font-awesome-icon icon="fa-solid fa-print" class="text-white" />
                                <span class="absolute hidden group-hover:block transition-all bg-gray-700 text-white text-sm px-3 py-2 -top-1 right-10 w-max rounded-md
                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:border-l-gray-700 after:transition-all">Cetak Nota</span>
                            </button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="10" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Belum ada data transaksi untuk hari ini.</td>
                    </tr>
                </tbody>
                <tfoot class="border-t-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                    <tr v-if="transaksi.length != 0">
                        <td colspan="2" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Jumlah</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 font-semibold">{{ formatRibuan(tableConfig.totalRows) }} faktur</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Rp. {{ formatRibuan(totalledValue.modal) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Rp. {{ formatRibuan(totalledValue.jual) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Rp. {{ formatRibuan(totalledValue.diskonRp) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Rp. {{ formatRibuan(totalledValue.total) }}</td>
                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold">Rp. {{ formatRibuan(totalledValue.total - totalledValue.modal) }}</td>
                        <td colspan="2" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right font-semibold"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)"
            :current-page="tableConfig.activePage" :total-items="tableConfig.totalRows"
            @pagechanged="onPageChange" />
    </div>
</template>