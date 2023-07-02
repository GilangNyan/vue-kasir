<script>
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import Modal from '../../components/dashboard/Modal.vue';
import BigModal from '../../components/dashboard/BigModal.vue';
import { DateTime } from 'luxon';

export default {
    setup() {
        // 
    },
    data: () => ({
        dt: DateTime,
        sidebarMinimized: false,
        laporan: [],
        produk: [],
        tableConfig: {
            orderBy: "tanggal",
            orderDir: "DESC",
            associatedTable: null,
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        },
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
        tanggalAwal: null,
        tanggalAkhir: null,
        maxTanggal: null,
        selectedProduk: '',
        message: null,
        modalActive: false,
        modalSuccessActive: false,
        bigModalActive: false
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal, BigModal
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setLaporan(data) {
            this.laporan = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        setProduk(data) {
            this.produk = data.result
            this.produkTableConfig.totalRows = data.totalRows
            this.produkTableConfig.totalPages = data.totalPage
        },
        async updateTable() {
            axios.get("lapproduk", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search,
                    produk: this.selectedProduk,
                    awal: this.tanggalAwal,
                    akhir: this.tanggalAkhir
                }
            }).then((response) => this.setLaporan(response.data)).catch((error) => console.log(error.response))
        },
        async updateProdukTable() {
            axios.get("produk", {
                params: {
                    page: this.produkTableConfig.activePage,
                    perPage: this.produkTableConfig.limit,
                    orderBy: this.produkTableConfig.orderBy,
                    orderDir: this.produkTableConfig.orderDir,
                    associatedTable: this.produkTableConfig.associatedTable,
                    search: this.selectedProduk != '' ? this.selectedProduk : this.produkTableConfig.search
                }
            }).then((response) => {
                this.setProduk(response.data)
                this.selectedProduk = ''
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
        formatRibuan(angka) {
            return Number(angka).toLocaleString()
        },
        async pilihProduk(barcode) {
            await axios.get(`produk/${barcode}`).then((response) => {
                this.selectedProduk = response.data.barcode
                this.bigModalActive = false
            }).catch((error) => console.log(error.response))
        },
        resetFilter() {
            this.tanggalAwal = null
            this.tanggalAkhir = null
            this.selectedProduk = ''
            this.updateTable()
        }
    },
    mounted() {
        this.updateTable()
        const today = new Date().toISOString().split('T')[0]
        this.maxTanggal = today
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Laporan Penjualan Per Produk</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4">
                <!-- Content -->
                <div class="w-full shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                    <!-- Pengaturan Atas -->
                    <div class="w-full p-2 bg-neutral-100 dark:bg-slate-700 border rounded-lg dark:border-slate-600 flex justify-between items-center">
                        <div class="flex space-x-2 items-end">
                            <div class="flex flex-col">
                                <label for="awal" class="text-sm text-neutral-700 dark:text-slate-300">Tanggal Awal</label>
                                <input type="date" name="awal" id="awal" class="border p-2 w-48 text-sm rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Masukkan tanggal awal" :max="tanggalAkhir != null ? tanggalAkhir : maxTanggal" v-model="tanggalAwal">
                            </div>
                            <div class="flex flex-col">
                                <label for="akhir" class="text-sm text-neutral-700 dark:text-slate-300">Tanggal Akhir</label>
                                <input type="date" name="akhir" id="akhir" class="border p-2 w-48 text-sm rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Masukkan tanggal akhir" :min="tanggalAwal != null ? tanggalAwal : '2015-01-01'" :max="maxTanggal" v-model="tanggalAkhir">
                            </div>
                            <div class="flex flex-col">
                                <label for="produk" class="text-sm text-neutral-700 dark:text-slate-300">Produk</label>
                                <div class="flex items-center">
                                    <input type="text" id="barcode" name="barcode"
                                        class="border p-2 text-sm rounded-l-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                        placeholder="Cari Produk" v-model="selectedProduk">
                                    <button type="button" class="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-r-lg text-lg text-white border border-l-0 dark:border-slate-600" @click="updateProdukTable()">
                                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                                    </button>
                                </div>
                            </div>
                            <button type="button" class="bg-blue-500 hover:bg-blue-600 border border-blue-500 hover:border-blue-600 text-white py-2 px-6 rounded-lg text-sm" @click="updateTable()">Filter</button>
                            <button type="button" class="bg-white hover:bg-neutral-200 dark:bg-slate-700 dark:hover:bg-slate-800 border rounded-lg dark:border-slate-600 dark:text-white p-2 text-sm" @click="resetFilter()">Hapus Filter</button>
                        </div>
                        <button type="button" class="bg-green-500 hover:bg-green-400 rounded-lg text-white text-lg py-2 px-3 my-0.5 relative group">
                            <font-awesome-icon icon="fa-solid fa-file-excel" />
                            <span class="absolute hidden group-hover:block transition-all dark:bg-slate-500 bg-gray-700 text-white text-sm px-3 py-2 -top-1/2 right-12 translate-y-1/2 w-max rounded-md
                        after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:dark:border-l-slate-500 after:border-l-gray-700 after:transition-all">Download Format Excel</span>
                        </button>
                    </div>
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
                        <table class="table-auto w-full">
                            <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                <tr>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">Tanggal</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Faktur</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Barcode</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nama Produk</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Qty</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-center dark:text-slate-200">Satuan</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Harga</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-right dark:text-slate-200">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                <tr v-if="laporan.length != 0" v-for="(item, index) in laporan" :key="item.id">
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">{{ dt.fromISO(item.transaksi.tanggal).toLocaleString(dt.DATE_FULL) }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-left">{{ item.transaksiFaktur }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-left">{{ item.produkBarcode }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.produk.nama }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">{{ formatRibuan(item.qty) }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">{{ item.produk.satuans[0].nama }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.hargaJual) }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-right">Rp. {{ formatRibuan(item.subtotal) }}</td>
                                </tr>
                                <tr v-else>
                                    <td colspan="9" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)" :current-page="tableConfig.activePage"
                        :total-items="tableConfig.totalRows" @pagechanged="onPageChange" />
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
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">Apakah anda yakin ingin menghapus <b></b> dengan ID <b></b>?</span>
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