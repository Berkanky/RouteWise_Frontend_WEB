<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="open = false">
      <div class="fixed inset-0 bg-black/40" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl">
            <DialogTitle class="text-lg font-semibold">Modal Başlık</DialogTitle>
            <div class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              İçerik buraya.
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button class="px-3 py-1.5 rounded-lg border" @click="open = false">İptal</button>
              <button class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white" @click="open = false">
                Tamam
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'

export default {
  name: 'AppModal',
  components: { Dialog, DialogPanel, DialogTitle, TransitionRoot },

  // v-model
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],

  computed: {
    open: {
      get() { return this.modelValue },
      set(v) { this.$emit('update:modelValue', v) }
    }
  }
}
</script>