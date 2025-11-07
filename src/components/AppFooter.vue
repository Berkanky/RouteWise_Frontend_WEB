<template>
  <footer class="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-800/70 bg-zinc-900/95 backdrop-blur
           dark:border-zinc-700/70 dark:bg-zinc-950/95">
    <div class="mx-auto max-w-6xl px-4 md:px-6 h-14 flex items-center justify-between"
      style="padding-bottom: env(safe-area-inset-bottom);">
      <div class="text-sm text-zinc-400">
        {{ store.WebAppName }} © {{ new Date().getFullYear() }}
      </div>
      <div class="hidden md:flex gap-4 text-sm text-zinc-500">
        <router-link to="/about" class="hover:text-zinc-300">About</router-link>
        <router-link to="/privacy" class="hover:text-zinc-300">Privacy</router-link>
        <router-link to="/support" class="hover:text-zinc-300">Support</router-link>
      </div>
      <div class="flex items-center gap-3 text-sm text-zinc-400">
        <span>v{{ store.AppVersion }}</span>
        <span class="flex items-center gap-1" v-if="this.store.UserData?.Active">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
        </span>
      </div>
    </div>
  </footer>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
  name: 'AppFooter',
  setup() {
    var store = UseStore();
    return {
      store
    }
  }
}
</script>