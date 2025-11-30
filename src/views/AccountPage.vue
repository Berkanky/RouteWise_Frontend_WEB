<template>
  <AccountDetails/>
</template>

<script>
import AccountDetails from '../components/AccountDetails.vue';
import { UseStore } from '../stores/store';
export default {
  components:{
    AccountDetails
  },
  setup(){
    const store = UseStore();
    return{
      store
    }
  },
  beforeRouteEnter(to, from, next){
    next((vm) => {
      var mobile_active = vm.store.mobile_active;
      if( !mobile_active ) vm.$router.replace({name: 'Home'});
    });
  }
}
</script>