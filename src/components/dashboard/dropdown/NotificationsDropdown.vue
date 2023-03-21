<script>
export default {
    data() {
        return {
            isOpen: false
        }
    }
}
</script>

<template>
    <div class="relative">
        <button type="button" @click="isOpen = !isOpen"
            class="relative text-xl hover:text-neutral-600 dark:hover:text-slate-200 group"
            :class="isOpen ? 'text-neutral-600 dark:text-slate-200' : 'text-neutral-400 dark:text-slate-400'">
            <font-awesome-icon icon="fa-regular fa-bell" />
            <span
                class="absolute -right-2 top-0 text-xs px-1 py-0 bg-red-500 z-10 text-white rounded-xl group-hover:bg-red-400">3</span>
        </button>
        <div class="fixed z-10 inset-0 h-full w-full" v-show="isOpen" @click="isOpen = !isOpen"></div>
        <!-- Notification Dropdown -->
        <Transition name="fadedown">
            <div v-show="isOpen"
                class="absolute top-8 -right-2 w-72 z-20 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 flex flex-col items-center shadow-lg divide-y dark:divide-slate-700">
                <span class="w-full text-center text-sm py-2 text-neutral-400 dark:text-slate-400">3 Notifikasi</span>
                <!-- Notification List -->
                <div class="flex w-full p-2 space-x-2 hover:bg-neutral-100 dark:hover:bg-slate-700 cursor-pointer">
                    <img src="@/assets/images/user.jpg" alt="Profile Photo" class="h-10 rounded-full">
                    <span class="text-md text-neutral-500 dark:text-slate-300"><b class="text-neutral-700 dark:text-slate-200">John
                            Doe</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, repellendus!</span>
                </div>
                <div class="flex w-full p-2 space-x-2 hover:bg-neutral-100 dark:hover:bg-slate-700 cursor-pointer">
                    <img src="@/assets/images/user.jpg" alt="Profile Photo" class="h-10 rounded-full">
                    <span class="text-md text-neutral-500 dark:text-slate-300"><b class="text-neutral-700 dark:text-slate-200">John
                            Doe</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, repellendus!</span>
                </div>
                <div class="flex w-full p-2 space-x-2 hover:bg-neutral-100 dark:hover:bg-slate-700 cursor-pointer">
                    <img src="@/assets/images/user.jpg" alt="Profile Photo" class="h-10 rounded-full">
                    <span class="text-md text-neutral-500 dark:text-slate-300"><b class="text-neutral-700 dark:text-slate-200">John
                            Doe</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, repellendus!</span>
                </div>
                <!-- See All Notifications -->
                <button type="button"
                    class="w-full text-center text-sm py-2 text-neutral-400 dark:text-slate-400 hover:text-neutral-600 dark:hover:text-slate-200">Lihat
                    Semua Notifikasi</button>
            </div>
        </Transition>
    </div>
</template>

<style>
.fadedown-enter-active,
.fadedown-leave-active {
    @apply transition-all duration-150 ease-out
}

.fadedown-enter-from,
.fadedown-leave-to {
    @apply opacity-0 -translate-y-4
}
</style>