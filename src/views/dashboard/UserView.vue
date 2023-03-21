<script>
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import Sidebar from '../../components/dashboard/Sidebar.vue';
import TopBar from '../../components/dashboard/Topbar.vue';
import Pagination from '../../components/dashboard/Pagination.vue';

export default {
    setup() {
        const authStore = useAuthStore()

        return {authStore}
    },
    data: () => ({
        sidebarMinimized: false,
        user: [],
        tableConfig: {
            orderBy: "uuid",
            orderDir: "ASC",
            totalRows: 0,
            totalPages: 1,
            limit: 10,
            activePage: 1,
            search: ''
        }
    }),
    components: {
        Sidebar, TopBar, Pagination
    },
    methods: {
        checkSidebarSize(val) {
            this.sidebarMinimized = val
        },
        setUser(data) {
            this.user = data.result
            this.tableConfig.totalRows = data.totalRows
            this.tableConfig.totalPages = data.totalPage
        },
        async updateTable() {
            axios.get("user", {
                params: {
                    page: this.tableConfig.activePage,
                    perPage: this.tableConfig.limit,
                    orderBy: this.tableConfig.orderBy,
                    orderDir: this.tableConfig.orderDir,
                    search: this.tableConfig.search
                }
            }).then((response) => this.setUser(response.data)).catch((error) => console.log(error.response))
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
        <main class="w-full mr-4 mb-4 mt-24 md:pl-4 lg:mt-4 transition-width duration-300"
            :class="sidebarMinimized ? 'ml-16' : 'ml-72'">
            <!-- Top -->
            <div class="flex items-center justify-between pl-8 lg:bg-white lg:dark:bg-slate-800 rounded-xl">
                <h1 class="text-2xl font-bold dark:text-slate-200">Kelola Pengguna</h1>
                <TopBar />
            </div>
            <div class="flex flex-col mt-8 lg:flex-row w-full space-y-4 lg:space-x-4 lg:space-y-0">
                <!-- Left Content -->
                <div class="w-full lg:w-2/3 shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
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
                                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                            </div>
                            <input type="text" v-model="tableConfig.search" @input="updateTable()"
                                class="border p-2 text-sm rounded-r-lg shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:text-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500 placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                                placeholder="Cari">
                        </div>
                    </div>
                    <div class="overflow-auto rounded-lg shadow">
                        <table class="table-auto w-full">
                            <thead class="border-b-2 bg-neutral-100 dark:bg-slate-700 dark:border-slate-600">
                                <tr>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-12">#</th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                        Username
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                        Email
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                        Nama Lengkap
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200">
                                        Role
                                    </th>
                                    <th class="p-3 text-sm font-semibold tracking-wide text-left dark:text-slate-200 w-24">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100 dark:divide-slate-600">
                                <tr v-if="user.length != 0" v-for="(item, index) in user" :key="item.uuid">
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">
                                        {{ (tableConfig.limit * (tableConfig.activePage - 1)) + index + 1 }}
                                    </td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.username }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.email }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">{{ item.fullname }}</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300">Tes</td>
                                    <td class="p-3 text-sm text-neutral-700 dark:text-slate-300 space-x-1">
                                        <button class="rounded bg-blue-500 hover:bg-blue-400 px-2 py-1" @click="getEditData(item.uuid)" v-if="authStore.user.uuid != item.uuid">
                                            <font-awesome-icon icon="fa-solid fa-pen" class="text-white" />
                                        </button>
                                        <button class="rounded bg-red-500 hover:bg-red-400 px-2 py-1" @click="triggerModalHapus(item.uuid)" v-if="authStore.user.uuid != item.uuid">
                                            <font-awesome-icon icon="fa-solid fa-trash-alt" class="text-white" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Pagination :total-pages="tableConfig.totalPages" :per-page="parseInt(tableConfig.limit)" :current-page="tableConfig.activePage"
                        :total-items="tableConfig.totalRows" @pagechanged="onPageChange" />
                </div>
                <!-- Right Content -->
                <div class="w-full lg:w-1/3 shadow-lg bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                    <!--  -->
                </div>
            </div>
        </main>
    </div>
</template>