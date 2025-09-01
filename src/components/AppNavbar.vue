<template>
  <Disclosure as="header" class="w-full border-b border-zinc-200/70 bg-white/80 backdrop-blur">
    <div class="mx-auto max-w-6xl px-4 md:px-6 h-14 flex items-center justify-between">
      <!-- Brand -->
      <div class="flex items-center gap-2">
        <span class="inline-block h-3.5 w-3.5 rounded-[3px] bg-black"></span>
        <span class="font-semibold text-zinc-900">RouteWise</span>
      </div>

      <!-- Desktop links -->
      <nav class="hidden md:flex items-center gap-8 text-sm text-zinc-700">
        <RouterLink to="/home" class="hover:text-black" v-if="this.Active">Home</RouterLink>
        <a href="#" class="hover:text-black">About</a>
        <a href="#" class="hover:text-black">Contact</a>
        <a href="/start/calculate/route" class="hover:text-black" v-if="this.Active">RouteWise</a>
      </nav>

      <!-- Right -->
      <div class="hidden md:block">
        <RouterLink
          v-if="this.Active"
          v-on:click="LogoutService()"
          to="/login"
          class="rounded-full bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm">
          Logout
        </RouterLink>
      </div>
      
      <!-- Mobile menu button -->
      <DisclosureButton
        class="md:hidden inline-flex items-center justify-center rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100">
        <span class="sr-only">Open menu</span>
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </DisclosureButton>
    </div>

    <!-- Mobile panel -->
    <DisclosurePanel class="md:hidden border-t border-zinc-200 px-4 pb-3">
      <nav class="flex flex-col text-sm text-zinc-700">
        <RouterLink to="/home" class="py-2 hover:text-black" v-if="this.Active">Home</RouterLink>
        <a href="#" class="py-2 hover:text-black">About</a>
        <a href="#" class="py-2 hover:text-black">Contact</a>
        <a href="/start/calculate/route" class="hover:text-black" v-if="this.Active">RouteWise</a>
        <RouterLink
          v-if="this.Active"
          v-on:click="LogoutService()"
          class="mt-2 inline-flex w-max rounded-full bg-zinc-100 hover:bg-zinc-200 px-4 py-2 font-medium text-zinc-800 shadow-sm">
          Logout
        </RouterLink>
      </nav>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { UseStore } from '../stores/store';
import axios from 'axios';
export default {
  name: 'AppNavbar',
  components: { Disclosure, DisclosureButton, DisclosurePanel },
  setup(){
    const store = UseStore();
    return{
      store
    }
  },
  data:function(){
    return{
      Active: false
    }
  },
  methods:{
    async LogoutService(){
      try{
        var res = await axios.put("/logout");
        if(res.status === 200 ) {
          this.store.ResetPiniaStore();
          this.$router.replace({name:'Login'});
        }
      }catch(err){
        console.log(err);
      }
    }
  },
  watch:{
    'store.UserData':{
      handler(newVal){
        if(Object.keys(newVal).length && 'Active' in newVal && newVal["Active"]) this.Active = true;
        else this.Active = false;

        console.log("User Active : ", this.Active);
      },
      immediate: true, deep: true
    }
  }
}
</script>