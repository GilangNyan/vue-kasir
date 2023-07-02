<script>
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import Modal from '../../components/dashboard/Modal.vue';
import BigModal from '../../components/dashboard/BigModal.vue';
import LineChart from '../../components/chart/LineChart.vue'

export default {
    setup() {
        // 
    },
    data: () => ({
        sidebarMinimized: false,
        dataPenjualan: [],
        dataPeramalan: [],
        dataEvaluasi: null,
        produk: [],
        produkTableConfig: {
            orderBy: "barcode",
            orderDir: "ASC",
            associatedTable: null,
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        },
        periode: [],
        selectedPeriode: 3,
        selectedProduk: null,
        produkNama: null,
        message: null,
        modalActive: false,
        modalSuccessActive: false,
        bigModalActive: false,
        chartData: null,
        chartOptions: {
            responsive: true,
            tooltips: {
                mode: 'index'
            }
        }
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal, BigModal, LineChart
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setDataPenjualan(data) {
            this.dataPenjualan = data.result
            this.dataEvaluasi = data.evaluasi
            // Set Data Chart
            const chartLabel = data.result.map(bulan => {
                return `${this.getNamaBulan(bulan.bulan) + ' ' + bulan.tahun}`
            })
            const chartAktual = data.result.map(val => {
                return val.terjual
            })
            const chartForecast = data.result.map(val => {
                return val.forecast
            })
            this.chartData = {
                labels: chartLabel,
                datasets: [
                    {
                        label: 'Aktual',
                        data: chartAktual,
                        borderColor: 'rgba(50, 115, 220, 0.5)',
                        backgroundColor: 'rgba(50, 115, 220, 0.1)'
                    },
                    {
                        label: 'Forecast',
                        data: chartForecast,
                        borderColor: 'rgba(255, 56, 96, 0.5)',
                        backgroundColor: 'rgba(255, 56, 96, 0.1)'
                    }
                ]
            }
        },
        setProduk(data) {
            this.produk = data.result
            this.produkTableConfig.totalRows = data.totalRows
            this.produkTableConfig.totalPages = data.totalPage
        },
        async updateTable() {
            await axios.get("forecast", {
                params: {
                    periode: this.selectedPeriode,
                    produk: this.selectedProduk
                }
            }).then((response) => {
                this.setDataPenjualan(response.data)
            }).catch((error) => console.log(error.response))
        },
        async updateProdukTable() {
            axios.get("produk", {
                params: {
                    page: this.produkTableConfig.activePage,
                    perPage: this.produkTableConfig.limit,
                    orderBy: this.produkTableConfig.orderBy,
                    orderDir: this.produkTableConfig.orderDir,
                    associatedTable: this.produkTableConfig.associatedTable,
                    search: this.selectedProduk != null ? this.selectedProduk : this.produkTableConfig.search
                }
            }).then((response) => {
                this.setProduk(response.data)
                this.selectedProduk = null
                if (this.bigModalActive == false) this.bigModalActive = true
            }).catch((error) => console.log(error.response))
        },
        onPageChange(page) {
            this.tableConfig.activePage = page
            this.updateTable()
        },
        onProdukPageChange(page) {
            this.produkTableConfig.activePage = page
            this.updateProdukTable()
        },
        reset() {
            this.selectedPeriode = null
            this.selectedProduk = null
        },
        async pilihProduk(barcode) {
            await axios.get(`produk/${barcode}`).then((response) => {
                this.selectedProduk = response.data.barcode
                this.produkNama = response.data.nama
                this.bigModalActive = false
            }).catch((error) => console.log(error.response))
        },
        populatePeriode() {
            for (let i = 2; i <= 12; i++) {
                this.periode.push(i)
            }
        },
        getNamaBulan(nomorBulan) {
            const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
            return namaBulan[nomorBulan - 1]
        },
    },
    mounted() {
        this.updateTable()
        this.populatePeriode()
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Forecast</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4">
                <!-- Content -->
                <div class="w-full shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                    <!-- Kontrol Tab -->
                    <div class="space-y-4">
                        <div class="w-full p-2 bg-neutral-100 dark:bg-slate-700 border rounded-lg dark:border-slate-600 flex justify-between">
                            <div class="flex space-x-2">
                                <div>
                                    <label for="periode" class="text-sm text-neutral-700 dark:text-slate-300">Periode</label>
                                    <select name="periode" id="periode" class="border p-2 text-sm rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" v-model="selectedPeriode">
                                        <option v-for="number in periode" :value="number" :key="number">{{ number }}</option>
                                    </select>
                                </div>
                                <div>
                                    <div class="flex items-center">
                                        <input type="text" id="barcode" name="barcode" required
                                            class="border p-2.5 text-sm rounded-l-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                            placeholder="Cari Produk" v-model="selectedProduk">
                                        <button type="button" class="bg-blue-500 p-2 rounded-r-lg text-white hover:bg-blue-600" @click="updateProdukTable()">
                                            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <input type="text" name="nama" id="nama" disabled
                                    class="border p-2.5 text-sm rounded-lg shadow-sm bg-neutral-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                    placeholder="Nama Produk" v-model="produkNama">
                                </div>
                                <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm" @click="updateTable()">Jalankan Forecast</button>
                            </div>
                            <button type="button" class="bg-green-500 hover:bg-green-400 rounded-lg text-white text-lg px-3 my-0.5 relative group">
                                <font-awesome-icon icon="fa-solid fa-file-excel" />
                                <span class="absolute hidden group-hover:block transition-all dark:bg-slate-500 bg-gray-700 text-white text-sm px-3 py-2 -top-1/2 right-12 translate-y-1/2 w-max rounded-md
                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:dark:border-l-slate-500 after:border-l-gray-700 after:transition-all">Download Format Excel</span>
                            </button>
                        </div>
                        <h2 class="text-xl font-bold dark:text-slate-200">Forecast Produk</h2>
                        <LineChart v-if="chartData != null" :chartData="chartData" :options="chartOptions" />
                    </div>
                    <!-- Tabel -->
                    <div class="overflow-auto rounded-lg shadow">
                        <table class="table-auto w-full">
                            <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                <tr>
                                    <th
                                        class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">
                                        #</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Tahun
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Bulan
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Terjual
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Forecast
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Error
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        Error<sup>2</sup>
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        | Y - Y' |
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">
                                        <sup>| Y - Y' |</sup>/<sub>Y</sub> * 100
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100 dark:divide-slate-600 border-b-2 dark:border-slate-600">
                                <tr v-if="dataPenjualan.length != 0" v-for="(item, index) in dataPenjualan" :key="item.id">
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ index + 1 }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">{{ item.tahun }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">{{ getNamaBulan(item.bulan) }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">{{ item.terjual ? item.terjual : '?' }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ item.forecast ? item.forecast : '-' }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ item.error }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ item.error2 }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ item.errorAbs }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ item.errorAbsPersen }}</td>
                                </tr>
                                <tr v-else>
                                    <td colspan="3" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
                                </tr>
                            </tbody>
                            <tfoot class="divide-y divide-neutral-100 dark:divide-slate-600">
                                <tr v-if="dataEvaluasi != null">
                                    <td colspan="6"
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        MSE</td>
                                    <td
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        {{ dataEvaluasi.mse }}
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr v-if="dataEvaluasi != null">
                                    <td colspan="6"
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        RMSE</td>
                                    <td
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        {{ dataEvaluasi.rmse }}
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr v-if="dataEvaluasi != null">
                                    <td colspan="6"
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        MAE</td>
                                    <td></td>
                                    <td class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        {{ dataEvaluasi.mae }}
                                    </td>
                                    <td></td>
                                </tr>
                                <tr v-if="dataEvaluasi != null">
                                    <td colspan="6"
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        MAPE</td>
                                    <td></td>
                                    <td></td>
                                    <td
                                        class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                        {{ dataEvaluasi.mape }}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modal -->
        <div class="relative">
            <Teleport to="body">
                <Modal :modalActive="modalActive">
                    <div class="w-20 h-20 z-30 m-4 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-exclamation" class="text-5xl text-yellow-500" />
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <h1 class="text-2xl font-bold dark:text-slate-200 mb-2">Konfirmasi Penghapusan</h1>
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">Apakah anda yakin ingin menghapus <b>{{ produkNama }}</b> dengan ID <b>{{ selectedProduk }}</b>?</span>
                        <div class="flex items-center justify-center space-x-2">
                            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold" @click="hapus()">Ya, hapus</button>
                            <button class="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg text-white font-semibold" @click="batal()">Batal</button>
                        </div>
                    </div>
                </Modal>
                <Modal :modalActive="modalSuccessActive">
                    <div class="w-20 h-20 z-30 m-4 rounded-full border-4 border-green-500 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-check" class="text-5xl text-green-500" />
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <h1 class="text-2xl font-bold dark:text-slate-200 mb-2">Berhasil</h1>
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">{{ message }}</span>
                        <div class="flex items-center justify-center space-x-2">
                            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold"
                                @click="modalSuccessActive = false">Tutup</button>
                        </div>
                    </div>
                </Modal>
                <BigModal :modalActive="bigModalActive">
                    <div class="w-full space-y-4">
                        <div class="w-full text-2xl font-bold dark:text-slate-200 relative">
                            Data Produk
                            <button type="button" class="absolute text-sm bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-slate-400 text-neutral-400 dark:text-slate-400 hover:text-neutral-600 dark:hover:text-slate-200 hover:bg-red-500 dark:hover:bg-red-500 px-2 py-1 rounded-full bottom-6 -right-6"
                                @click="bigModalActive = false">
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex space-x-2 items-center">
                                <span class="text-sm text-neutral-700 dark:text-slate-300">Tampilkan</span>
                                <select name="entri" id="entri" v-model="produkTableConfig.limit" @change="updateProdukTable()" class="text-sm border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span class="text-sm text-neutral-700 dark:text-slate-300">entri</span>
                            </div>
                            <div class="flex items-center">
                                <div class="px-2 py-1 bg-neutral-100 dark:bg-slate-700 rounded-l-lg text-lg text-neutral-600 dark:text-slate-200 border border-r-0 dark:border-slate-600"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></div>
                                <input type="text" v-model="produkTableConfig.search" @input="updateProdukTable()" class="border p-2 text-sm rounded-r-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Cari">
                            </div>
                        </div>
                        <div class="overflow-auto rounded-lg shadow">
                            <table class="table-auto w-full">
                                <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                    <tr>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Barcode</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nama Produk</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Kategori</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Satuan</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Harga Beli</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Harga Jual</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Stok</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                    <tr v-if="produk.length != 0" v-for="(item, index) in produk" :key="item.id">
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (produkTableConfig.limit * (produkTableConfig.activePage - 1)) + index + 1 }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.barcode }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.kategori.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuans[0].nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuans[0].produk_satuan.hargaBeli }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuans[0].produk_satuan.hargaJual }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuans[0].produk_satuan.stok }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 space-x-1">
                                            <button class="rounded bg-green-500 hover:bg-green-400 px-2 py-1" @click="pilihProduk(item.barcode)">
                                                <font-awesome-icon icon="fa-solid fa-check" class="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="9" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Pagination :total-pages="produkTableConfig.totalPages" :per-page="parseInt(produkTableConfig.limit)" :current-page="produkTableConfig.activePage"
                            :total-items="produkTableConfig.totalRows" @pagechanged="onProdukPageChange" />
                    </div>
                </BigModal>
            </Teleport>
        </div>
    </div>
</template>