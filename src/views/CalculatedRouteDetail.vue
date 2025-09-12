<template>
  <div>
    {{ this._id }} - {{ this.ProcessId }}
  </div>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup(){
        var store = UseStore();
        return{
            store
        }
    },
    data:function(){
        return{
            _id: '',
            ProcessId: ''
        }
    },
    async mounted(){
        var { _id, ProcessId } = this.$route.params;
        console.log(_id, ProcessId);

        if( _id ) this._id = _id;
        if( ProcessId ) this.ProcessId = ProcessId;


    }
}
</script>

<style>

</style>