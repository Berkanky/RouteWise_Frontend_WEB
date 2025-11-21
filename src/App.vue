<template>
  <AppNavbar v-if="!this.is_mobile_active"/>
  <main class="min-h-[100svh] overflow-x-hidden bg-white pt-16 has-fixed-footer">
    <router-view />
  </main>
  <AppFooter class="hidden md:block print:hidden"/>
</template>

<script>
import { UseStore } from "./stores/store";
import AppNavbar from "./components/AppNavbar.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppNavbar,
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
      window_with: window.innerWidth
    };
  },
  async created(){
    await this.store.user_details_service();
  },
  mounted() {
    window.addEventListener("resize", this.on_resize());
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.on_resize());
  },
  methods:{
    on_resize() {
      this.window_with = window.innerWidth;
    }
  },
  computed:{
    is_mobile_active() {
      var auth_pages = ["Login", "LoginTOTPVerify", "TOTPVerify", "PasswordResetStart", "PasswordResetVerify", "PasswordReset", "Register"];
      var current_route_name = this.$route.name;

      var is_current_route_auth_page = auth_pages.some(function(item){ return item === current_route_name});

      return this.window_with < 768 && is_current_route_auth_page ? true : false;
    }
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