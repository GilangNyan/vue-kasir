<template>
    <div class="grid grid-cols-1 gap-4 space-x-0 md:grid-cols-3 md:space-x-2">
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-none transition-all duration-200 ease-in dark:bg-slate-800 space-y-2">
            <h3 class="font-semibold text-md dark:text-slate-200">Total Penjualan</h3>
            <div class="flex items-center space-x-4">
                <div class="bg-blue-500 p-4 rounded-2xl text-white text-4xl">
                    <font-awesome-icon icon="fas fa-money-bill-trend-up" />
                </div>
                <div class="flex flex-col space-y-2 animate-pulse">
                    <h2 class="rounded-md h-8 w-40 bg-neutral-200 dark:bg-slate-200"></h2>
                    <small class="rounded-md h-4 w-28 bg-neutral-200 dark:bg-slate-200"></small>
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
                <div class="flex flex-col space-y-2 animate-pulse">
                    <h2 class="rounded-md h-8 w-40 bg-neutral-200 dark:bg-slate-200"></h2>
                    <small class="rounded-md h-4 w-28 bg-neutral-200 dark:bg-slate-200"></small>
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
                <div class="flex flex-col space-y-2 animate-pulse">
                    <h2 class="rounded-md h-8 w-40 bg-neutral-200 dark:bg-slate-200"></h2>
                    <small class="rounded-md h-4 w-28 bg-neutral-200 dark:bg-slate-200"></small>
                </div>
            </div>
        </div>
    </div>
</template>