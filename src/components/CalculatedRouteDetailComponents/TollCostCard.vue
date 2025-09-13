<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🛣️ Toll Costs
    </h2>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Estimated Toll:</span> ${{ tollCost.toFixed(2) }}
    </div>

    <div class="text-sm text-gray-700">
      <span class="font-medium">Toll Passes:</span>
      <ul class="list-disc ml-5">
        <li v-for="pass in tollPasses" :key="pass">{{ pass }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TollCostCard',
  props: {
    tollCost: Number,
    tollPasses: Array
  }
}
</script>