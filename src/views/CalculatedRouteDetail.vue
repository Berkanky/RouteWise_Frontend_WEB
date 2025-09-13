<template>
  <div class="space-y-4">
    {{ JSON.stringify(this.calculated_route_detail) || 'no data' }}
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CalculatedRouteDetail',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data:function(){
    return{
        _id: null,
        ProcessId: null,
        calculated_route_detail: {}
    }
  },
  async mounted(){
    var { _id, ProcessId } = this.$route.params;

    this._id = _id;
    this.ProcessId = ProcessId;

    try{
      var res = await axios.post("/calculated/route/detail", { _id: _id }, {});
      console.log(res);
      if(res.status === 200 ) this.calculated_route_detail = res.data.decrypted_calculated_route_detail;
    }catch(err){
      console.log(err);
    }
  }
}
</script>