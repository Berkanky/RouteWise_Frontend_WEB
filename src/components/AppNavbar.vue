<template>
  <Disclosure as="header" class="fixed top-0 left-0 right-0 w-full bg-white shadow-sm backdrop-blur z-50">
    <!-- Top Bar -->
    <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2">
        <img src="../images/RouteWise-3D-İcon.png" alt="RouteWise Logo" class="h-6 w-6" />
        <span class="text-lg font-semibold text-zinc-900">RouteWise</span>
      </div>

      <!-- Desktop Nav -->
      <nav v-if="Active" class="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
        <RouterLink to="/home" class="hover:text-[#e11d48]">Home</RouterLink>
        <a href="#" class="hover:text-[#e11d48]">About</a>
        <a href="#" class="hover:text-[#e11d48]">Contact</a>
        <RouterLink to="/start/calculate/route" class="hover:text-[#e11d48]">Route</RouterLink>
      </nav>

      <!-- Desktop Logout -->
      <div v-if="Active" class="hidden md:block">
        <RouterLink @click="LogoutService" to="/login"
          class="bg-[#e11d48]/10 hover:bg-[#e11d48]/20 text-[#e11d48] px-4 py-2 rounded-full text-sm font-medium shadow">
          Logout
        </RouterLink>
      </div>

      <!-- Mobile Toggle -->
      <button v-if="Active" @click="toggleMobileMenu(true)"
        class="md:hidden inline-flex items-center justify-center p-2 text-zinc-700 hover:bg-zinc-100 rounded">
        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <teleport to="body">
      <transition name="slide-fade">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] md:hidden">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]" @click="toggleMobileMenu(false)"></div>

          <!-- Drawer -->
          <div
            class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[100] overflow-y-auto flex flex-col justify-between rounded-tr-lg rounded-br-lg">

            <!-- Gradient Header + Logo + User Info -->
            <div class="relative h-40 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 
            flex flex-col items-center justify-center text-zinc-800 rounded-tr-2xl">
              <img src="../images/RouteWise-3D-İcon.png" class="h-14 w-14 mb-2 drop-shadow" alt="App Logo" />
              <p class="font-semibold">{{ store.UserData?.UserName || 'User' }}</p>
              <p class="text-xs text-zinc-500 opacity-80">Created: {{ formatDate(store.UserData?.CreatedDate) }}</p>
            </div>


            <!-- Navigation -->
            <div class="flex-1 mt-4">
              <!-- Nav Items -->
              <nav class="flex flex-col text-zinc-700 text-sm font-normal mt-3 space-y-2" v-if="Active">
                <RouterLink to="/home" @click="toggleMobileMenu(false)" :class="['flex items-center gap-3 py-2 px-3 rounded-md transition-colors',
                  isActive('/home') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-800']">
                  <HomeIcon class="w-5 h-5" />
                  <span>Home</span>
                </RouterLink>

                <RouterLink to="/about" @click="toggleMobileMenu(false)" :class="['flex items-center gap-3 py-2 px-3 rounded-md transition-colors',
                  isActive('/about') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-800']">
                  <InformationCircleIcon class="w-5 h-5" />
                  <span>About</span>
                </RouterLink>

                <RouterLink to="/contact" @click="toggleMobileMenu(false)" :class="['flex items-center gap-3 py-2 px-3 rounded-md transition-colors',
                  isActive('/contact') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-800']">
                  <PhoneIcon class="w-5 h-5" />
                  <span>Contact</span>
                </RouterLink>

                <RouterLink to="/start/calculate/route" @click="toggleMobileMenu(false)" :class="['flex items-center gap-3 py-2 px-3 rounded-md transition-colors',
                  isActive('/start/calculate/route') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-800']">
                  <MapIcon class="w-5 h-5" />
                  <span>Route</span>
                </RouterLink>
              </nav>


            </div>

            <!-- Bottom: Latest Calculations + Version + Logout -->
            <div class="px-3">
              <div
                class="mb-4 p-3 bg-zinc-50 rounded-xl shadow-sm flex items-center justify-between hover:bg-zinc-100 transition-all cursor-pointer"
                @click="goToRecentRoutes">
                <img src="../images/RouteWise-3D-İcon.png" class="h-10 w-10 rounded-md" alt="RouteWise Icon" />
                <div class="flex-1 ml-3">
                  <p class="text-sm font-semibold text-zinc-800">RouteWise</p>
                  <p class="text-xs text-zinc-500">Latest calculations</p>
                </div>
                <ChevronRightIcon class="h-4 w-4 text-zinc-400" />
              </div>

              <p class="text-center text-[10px] text-zinc-400 mb-3 opacity-70">app_version {{ store.AppVersion }}</p>

              <button @click="() => { LogoutService(); toggleMobileMenu(false); }"
                class="w-full px-5 py-3 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-100 border-t border-zinc-200 shadow-[0_-1px_2px_rgba(0,0,0,0.05)] flex items-center gap-2 justify-center rounded-b-2xl">
                <ArrowLeftOnRectangleIcon class="w-5 h-5 text-zinc-500" />
                Logout
              </button>
            </div>
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
    async LogoutService() {
      try {
        const res = await axios.put("/logout")
        if (res.status === 200) {
          this.store.ResetPiniaStore()
          this.$router.replace({ name: 'Login' })
        }
      } catch (err) {
        console.log(err)
      }
    },
    toggleMobileMenu(open) {
      this.isMobileMenuOpen = open
      document.body.classList.toggle('overflow-hidden', open)
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    isActive(path) {
      return this.$route.path === path
    },
    goToRecentRoutes() {
      this.toggleMobileMenu(false)
      this.$router.push('/history') // rota değişirse burayı güncelle
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