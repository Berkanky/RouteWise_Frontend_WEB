<template>
  <Disclosure as="header" class="w-full bg-white shadow-sm backdrop-blur z-50">
    <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <!-- Desktop Header -->
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
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]" @click="toggleMobileMenu(false)"></div>

          <div
            class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[100] overflow-y-auto flex flex-col justify-between rounded-tr-2xl rounded-br-2xl">

            <!-- Top: Map + User Info -->
            <div>
              <div class="relative mb-4">
                <img src="../images/RouteWiseMapV2.jpg" alt="Map Header"
                  class="w-full h-44 object-cover rounded-b-md" />
                <div class="absolute top-2 left-2">
                  <img src="../images/RouteWise-3D-İcon.png" class="h-6 w-6" alt="Mini Logo" />
                </div>
                <div
                  class="absolute bottom-0 left-0 w-full bg-zinc-900/50 text-white text-center text-sm py-2 backdrop-blur-sm">
                  <p class="font-semibold">{{ store.UserData?.UserName || 'User' }}</p>
                  <p class="text-xs opacity-80">Created: {{ formatDate(store.UserData?.CreatedDate) }}</p>
                </div>
              </div>

              <!-- Nav Items -->
              <nav class="flex flex-col text-zinc-800 text-base font-medium px-3 space-y-3" v-if="Active">
                <RouterLink to="/home" @click="toggleMobileMenu(false)" :class="['flex items-center gap-2 py-2 px-2 relative transition-all duration-150',
                  isActive('/home') ? 'bg-zinc-100 rounded-md' : '']">
                  <ChevronDoubleRightIcon v-if="isActive('/home')" class="w-4 h-4 text-zinc-400" />
                  <HomeIcon v-else class="w-5 h-5 text-zinc-500" />
                  <span>Home</span>
                  <span class="absolute bottom-0 left-2 right-2 h-px"
                    :class="isActive('/home') ? 'bg-gradient-to-r from-white/0 via-zinc-400 to-white/0' : 'bg-transparent'"></span>
                </RouterLink>

                <a href="#" @click="toggleMobileMenu(false)" :class="['flex items-center gap-2 py-2 px-2 relative transition-all duration-150',
                  isActive('/about') ? 'bg-zinc-100 rounded-md' : '']">
                  <ChevronDoubleRightIcon v-if="isActive('/about')" class="w-4 h-4 text-zinc-400" />
                  <InformationCircleIcon v-else class="w-5 h-5 text-zinc-500" />
                  <span>About</span>
                  <span class="absolute bottom-0 left-2 right-2 h-px"
                    :class="isActive('/about') ? 'bg-gradient-to-r from-white/0 via-zinc-400 to-white/0' : 'bg-transparent'"></span>
                </a>

                <a href="#" @click="toggleMobileMenu(false)" :class="['flex items-center gap-2 py-2 px-2 relative transition-all duration-150',
                  isActive('/contact') ? 'bg-zinc-100 rounded-md' : '']">
                  <ChevronDoubleRightIcon v-if="isActive('/contact')" class="w-4 h-4 text-zinc-400" />
                  <PhoneIcon v-else class="w-5 h-5 text-zinc-500" />
                  <span>Contact</span>
                  <span class="absolute bottom-0 left-2 right-2 h-px"
                    :class="isActive('/contact') ? 'bg-gradient-to-r from-white/0 via-zinc-400 to-white/0' : 'bg-transparent'"></span>
                </a>

                <RouterLink to="/start/calculate/route" @click="toggleMobileMenu(false)" :class="['flex items-center gap-2 py-2 px-2 relative transition-all duration-150',
                  isActive('/start/calculate/route') ? 'bg-zinc-100 rounded-md' : '']">
                  <ChevronDoubleRightIcon v-if="isActive('/start/calculate/route')" class="w-4 h-4 text-zinc-400" />
                  <MapIcon v-else class="w-5 h-5 text-zinc-500" />
                  <span>Route</span>
                  <span class="absolute bottom-0 left-2 right-2 h-px"
                    :class="isActive('/start/calculate/route') ? 'bg-gradient-to-r from-white/0 via-zinc-400 to-white/0' : 'bg-transparent'"></span>
                </RouterLink>
              </nav>
            </div>

            <!-- Bottom: Latest Calculations + App Version + Logout -->
            <div class="px-3">
              <!-- Latest Calculations Card -->
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

              <!-- App Version -->
              <p class="text-center text-[10px] text-zinc-400 mb-3 opacity-70">app_version {{ store.AppVersion }}</p>

              <!-- Logout -->
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