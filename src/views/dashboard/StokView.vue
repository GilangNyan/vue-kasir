<script>
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import Modal from '../../components/dashboard/Modal.vue';
import BigModal from '../../components/dashboard/BigModal.vue';
import { useAuthStore } from '../../stores/auth';

export default {
    setup() {
        const authStore = useAuthStore()

        return {authStore}
    },
    data: () => ({
        sidebarMinimized: false,
        stok: [],
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
        editingId: null,
        editingNama: null,
        message: null,
        modalActive: false,
        modalSuccessActive: false,
        bigModalActive: false,
        editingTipe: 'in',
        editingSupplier: 0,
        produkBarcode: null,
        produkNama: null,
        produkSatuan: null,
        produkStok: null,
        editingDetail: null,
        editingQty: null,
        supplier: [],
        selectedSupplier: 0,
        selectedSatuan: null
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal, BigModal
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setStok(data) {
            this.stok = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        setProduk(data){
            this.produk = data.result
            this.produkTableConfig.totalRows = data.totalRows
            this.produkTableConfig.totalPages = data.totalPage
        },
        setSupplier(data){
            this.supplier = data
        },
        async updateTable(){
            axios.get("stok", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    associatedTable: this.tableConfig.associatedTable,
                    search: this.tableConfig.search
                }
            }).then((response) => this.setStok(response.data)).catch((error) => console.log(error.response))
        },
        async updateProdukTable() {
            axios.get("produk", {
                params: {
                    page: this.produkTableConfig.activePage,
                    perPage: this.produkTableConfig.limit,
                    orderBy: this.produkTableConfig.orderBy,
                    orderDir: this.produkTableConfig.orderDir,
                    associatedTable: this.produkTableConfig.associatedTable,
                    search: this.produkBarcode != null ? this.produkBarcode : this.produkTableConfig.search
                }
            }).then((response) => {
                this.setProduk(response.data)
                this.produkBarcode = null
                if(this.bigModalActive == false) this.bigModalActive = true
            }).catch((error) => console.log(error.response))
        },
        orderData(columnName, associatedTable = null) {
            this.tableConfig.orderBy = columnName
            this.tableConfig.associatedTable = associatedTable
            if(this.tableConfig.orderDir === 'ASC') {
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
        onProdukPageChange(page) {
            this.produkTableConfig.activePage = page
            this.updateProdukTable()
        },
        async getEditData(id) {
            this.editingId = id
            document.getElementById('nama').focus()
            await axios.get(`stok/${id}`).then((response) => {
                this.editingNama = response.data.nama
            }).catch((error) => console.log(error.response))
        },
        reset() {
            this.editingId = null
            this.editingNama = null
            this.produkBarcode = null
            this.produkNama = null
            this.produkSatuan = null
            this.produkStok = null
            this.editingDetail = null
            this.editingQty = null
            this.selectedSupplier = 0
            this.selectedSatuan = null
        },
        async tambah() {
            try {
                const response = await axios.post('stok', {
                    barcode: this.produkBarcode,
                    tipe: this.editingTipe,
                    detail: this.editingDetail,
                    supplier: this.selectedSupplier == 0 ? null : this.selectedSupplier,
                    satuan: this.selectedSatuan,
                    qty: this.editingQty,
                    user: this.authStore.user.id
                })
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.reset()
                this.updateTable()
            } catch (error) {
                console.log(error)
                this.message = error.response.data.msg
            }
        },
        async hapus() {
            try {
                const response = await axios.delete(`stok/${this.editingId}`)
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.modalActive = false
                this.reset()
                this.updateTable()
            } catch (error) {
                this.message = error.response.data.msg
            }
        },
        triggerModalHapus(id) {
            this.getEditData(id)
            this.modalActive = true
        },
        batal() {
            this.modalActive = false
            this.reset()
        },
        async pilihProduk(barcode) {
            await axios.get(`produk/${barcode}`).then((response) => {
                this.produkBarcode = response.data.barcode
                this.produkNama = response.data.nama
                this.produkSatuan = response.data.satuans
                this.selectedSatuan = response.data.satuans[0].produk_satuan.satuanId
                this.produkStok = response.data.satuans[0].produk_satuan.stok
                this.bigModalActive = false
            }).catch((error) => console.log(error.response))
        },
        async updateSupplier(){
            await axios.get("supplierall").then((response) => this.setSupplier(response.data)).catch((error) => console.log(error))
        }
    },
    mounted() {
        this.updateTable()
        this.updateSupplier()
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Kelola Stok Produk</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-2/3 space-y-4">
                    <div class="shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                        <div class="flex items-center justify-between">
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
                            <div class="flex items-center">
                                <div class="px-2 py-1 bg-neutral-100 dark:bg-slate-700 rounded-l-lg text-lg text-neutral-600 dark:text-slate-200 border border-r-0 dark:border-slate-600"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></div>
                                <input type="text" v-model="tableConfig.search" @input="updateTable()" class="border p-2 text-sm rounded-r-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500" placeholder="Cari">
                            </div>
                        </div>
                        <div class="overflow-auto rounded-lg shadow">
                            <table class="table-auto w-full">
                                <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                    <tr>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Tanggal
                                            <button type="button" @click="orderData('tanggal')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'tanggal'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'tanggal' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'tanggal' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Barcode
                                            <button type="button" @click="orderData('produkBarcode')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'produkBarcode'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'produkBarcode' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'produkBarcode' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Nama Produk
                                            <button type="button" @click="orderData('nama', 'produk')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'nama' || (tableConfig.orderBy == 'nama' && tableConfig.associatedTable != 'produk')"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'DESC' && tableConfig.associatedTable == 'produk'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'ASC' && tableConfig.associatedTable == 'produk'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Satuan
                                            <button type="button" @click="orderData('nama', 'satuan')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'nama' || (tableConfig.orderBy == 'nama' && tableConfig.associatedTable != 'satuan')"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'DESC' && tableConfig.associatedTable == 'satuan'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'ASC' && tableConfig.associatedTable == 'satuan'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Qty
                                            <button type="button" @click="orderData('qty')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'qty'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'qty' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'qty' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Tipe
                                            <button type="button" @click="orderData('tipe')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'tipe'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide"
                                                    v-if="tableConfig.orderBy == 'tipe' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide"
                                                    v-if="tableConfig.orderBy == 'tipe' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                    <tr v-if="stok.length != 0" v-for="(item, index) in stok" :key="item.id">
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.tanggal }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.produkBarcode }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.produk.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuan.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.qty }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.tipe }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 space-x-1">
                                            <button class="rounded bg-red-500 hover:bg-red-400 px-2 py-1 group relative" @click="triggerModalHapus(item.id)">
                                                <font-awesome-icon icon="fa-solid fa-trash-alt" class="text-white" />
                                                <span class="absolute hidden group-hover:block transition-all bg-gray-700 text-white text-sm px-3 py-2 -top-1 right-10 w-max rounded-md
                                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:border-l-gray-700 after:transition-all">Hapus</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="7" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)" :current-page="tableConfig.activePage"
                            :total-items="tableConfig.totalRows" @pagechanged="onPageChange" />
                    </div>
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-1/3 space-y-4">
                    <div class="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
                        <div class="p-4 border-b dark:border-slate-600 flex items-center">
                            <h2 class="text-lg font-bold text-neutral-700 dark:text-slate-200">Catat In/Out Produk
                            </h2>
                        </div>
                        <div class="p-4 space-y-2">
                            <div class="space-y-2">
                                <label for="inout" class="text-neutral-600 dark:text-slate-400">Stok In/Out</label>
                                <select name="inout" id="inout" v-model="editingTipe"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                    <option value="in">In</option>
                                    <option value="out">Out</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label for="barcode" class="text-neutral-600 dark:text-slate-400">Barcode</label>
                                <div class="w-full flex items-center">
                                    <input type="text" id="barcode" name="barcode" required
                                        class="w-full border px-3 py-2 rounded-l-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                        placeholder="Ketikkan barcode atau nama produk" v-model="produkBarcode">
                                    <button type="button" class="border bg-blue-500 border-blue-500 px-3 py-2 rounded-r-lg text-white hover:bg-blue-600 hover:border-blue-600" @click="updateProdukTable()">
                                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                                    </button>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label for="nama" class="text-neutral-600 dark:text-slate-400">Nama Produk</label>
                                <input type="text" id="nama" name="nama" disabled v-model="produkNama"
                                    class="w-full border px-3 py-2 rounded-lg shadow-sm bg-neutral-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                            </div>
                            <div class="space-y-2">
                                <label for="satuan" class="text-neutral-600 dark:text-slate-400">Satuan</label>
                                <select name="satuan" id="satuan" v-model="selectedSatuan"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                    <option :value="item.id" v-for="(item, index) in produkSatuan" :key="item.id">{{ item.nama }}</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label for="stok" class="text-neutral-600 dark:text-slate-400">Jumlah Awal</label>
                                <input type="number" id="stok" name="stok" disabled v-model="produkStok"
                                    class="w-full border px-3 py-2 rounded-lg shadow-sm bg-neutral-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                            </div>
                            <div class="space-y-2">
                                <label for="supplier" class="text-neutral-600 dark:text-slate-400">Supplier <small>(Opsional)</small></label>
                                <select name="supplier" id="supplier" v-model="selectedSupplier"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                    <option value="0">- Pilih Supplier -</option>
                                    <option :value="item.id" v-for="(item, index) in supplier" :key="item.id">{{ item.nama }}</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label for="detail" class="text-neutral-600 dark:text-slate-400">Detail <small>(Opsional)</small></label>
                                <textarea name="detail" id="detail" rows="2" v-model="editingDetail"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"></textarea>
                            </div>
                            <div class="space-y-2">
                                <label for="qty" class="text-neutral-600 dark:text-slate-400">Banyaknya</label>
                                <input type="number" id="qty" name="qty" required v-model="editingQty"
                                    class="w-full border px-3 py-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                            </div>
                        </div>
                        <div class="flex px-4 py-2 space-x-1 bg-neutral-100 dark:bg-slate-700">
                            <button type="button" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" @click="tambah()">
                                Tambah Stok
                            </button>
                            <button type="button" class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600" @click="reset()">
                                Reset
                            </button>
                        </div>
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
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">Apakah anda yakin ingin menghapus <b>{{ this.editingNama }}</b> dengan ID <b>{{ this.editingId }}</b>?</span>
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