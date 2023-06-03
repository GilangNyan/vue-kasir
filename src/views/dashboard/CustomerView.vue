<script>
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';
import Modal from '../../components/dashboard/Modal.vue';

export default {
    setup() {
        // 
    },
    data: () => ({
        sidebarMinimized: false,
        customer: [],
        tableConfig: {
            orderBy: "id",
            orderDir: "ASC",
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        },
        editingId: null,
        editingNama: null,
        editingEmail: null,
        editingTelepon: null,
        editingAlamat: null,
        message: null,
        modalActive: false,
        modalSuccessActive: false
    }),
    components: {
        Sidebar, TopBar, Pagination, Modal
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setCustomer(data) {
            this.customer = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        async updateTable() {
            axios.get("customer", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search
                }
            }).then((response) => this.setCustomer(response.data)).catch((error) => console.log(error.response))
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
        async getEditData(id) {
            this.editingId = id
            document.getElementById('nama').focus()
            await axios.get(`customer/${id}`).then((response) => {
                this.editingNama = response.data.nama
                this.editingEmail = response.data.email
                this.editingTelepon = response.data.telepon
                this.editingAlamat = response.data.alamat
            }).catch((error) => console.log(error.response))
        },
        reset() {
            this.editingId = null
            this.editingNama = null
            this.editingEmail = null
            this.editingTelepon = null
            this.editingAlamat = null
        },
        async tambah() {
            try {
                const response = await axios.post('customer', {
                    nama: this.editingNama,
                    email: this.editingEmail,
                    telepon: this.editingTelepon,
                    alamat: this.editingAlamat
                })
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.reset()
                this.updateTable()
            } catch (error) {
                this.message = error.response.data.msg
            }
        },
        async ubah() {
            try {
                const response = await axios.patch(`customer/${this.editingId}`, {
                    nama: this.editingNama,
                    email: this.editingEmail,
                    telepon: this.editingTelepon,
                    alamat: this.editingAlamat
                })
                this.message = response.data.msg
                this.modalSuccessActive = true
                this.reset()
                this.updateTable()
            } catch (error) {
                this.message = error.response.data.msg
            }
        },
        async hapus() {
            try {
                const response = await axios.delete(`customer/${this.editingId}`)
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
        }
    },
    mounted() {
        this.updateTable()
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
                <h1 class="text-2xl font-bold dark:text-slate-200">Data Customer</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-2/3">
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
                                            Nama Customer
                                            <button type="button" @click="orderData('nama')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'nama'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" v-if="tableConfig.orderBy == 'nama' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Email
                                            <button type="button" @click="orderData('email')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'email'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy == 'email' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" v-if="tableConfig.orderBy == 'email' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Telepon
                                            <button type="button" @click="orderData('telepon')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'telepon'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy == 'telepon' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" v-if="tableConfig.orderBy == 'telepon' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                            Alamat
                                            <button type="button" @click="orderData('alamat')">
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy != 'alamat'"
                                                    class="text-neutral-400 dark:text-slate-400 hover:text-neutral-500 dark:hover:text-slate-300" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-up-short-wide" v-if="tableConfig.orderBy == 'alamat' && tableConfig.orderDir == 'DESC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                                <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" v-if="tableConfig.orderBy == 'alamat' && tableConfig.orderDir == 'ASC'"
                                                    class="dark:text-slate-200 hover:text-neutral-700 dark:hover:text-slate-100" />
                                            </button>
                                        </th>
                                        <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                    <tr v-if="customer.length != 0" v-for="(item, index) in customer" :key="item.id">
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.nama }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.email }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.telepon }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.alamat }}</td>
                                        <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 space-x-1">
                                            <button class="rounded bg-blue-500 hover:bg-blue-400 px-2 py-1 group relative" @click="getEditData(item.id)">
                                                <font-awesome-icon icon="fa-solid fa-pen" class="text-white" />
                                                <span class="absolute hidden group-hover:block transition-all bg-gray-700 text-white text-sm px-3 py-2 -top-1 right-10 w-max rounded-md
                                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:border-l-gray-700 after:transition-all">Ubah</span>
                                            </button>
                                            <button class="rounded bg-red-500 hover:bg-red-400 px-2 py-1 group relative" @click="triggerModalHapus(item.id)">
                                                <font-awesome-icon icon="fa-solid fa-trash-alt" class="text-white" />
                                                <span class="absolute hidden group-hover:block transition-all bg-gray-700 text-white text-sm px-3 py-2 -top-1 right-10 w-max rounded-md
                                            after:content-[''] after:absolute after:top-1/2 after:left-[100%] after:-translate-y-1/2 after:border-8 after:border-y-transparent after:border-r-transparent after:border-l-gray-700 after:transition-all">Hapus</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-else>
                                        <td colspan="6" class="p-3 text-sm text-neutral-700 dark:text-slate-300 text-center">Tidak ada data dalam tabel ini.</td>
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
                        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
                            <div class="p-4 border-b dark:border-slate-600 flex items-center">
                                <h2 class="text-lg font-bold text-neutral-700 dark:text-slate-200">{{ editingId != null ? 'Ubah' : 'Tambah' }} Data Customer
                                </h2>
                            </div>
                            <div class="p-4 space-y-2">
                                <div class="space-y-2">
                                    <label for="nama" class="text-neutral-600 dark:text-slate-400">Nama Customer</label>
                                    <input type="text" id="nama" required
                                        class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                        placeholder="cth: John Doe" v-model="editingNama">
                                </div>
                                <div class="space-y-2">
                                    <label for="email" class="text-neutral-600 dark:text-slate-400">Email <small>(Opsional)</small></label>
                                    <input type="email" id="email"
                                        class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                        placeholder="cth: pengguna@contoh.com" v-model="editingEmail">
                                </div>
                                <div class="space-y-2">
                                    <label for="telepon" class="text-neutral-600 dark:text-slate-400">Nomor Telepon</label>
                                    <input type="text" id="telepon" required
                                        class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                        placeholder="cth: 085123456789" v-model="editingTelepon">
                                </div>
                                <div class="space-y-2">
                                    <label for="alamat" class="text-neutral-600 dark:text-slate-400">Alamat</label>
                                    <textarea name="alamat" id="alamat" rows="4" v-model="editingAlamat" required
                                        class="w-full border p-2 rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"></textarea>
                                </div>
                                {{ message }}
                            </div>
                            <div class="flex px-4 py-2 space-x-1 bg-neutral-100 dark:bg-slate-700">
                                <button type="button" v-if="editingId != null" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" @click="ubah()">
                                    Ubah Customer
                                </button>
                                <button type="button" v-else class="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600" @click="tambah()">
                                    Tambah Customer
                                </button>
                                <button type="button" class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600" @click="reset()">
                                    Reset
                                </button>
                            </div>
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
            </Teleport>
        </div>
    </div>
</template>