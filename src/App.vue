<template>
  <AppNavbar v-if="!this.is_mobile_active"/>
  <main class="min-h-[100svh] overflow-x-hidden bg-zinc-50 pt-16">
    <router-view />
  </main>
</template>

<script>
import { UseStore } from "./stores/store";
import AppNavbar from "./components/AppNavbar.vue";
import AppModal from "./components/AppModal.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppNavbar,
    AppModal,
    AppFooter,
  },
  setup() {
    const store = UseStore();
    return {
      store
    };
  },
  data() {
    return {
      showModal: false,
      isMobileMenuOpen: false,
      isMobile: window.innerWidth < 768
    };
  },
  created(){
    window.addEventListener('resize', this.updateMobileStatus)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMobileStatus)
  },
  computed:{
    is_mobile_active() {
      this.isMobile = window.innerWidth < 768;
      return this.isMobile;
    }
  },
  mounted() {
    this.store.WatchServices();
  },
  methods:{
    updateMobileStatus() {
      this.isMobile = window.innerWidth < 768
    },
  }
};
</script>

<style>
html,
body,
#app {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI,
    Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: auto;
  min-height: 100%;
  overflow-y: auto;
}
</style>