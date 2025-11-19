<template>
  <Disclosure as="header" class="fixed top-0 left-0 right-0 w-full bg-white shadow-sm backdrop-blur z-50">
    <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center">
      <div class="flex items-center gap-2" v-on:click="GoHomePage">
        <img src="../images/RouteWise-3D-İcon.png" alt="RouteWise Logo" class="h-6 w-6" />
        <span class="text-lg font-semibold text-zinc-900">RouteWise</span>
      </div>
      <div class="hidden md:flex flex-1 justify-center">
        <nav v-if="Active" class="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <button class="hover:text-[#e11d48]" @click="GoHomePage">
            Home
          </button>
          <RouterLink to="/start/calculate/route"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e11d48] text-white font-semibold shadow hover:opacity-90 active:scale-[0.98]">
            <MapIcon class="w-4 h-4" />
            <span>Route</span>
          </RouterLink>
        </nav>
      </div>
      <div v-if="Active" class="hidden md:flex">
        <RouterLink @click="LogoutService" to="/login"
          class="bg-[#e11d48]/10 hover:bg-[#e11d48]/20 text-[#e11d48] px-4 py-2 rounded-full text-sm font-medium shadow">
          Logout
        </RouterLink>
      </div>
      <button v-if="Active" @click="toggleMobileMenu(true)"
        class="md:hidden ml-auto inline-flex items-center justify-center p-2 text-zinc-700 hover:bg-zinc-100 rounded">
        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <teleport to="body">
      <transition name="slide-fade">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] md:hidden">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]" @click="toggleMobileMenu(false)"></div>

          <!-- Drawer -->
          <div class="fixed top-0 left-0 h-full w-72 max-w-[78vw] bg-zinc-50/95 backdrop-blur-md z-[100]
               shadow-2xl flex flex-col rounded-r-3xl border-r border-zinc-200"
            :style="{ paddingTop: 'max(env(safe-area-inset-top), 0px)' }">
            <!-- Header / User -->
            <header
              class="px-4 pt-4 pb-3 border-b border-zinc-200/70 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200">
              <div class="flex items-center gap-3">
                <div
                  class="h-11 w-11 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center ring-1 ring-zinc-200/70">
                  <img src="../images/RouteWise-3D-İcon.png" class="h-8 w-8 drop-shadow-sm" alt="App Logo" />
                </div>

                <div class="flex flex-col min-w-0">
                  <p class="text-sm font-semibold text-zinc-900 truncate">
                    {{ store.UserData?.UserName || 'User' }}
                  </p>
                  <p class="text-[11px] text-zinc-500">
                    Joined: {{ formatDate(store.UserData?.CreatedDate) }}
                  </p>
                </div>
              </div>
            </header>

            <!-- Start Route CTA -->
            <div v-if="Active" class="px-4 pt-4">
              <RouterLink to="/start/calculate/route" @click="toggleMobileMenu(false)" class="w-full inline-flex items-center justify-center gap-2
                   py-3 px-4 text-sm font-semibold rounded-xl
                   bg-[#e11d48] text-white shadow-md shadow-rose-500/30
                   active:scale-[0.97] transition-transform">
                <MapIcon class="w-5 h-5" />
                <span>Start a new route</span>
              </RouterLink>
            </div>

            <!-- Navigation -->
            <div class="flex-1 mt-2">
              <nav v-if="Active" class="mt-2 space-y-0.5 text-sm text-zinc-700">
                <p class="px-4 mb-1 text-[10px] font-semibold tracking-wide uppercase text-zinc-400">
                  Navigation
                </p>

                <button v-on:click="GoHomePage()" :class="[
                  'w-full flex items-center gap-3 py-2.5 px-4 text-left rounded-lg transition-all',
                  isActive('Home')
                    ? 'bg-zinc-900/5 text-zinc-900 font-medium border-l-2 border-[#e11d48]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                ]">
                  <HomeIcon class="w-5 h-5" />
                  <span>Home</span>
                </button>

                <!-- Diğer menüler için buraya aynı patternle ekleme yaparsın -->
                <!--
            <button ...>History</button>
            <button ...>Saved routes</button>
            -->
              </nav>
            </div>

            <!-- Footer / Version & Logout -->
            <footer class="px-4 pb-4 pt-3 border-t border-zinc-200/70 bg-white/95">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[10px] text-zinc-400">
                  app_version {{ store.AppVersion }}
                </p>
                <div class="flex items-center gap-1">
                  <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span class="text-[10px] text-zinc-400">Online</span>
                </div>
              </div>

              <button @click="() => { LogoutService(); toggleMobileMenu(false); }" class="w-full inline-flex items-center justify-center gap-2
                   px-4 py-2.5 text-sm font-semibold
                   rounded-lg border border-zinc-200
                   bg-zinc-50 text-zinc-800
                   hover:bg-zinc-100 active:scale-[0.98]
                   shadow-sm">
                <ArrowLeftOnRectangleIcon class="w-5 h-5 text-zinc-500" />
                <span>Logout</span>
              </button>
            </footer>
          </div>
        </div>
      </transition>
    </teleport>
  </Disclosure>
</template>

<script>
import { Disclosure } from '@headlessui/vue'
import { UseStore } from '../stores/store'
import axios from 'axios'
import {
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  MapIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'AppNavbar',
  components: {
    Disclosure,
    HomeIcon,
    InformationCircleIcon,
    PhoneIcon,
    MapIcon,
    ArrowLeftOnRectangleIcon,
    ChevronDoubleRightIcon,
    ChevronRightIcon
  },
  setup() {
    const store = UseStore()
    return { store }
  },
  data() {
    return {
      Active: false,
      isMobileMenuOpen: false
    }
  },
  methods: {
    GoAccountPage() {
      this.$router.push({ name: 'Account', query: { _id: this.store.UserData._id } });
    },
    GoHomePage() {

      this.$router.push({ name: 'Home', query: { Page: 1 } });
      this.toggleMobileMenu(false);
    },
    async LogoutService() {
      try {

        var res = await axios.put("/logout");
        if (res.status !== 200) return;

        this.store.ResetPiniaStore();
        this.$router.replace({ name: 'Login' });

      } catch (err) {
        console.log(err);
        return;
      }
    },
    toggleMobileMenu(open) {
      this.isMobileMenuOpen = open;
      document.body.classList.toggle('overflow-hidden', open);
    },
    formatDate(dateStr) {

      if (!dateStr) return '-';
      var date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    isActive(name) {
      return this.$route.name === name;
    }
  },
  watch: {
    'store.UserData': {
      handler(newVal) {
        this.Active = newVal?.Active === true
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>