<script>
export default {
    props: {
        modalActive: {
            type: Boolean
        }
    }
}
</script>

<template>
    <Transition name="modal">
        <div v-show="modalActive" class="absolute flex min-h-screen w-full top-0 left-0 z-30 bg-black bg-opacity-10 backdrop-blur-sm justify-center items-center">
            <Transition name="modal-inner">
                <div v-show="modalActive" class="bg-white dark:bg-slate-800 rounded-2xl p-4 w-96 shadow-lg flex flex-col items-center justify-center">
                    <slot></slot>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    @apply transition-opacity duration-300
}

.modal-enter-from,
.modal-leave-to {
    @apply opacity-0
}

.modal-inner-enter-active,
.modal-inner-leave-active {
    @apply transition-all duration-300
}

.modal-inner-enter-from {
    @apply opacity-0 scale-75
}

.modal-inner-leave-to {
    @apply scale-75
}
</style>