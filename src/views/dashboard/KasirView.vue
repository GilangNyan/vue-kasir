<script>
import axios from "axios";
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import { useAuthStore } from "../../stores/auth";
import Modal from '../../components/dashboard/Modal.vue';

export default {
    setup() {
        const authStore = useAuthStore()

        return {authStore}
    },
    data: () => ({
        sidebarMinimized: false,
        produk: [],
        tableConfig: {
            orderBy: "barcode",
            orderDir: "ASC",
            totalRows: 0,
            totalPages: 1,
            limit: 5,
            activePage: 1,
            search: ''
        },
        cart: [],
        customer: [],
        selectedCustomer: 0,
        qty: 1,
        cartQty: 0,
        cartDiskon: 0,
        totalDiskon: 0,
        editTotalDiskon: false,
        editingId: null,
        editingNama: null,
        jmlbayar: 0,
        catatan: '',
        message: null,
        modalActive: false,
        modalSuccessActive: false,
        modalConfirmActive: false,
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setProduk(data) {
            this.produk = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        setCart(data){
            this.cart = data
        },
        setCustomer(data){
            this.customer = data
        },
        async updateTable() {
            axios.get("produk", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search
                }
            }).then((response) => this.setProduk(response.data)).catch((error) => console.log(error.response))
        },
        onPageChange(page) {
            this.tableConfig.activePage = page
            this.updateTable()
        },
        addToCart(barcode) {
            // let cekCart = this.cart.find((produk) => produk.produkBarcode == barcode)
            axios.get(`cartbarcode/${barcode}`, {
                params: {
                    userId: this.authStore.user.id
                }
            }).then((response) => {
                if (response.data != null) {
                    axios.patch(`cartqtydir/${response.data.id}`, {
                        qty: this.qty,
                        dir: "plus"
                    }).then((response) => {
                        this.qty = 1
                        this.updateCart()
                    }).catch((error) => console.log(error.response))
                } else {
                    axios.get(`produk/${barcode}`).then((response) => {
                        axios.post("cart", {
                            barcode: barcode,
                            hargaBeli: response.data.satuans[0].produk_satuan.hargaBeli,
                            hargaJual: response.data.satuans[0].produk_satuan.hargaJual,
                            qty: this.qty,
                            diskonRp: 0,
                            diskonPersen: 0,
                            userId: this.authStore.user.id
                        }).then((response) => {
                            this.qty = 1
                            this.updateCart()
                        }).catch((error) => console.log(error.response))
                    }).catch((error) => console.log(error.response))
                }
            })
            this.tableConfig.search = ''
            this.produk = []
        },
        removeCart() {
            axios.delete(`cart/${this.editingId}`).then((response) => {
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.modalActive = false
                this.reset()
                this.updateCart()
            }).catch((error) => this.message = error.response.data.msg)
        },
        async updateCart() {
            axios.get("cart", {
                params: {
                    userId: this.authStore.user.id
                }
            }).then((response) => this.setCart(response.data)).catch((error) => console.log(error.response))
        },
        async updateCustomer() {
            axios.get("customerall").then((response) => this.setCustomer(response.data)).catch((error) => console.log(error.response))
        },
        updateQtyButton(id, dir) {
            axios.patch(`cartqtydir/${id}`, {
                qty: 1,
                dir: dir
            }).then((response) => {
                this.updateCart()
            }).catch((error) => console.log(error.response))
        },
        updateQtyInput(id) {
            // console.log(`ID: ${id} Qty: ${this.cartQty}`)
            axios.patch(`cartqty/${id}`, {
                qty: this.cartQty
            }).then((response) => {
                this.updateCart()
                this.cartQty = 0
            }).catch((error) => console.log(error.response))
        },
        handleUpdateQtyInput(event) {
            this.cartQty = event.target.value
        },
        updateDiskonInput(id) {
            axios.patch(`cartdiskon/${id}`, {
                diskonRp: this.cartDiskon,
                diskonPersen: 0
            }).then((response) => {
                this.updateCart()
                this.cartDiskon = 0
            }).catch((error) => console.log(error.response))
        },
        handleUpdateDiskonInput(event) {
            this.cartDiskon = event.target.value
        },
        total() {
            return this.cart.reduce((a, b) => a + b.subtotal, 0)
        },
        formTotalDiskon() {
            this.editTotalDiskon = true
            
            setTimeout(() => {
                this.$refs.totaldiskon.focus()
            }, 1)
        },
        async triggerModalHapus(id) {
            await axios.get(`cart/${id}`).then((response) => {
                this.editingId = id
                this.editingNama = response.data.produk.nama
            }).catch((error) => console.log(error.response))
            this.modalActive = true
        },
        batal() {
            this.modalActive = false
            this.reset()
        },
        reset() {
            this.editingId = null
            this.editingNama = null
        },
        async transaksi() {
            await axios.post("transaksi", {
                user: this.authStore.user.id,
                customer: this.selectedCustomer == 0 ? null : this.selectedCustomer,
                diskonRp: this.totalDiskon,
                diskonPersen: 0,
                totalBruto: this.total(),
                bayar: this.jmlbayar,
                catatan: this.catatan
            }).then((response) => {
                this.modalConfirmActive = false
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.updateCart()
                this.selectedCustomer = 0
                this.jmlbayar = 0
            }).catch((error) => console.log(error.response))
        }
    },
    mounted() {
        this.updateCart()
        this.updateCustomer()
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Kasir</h1>
                <TopBar />
            </div>
            <!-- Full Length Content -->
            <div class="w-full mt-8 shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="cariproduk" class="text-neutral-600 dark:text-slate-400 mb-2">Cari Produk</label>
                        <input type="text" name="cariproduk" v-model="tableConfig.search" @input="updateTable()"
                            class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                            placeholder="Scan barcode/cari produk">
                    </div>
                    <div>
                        <label for="qty" class="text-neutral-600 dark:text-slate-400 mb-2">Qty</label>
                        <input type="number" name="qty"
                            class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                            placeholder="Qty" v-model="qty">
                    </div>
                </div>
                <div class="overflow-auto rounded-lg shadow">
                    <table class="table-auto w-full">
                        <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                            <tr>
                                <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Barcode</th>
                                <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Nama Produk</th>
                                <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Stok</th>
                                <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-32">Harga</th>
                                <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">
                                    <font-awesome-icon icon="fas fa-cash-register" />
                                </th>
                            </tr>
                        </thead>
                        <tbody class="overflow-y-auto divide-y divide-neutral-100 dark:divide-slate-600">
                            <tr v-if="produk.length != 0" v-for="(item, index) in produk" :key="item.barcode">
                                <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.barcode }}</td>
                                <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.nama }}</td>
                                <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.satuans[0].produk_satuan.stok
                                    }}
                                </td>
                                <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{
                                    item.satuans[0].produk_satuan.hargaJual
                                    }}</td>
                                <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">
                                    <button class="rounded bg-green-500 hover:bg-green-400 px-1" @click="addToCart(item.barcode)">
                                        <font-awesome-icon icon="fa-solid fa-check" class="text-white" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="5" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Cari produk di kolom pencarian.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)"
                    :current-page="tableConfig.activePage" :total-items="tableConfig.totalRows" @pagechanged="onPageChange" />
            </div>
            <!-- Left/Right -->
            <div class="flex flex-col mt-4 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-2/3">
                    <div class="shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="tanggal" class="text-neutral-600 dark:text-slate-400 mb-2">Tanggal</label>
                                <input type="text" name="tanggal"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                    placeholder="Tanggal">
                            </div>
                            <div>
                                <label for="customer" class="text-neutral-600 dark:text-slate-400 mb-2">Customer</label>
                                <select name="customer" v-model="selectedCustomer"
                                    class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                    <option value="0">Pelanggan walk-in</option>
                                    <option :value="item.id" v-for="(item, index) in customer" :key="item.id">{{ item.nama }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="overflow-auto rounded-lg shadow">
                            <table class="table-auto w-full">
                                <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                    <tr>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">Produk</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Harga</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-32">Qty</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Disc. Item</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-32">Subtotal</th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">
                                            <font-awesome-icon icon="fa-solid fa-trash-alt" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600 border-b-2 dark:border-slate-600">
                                    <tr v-if="cart.length != 0" v-for="(item, index) in cart" :key="item.id">
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">{{ index + 1 }}</td>
                                        <td class="p-3">
                                            <div class="text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">{{ item.produk.nama }}</div>
                                            <div class="text-xs text-neutral-400 dark:text-slate-400">Stok: {{ item.produk.satuans[0].produk_satuan.stok }}</div>
                                        </td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">{{ item.hargaJual }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">
                                            <button type="button" @click="updateQtyButton(item.id, 'minus')" :disabled="item.qty == 1"
                                                :class="{ 'cursor-not-allowed bg-neutral-200 dark:bg-slate-600': item.qty == 1 }"
                                                class="w-1/4 rounded-l-lg border border-r-0 py-2 shadow-sm hover:bg-neutral-100 dark:hover:bg-slate-600 dark:border-slate-600">-</button>
                                            <input type="number" @blur="updateQtyInput(item.id)" @keyup.enter="$event.target.blur()" @input="handleUpdateQtyInput"
                                                class="w-2/4 text-center border p-2 shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                                :value="item.qty" :min="1" :max="item.produk.satuans[0].produk_satuan.stok">
                                            <button type="button" @click="updateQtyButton(item.id, 'plus')" :disabled="item.qty == item.produk.satuans[0].produk_satuan.stok"
                                                :class="{ 'cursor-not-allowed bg-neutral-200 dark:bg-slate-600': item.qty == item.produk.satuans[0].produk_satuan.stok }"
                                                class="w-1/4 rounded-r-lg border border-l-0 py-2 shadow-sm hover:bg-neutral-100 dark:hover:bg-slate-600 dark:border-slate-600">+</button>
                                        </td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">
                                            <input type="number" @blur="updateDiskonInput(item.id)" @keyup.enter="$event.target.blur()" @input="handleUpdateDiskonInput"
                                                class="w-full text-right border p-2 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                                value="0" :min="0" :max="item.hargaJual">
                                        </td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">{{ item.subtotal }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 whitespace-nowrap">
                                            <button class="rounded bg-red-500 hover:bg-red-400 px-1" @click="triggerModalHapus(item.id)">
                                                <font-awesome-icon icon="fa-solid fa-xmark" class="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="7" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Cart kosong.</td>
                                    </tr>
                                </tbody>
                                <tfoot class="divide-y divide-neutral-100 dark:divide-slate-600">
                                    <tr>
                                        <td colspan="5"
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            Total</td>
                                        <td
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            {{ total() }}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="5"
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            Diskon Belanja (Rp.)</td>
                                        <td
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            <input type="number" v-model="totalDiskon" v-if="editTotalDiskon" @blur="editTotalDiskon = false" ref="totaldiskon"
                                            class="w-full text-right border p-2 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500">
                                            <div v-else @click="formTotalDiskon()" class="cursor-pointer">{{ totalDiskon }}</div>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="5"
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            Total yang Harus Dibayar</td>
                                        <td
                                            class="px-3 py-2 text-sm font-bold text-neutral-700 dark:text-slate-300 whitespace-nowrap text-right">
                                            {{ total() - totalDiskon }}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-1/3">
                    <div class="shadow-lg bg-white dark:bg-slate-800 rounded-t-2xl p-4">
                        <div class="mb-4 space-y-2">
                            <span class="text-neutral-600 dark:text-slate-400 mb-2">Total Bayar</span>
                            <h2 class="text-5xl text-right font-medium text-neutral-700 dark:text-slate-300 mb-2">{{ total() - totalDiskon }}</h2>
                        </div>
                        <div class="mb-4 space-y-2">
                            <label for="jmlbayar" class="text-neutral-600 dark:text-slate-400 mb-2">Jumlah Bayar</label>
                            <input type="number" name="jmlbayar" id="jmlbayar"
                                class="w-full border p-2 rounded-lg text-right shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                v-model="jmlbayar">
                        </div>
                        <div class="mb-4 space-y-2">
                            <label for="kembalian" class="text-neutral-600 dark:text-slate-400 mb-2">Kembali</label>
                            <input type="number" name="kembalian" id="kembalian"
                                class="w-full border p-2 rounded-lg text-right shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                :value="(jmlbayar == 0 ? 0 : jmlbayar - (total() - totalDiskon))" disabled>
                        </div>
                        <div class="space-y-2">
                            <label for="catatan" class="text-neutral-600 dark:text-slate-400 mb-2">Catatan</label>
                            <textarea name="catatan" id="catatan" cols="4" v-model="catatan"
                            class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"></textarea>
                        </div>
                    </div>
                    <div class="shadow-lg px-4 py-2 border-t bg-neutral-100 dark:bg-slate-700 dark:border-slate-600 rounded-b-2xl">
                        <button class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                        :class="{ 'cursor-not-allowed bg-blue-200 hover:bg-blue-300' : (jmlbayar < (total() - totalDiskon)) || cart.length == 0 }"
                        :disabled="(jmlbayar < (total() - totalDiskon)) || cart.length == 0" @click="modalConfirmActive = true">
                            Lanjutkan
                        </button>
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
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">Apakah anda yakin ingin menghapus <b>{{ this.editingNama }}</b> dari cart?</span>
                        <div class="flex items-center justify-center space-x-2">
                            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold" @click="removeCart()">Ya, hapus</button>
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
                <Modal :modalActive="modalConfirmActive">
                    <div class="w-20 h-20 z-30 m-4 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-exclamation" class="text-5xl text-yellow-500" />
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <h1 class="text-2xl font-bold dark:text-slate-200 mb-2">Konfirmasi Transaksi</h1>
                        <span class="text-sm text-neutral-600 dark:text-slate-400 text-center mb-4">Apakah anda ingin menyelesaikan transaksi?</span>
                        <div class="flex items-center justify-center space-x-2">
                            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-semibold" @click="transaksi()">Selesaikan Transaksi</button>
                            <button class="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg text-white font-semibold" @click="modalConfirmActive = false">Kembali</button>
                        </div>
                    </div>
                </Modal>
            </Teleport>
        </div>
    </div>
</template>