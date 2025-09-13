<template>
  <div class="bg-white shadow-md rounded-xl p-4 space-y-2">
    <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
      ⛽ Fuel & Cost
    </h2>

    <div class="text-sm text-gray-700">
      <span class="font-medium">City MPG:</span> {{ cityMPG }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Highway MPG:</span> {{ highwayMPG }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Combined MPG:</span> {{ combinedMPG }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Gallon Price:</span> ${{ gallonPrice.toFixed(2) }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Total Gallons:</span> {{ totalGallon.toFixed(2) }}
    </div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">Fuel Cost:</span> ${{ totalGallonCost.toFixed(2) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FuelCostCard',
  props: {
    cityMPG: Number,
    highwayMPG: Number,
    combinedMPG: Number,
    gallonPrice: Number,
    totalGallon: Number,
    totalGallonCost: Number
  }
}
</script>