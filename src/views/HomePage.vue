<template>
    <div>
        home
    </div>
</template>

<script>
import {UseStore} from '../stores/store';
export default {
  name: 'HomePage',
  setup(){
    const store = UseStore();
    return{
      store
    }
  },
  data() {
    return {
    }
  }
}
</script>