<template>
  <AppNavbar v-if="!this.is_mobile_active"/>
  <main class="min-h-[100svh] overflow-x-hidden bg-zinc-50 pt-16 has-fixed-footer">
    <router-view />
  </main>
  <AppFooter class="hidden md:block print:hidden"/>
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
      var auth_pages = ["Login", "LoginTOTPVerify", "TOTPVerify", "PasswordResetStart", "PasswordResetVerify", "PasswordReset", "Register"];
      var current_route_name = this.$route.name;

      var is_current_route_auth_page = auth_pages.some(function(item){ return item === current_route_name});

      this.isMobile = window.innerWidth < 768 && is_current_route_auth_page ? true : false;
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

::-webkit-scrollbar {
  width: 8px;        
  height: 8px;       
}

::-webkit-scrollbar-track {
  background: transparent; 
  margin: 4px;          
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.25); 
  border-radius: 9999px;              
  border: 2px solid transparent;   
  background-clip: content-box;       
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0,0,0,0.45);
}

* {
  scrollbar-width: thin;       
  scrollbar-color: rgba(0,0,0,0.3) transparent;
}

@media (min-width: 768px) {
  .has-fixed-footer {
    padding-bottom: calc(env(safe-area-inset-bottom) + 56px);
  }
}
</style>