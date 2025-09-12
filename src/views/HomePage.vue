<template>
  <div class="min-h-screen bg-[#f4f6f9] p-8">

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(route, key) in routes" :key="key"
        class="bg-white shadow-md border border-gray-200 p-5 hover:shadow-lg transition duration-200">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-gray-900">{{ route.Name }}</h2>
            <p class="text-[12px] text-gray-500">{{ route.AverageDestinationTime }}</p>
          </div>
          <span class="text-[10px] uppercase bg-black text-white px-2 py-1 tracking-wide">
            {{ route.TravelMode }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-y-3 text-[13px] text-gray-700">
          <div>
            <p class="text-gray-400">Distance</p>
            <p>{{ route.DistanceKM || '-'}} km / {{ route.DistanceMIL || '-' }} mi</p>
          </div>
          <div>
            <p class="text-gray-400">Fuel</p>
            <p>{{ route.FuelType  ||'-'}} • {{ route.CombinedConsumptionMPG ||'-' }} MPG</p>
          </div>
          <div>
            <p class="text-gray-400">Fuel Cost</p>
            <p>${{ route.TotalGallonCost || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400">Toll</p>
            <p v-if="route.TollRoadEstimatedPriceDollar">${{ route.TollRoadEstimatedPriceDollar}}</p>
            <p v-else>Paid route information could not be obtained.</p>
          </div>
          <div>
            <p class="text-gray-400">Car</p>
            <p>{{ route.CarBrand || '-' }} {{ route.CarModel || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400">Engine</p>
            <p>{{ route.EngineDisplacement || '-' }}L</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-5 flex justify-between items-center border-t pt-3">
          <div class="text-[11px] text-gray-400 leading-tight">
            From {{ route.StartLocation}}<br />
            To {{ route.DestinationLocation }}
          </div>
          <div class="text-right">
            <p class="text-[12px] text-gray-400">Total Cost</p>
            <p class="text-[15px] font-semibold text-black">${{ route.TotalCost }}</p>
          </div>
        </div>

        <!-- View Detail Button -->
        <div class="mt-4 flex justify-end">
          <button @click="handleViewDetail(route._id, route.ProcessId)"
            class="text-[12px] font-semibold tracking-wide uppercase px-4 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition duration-150 ease-in-out">
            View Detail
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {UseStore} from '../stores/store';
import axios from 'axios';
export default {
  name: "App",
  setup(){
    var store = UseStore();
    return{
      store
    }
  },
  data() {
    return{
      routes: []
    }
  },
  async mounted(){
    await this.calculated_routes_service();
  },
  methods:{
    handleViewDetail(_id, ProcessId){
      this.$router.push({ name: 'CalculatedRouteDetail', params: { _id: _id, ProcessId: ProcessId }});
    },
    async calculated_routes_service(){
      try{
        var res = await axios.get(`/calculated/routes`);
        console.log(res);
        if(res.status === 200 ) this.routes = res.data.Routes;
        else return;
      }catch(err){
        console.log(err);
      }
    }
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
