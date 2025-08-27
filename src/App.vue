<template>
  <AppNavbar />
  <main class="min-h-screen bg-zinc-50 overflow-x-hidden">
    <router-view />
  </main>
  <AppFooter />
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
      store,
    };
  },
  data() {
    return {
      showModal: false,
    };
  },
  mounted() {
    this.store.WatchServices();
  },
};
</script>
