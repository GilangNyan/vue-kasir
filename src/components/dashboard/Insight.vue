<script>
import axios from 'axios';

export default {
    data: () => ({
        penjualan: null,
        profit: null,
        terjual: null,
        penjualanLalu: null,
        profitLalu: null,
        terjualLalu: null,
        periode: ''
    }),
    props: {
        tanggalAwal: {
            type: Date,
            required: true
        },
        tanggalAkhir: {
            type: Date,
            required: true
        },
        rentang: {
            type: String,
            required: true
        }
    },
    watch: {
        tanggalAwal(newTanggalAwal, oldTanggalAwal) {
            if (newTanggalAwal != oldTanggalAwal) {
                this.updateInsight()
            }
        }
    },
    methods: {
        setInsight(data) {
            this.penjualan = data.totalPenjualan
            this.profit = data.totalProfit
            this.terjual = data.totalTerjual
            this.penjualanLalu = data.totalPenjualanLalu
            this.profitLalu = data.totalProfitLalu
            this.terjualLalu = data.totalTerjualLalu
            this.periode = data.namaPeriode
        },
        async updateInsight() {
            await axios.get("insight", {
                params: {
                    awal: this.tanggalAwal,
                    akhir: this.tanggalAkhir,
                    rentang: this.rentang
                }
            }).then((response) => {
                this.setInsight(response.data)
            }).catch((error) => console.log(error.response))
        },
        formatRibuan(angka) {
            return Number(angka).toLocaleString()
        },
        formatPersentase(awal, akhir) {
            const persen = (akhir / awal) * 100
            const gapPersen = Number(persen - 100).toFixed(2)
            return gapPersen * -1
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 space-x-0 md:grid-cols-3 md:space-x-2">
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-none transition-all duration-200 ease-in dark:bg-slate-800 space-y-2">
            <h3 class="font-semibold text-md dark:text-slate-200">Total Penjualan</h3>
            <div class="flex items-center space-x-4">
                <div class="bg-blue-500 p-4 rounded-2xl text-white text-4xl">
                    <font-awesome-icon icon="fas fa-money-bill-trend-up" />
                </div>
                <div class="flex flex-col space-y-2">
                    <h2 class="text-2xl font-bold dark:text-slate-200">Rp. {{ formatRibuan(penjualan) }}</h2>
                    <small class="text-xs text-green-500 dark:text-green-400" v-if="penjualan > penjualanLalu"><font-awesome-icon icon="fas fa-arrow-trend-up" class="mr-1" />{{ formatPersentase(penjualan, penjualanLalu) }}% dari {{ periode }} sebelumnya</small>
                    <small class="text-xs text-red-500 dark:text-red-400" v-else-if="penjualan < penjualanLalu"><font-awesome-icon icon="fas fa-arrow-trend-down" class="mr-1" />{{ formatPersentase(penjualan, penjualanLalu) }}% dari {{ periode }} sebelumnya</small>
                    <small class="text-xs text-neutral-400 dark:text-slate-400" v-else><font-awesome-icon icon="fas fa-ellipsis" class="mr-1" />{{ formatPersentase(penjualan, penjualanLalu) }}% dari {{ periode }} sebelumnya</small>
                </div>
            </div>
        </div>
        <!-- Card 2 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-none transition-all duration-200 ease-in dark:bg-slate-800 space-y-2">
            <h3 class="font-semibold text-md dark:text-slate-200">Total Profit</h3>
            <div class="flex items-center space-x-4">
                <div class="bg-blue-500 p-4 rounded-2xl text-white text-4xl">
                    <font-awesome-icon icon="fas fa-coins" />
                </div>
                <div class="flex flex-col space-y-2">
                    <h2 class="text-2xl font-bold dark:text-slate-200">Rp. {{ formatRibuan(profit) }}</h2>
                    <small class="text-xs text-green-500 dark:text-green-400" v-if="profit > profitLalu"><font-awesome-icon icon="fas fa-arrow-trend-up" class="mr-1" />{{ formatPersentase(profit, profitLalu) }}% dari {{ periode }} sebelumnya</small>
                        <small class="text-xs text-red-500 dark:text-red-400" v-else-if="profit < profitLalu"><font-awesome-icon icon="fas fa-arrow-trend-down" class="mr-1" />{{ formatPersentase(profit, profitLalu) }}% dari {{ periode }} sebelumnya</small>
                        <small class="text-xs text-neutral-400 dark:text-slate-400" v-else><font-awesome-icon icon="fas fa-ellipsis" class="mr-1" />{{ formatPersentase(profit, profitLalu) }}% dari {{ periode }} sebelumnya</small>
                </div>
            </div>
        </div>
        <!-- Card 3 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-none transition-all duration-200 ease-in dark:bg-slate-800 space-y-2">
            <h3 class="font-semibold text-md dark:text-slate-200">Total Produk Terjual</h3>
            <div class="flex items-center space-x-4">
                <div class="bg-blue-500 p-4 rounded-2xl text-white text-4xl">
                    <font-awesome-icon icon="fas fa-box" />
                </div>
                <div class="flex flex-col space-y-2">
                    <h2 class="text-2xl font-bold dark:text-slate-200">{{ formatRibuan(terjual) }}</h2>
                    <small class="text-xs text-green-500 dark:text-green-400" v-if="terjual > terjualLalu"><font-awesome-icon icon="fas fa-arrow-trend-up" class="mr-1" />{{ formatPersentase(terjual, terjualLalu) }}% dari {{ periode }} sebelumnya</small>
                        <small class="text-xs text-red-500 dark:text-red-400" v-else-if="terjual < terjualLalu"><font-awesome-icon icon="fas fa-arrow-trend-down" class="mr-1" />{{ formatPersentase(terjual, terjualLalu) }}% dari {{ periode }} sebelumnya</small>
                        <small class="text-xs text-neutral-400 dark:text-slate-400" v-else><font-awesome-icon icon="fas fa-ellipsis" class="mr-1" />{{ formatPersentase(terjual, terjualLalu) }}% dari {{ periode }} sebelumnya</small>
                </div>
            </div>
        </div>
    </div>
</template>