<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalItems: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        },
        pageRange: {
            type: Number,
            default: 2
        },
        totalPages: {
            type: Number,
            required: true
        },
    },
    computed: {
        isFirstPage() {
            return this.currentPage === 1
        },
        isLastPage() {
            return this.currentPage >= this.totalPages
        },
        rangeStart() {
            let start = this.currentPage - this.pageRange
            return (start > 0) ? start : 1
        },
        rangeEnd() {
            let end = (this.currentPage + this.pageRange)
            return (end < this.totalPages) ? end : this.totalPages
        },
        hasFirst() {
            return this.rangeStart !== 1
        },
        hasLast() {
            return this.rangeEnd !== this.totalPages
        },
        calculatedPages() {
            let pages = []
            for(let i = this.rangeStart; i <= this.rangeEnd; i++) {
                pages.push(i)
            }
            return pages
        },
        paginationFrom() {
            return (this.perPage * (this.currentPage - 1)) + 1
        },
        paginationTo() {
            let end = (this.currentPage * this.perPage)
            return this.totalItems < end ? this.totalItems : end
        }
    },
    methods: {
        changePage(page) {
            if(page > 0 && page <= this.totalPages) {
                this.$emit('pagechanged', page)
            }
        }
    },
}
</script>

<template>
    <div class="flex justify-between items-center">
        <span class="text-sm text-neutral-700 dark:text-slate-300">
            Menampilkan {{ paginationFrom }} sampai {{ paginationTo }} dari total {{ totalItems }} entri
        </span>
        <nav class="inline-flex shadow-sm" aria-label="Pagination">
            <a href="#"
                class="inline-flex items-center p-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                :class="{ 'cursor-not-allowed bg-neutral-200 dark:bg-slate-600': isFirstPage }" :disabled="isFirstPage"
                @click.prevent="changePage(currentPage - 1)">
                <font-awesome-icon icon="fa-solid fa-angle-left" />
            </a>
            <a href="#" aria-current="page"
                class="inline-flex items-center px-3 py-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                @click.prevent="changePage(1)" v-if="hasFirst">
                1
            </a>
            <span
                class="inline-flex items-center px-3 py-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                v-if="hasFirst">
                ...
            </span>
            <a href="#" aria-current="page" v-for="(page, index) in calculatedPages" :key="index"
                class="inline-flex items-center px-3 py-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                :class="{ 'bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-600 !border-blue-500 !text-white': currentPage === page }"
                @click.prevent="changePage(page)">
                {{ page }}
            </a>
            <span
                class="inline-flex items-center px-3 py-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                v-if="hasLast">
                ...
            </span>
            <a href="#" aria-current="page"
                class="inline-flex items-center px-3 py-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                @click.prevent="changePage(totalPages)" v-if="hasLast">
                {{ totalPages }}
            </a>
            <a href="#"
                class="inline-flex items-center p-2 first:rounded-l-lg last:rounded-r-lg border dark:border-slate-600 text-sm font-medium text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
                :class="{ 'cursor-not-allowed bg-neutral-200 dark:bg-slate-600': isLastPage }" :disabled="isLastPage"
                @click.prevent="changePage(currentPage + 1)">
                <font-awesome-icon icon="fa-solid fa-angle-right" />
            </a>
        </nav>
    </div>
</template>