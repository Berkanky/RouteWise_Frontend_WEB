<template>
  <AppNavbar />
  <main class="mx-auto max-w-7xl px-4 py-10">
    <router-view />
  </main>
</template>


<script>
import {UseStore} from './stores/store';
import AppNavbar from './components/AppNavbar.vue'
import AppModal from './components/AppModal.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppModal
  },
  setup(){
    const store = UseStore();
    return{
      store
    }
  },
  data() {
    return {
      showModal: false
    }
  },
  mounted(){
    this.store.WatchServices();
  }
}
</script>
